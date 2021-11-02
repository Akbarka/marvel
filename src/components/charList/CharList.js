import React from 'react'
import { Component } from "react";
import PropTypes from 'prop-types'
import { MarvelService } from "../../services/MarvelService";
import { Spinner } from "../spinner/Spinner";
import { ErrorMessage } from "../errorMessage/ErrorMessage";
import "./charList.scss";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
    this.myRef = React.createRef()
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList < 9) {
      ended = true;
    }

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  itemsRef = []

  setRef = (ref) => {
    this.itemsRef.push(ref)
  }

  focusOnItem = (id) => {
    this.itemsRef.forEach(item => item.classList.remove('char__item_selected'))
    this.itemsRef[id].classList.add('char__item_selected')
    this.itemsRef[id].focus()
  }

  renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "contain" };
      }

      return (
        <li
          key={item.id}
          tabIndex={0}
          id={item.id}
          onClick={(e) => {
            this.props.onCharSelected(item.id)
            this.focusOnItem(i)
          }}
          onKeyPress={(e) => {
            if(e.key === '' || e.key === 'Enter') {
              this.props.onCharSelected(item.id)
              this.focusOnItem(i)
            }
          }}
          className="char__item"
          ref={this.setRef}
        >
          <img onClick={this.logRef} src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { loading, error, charList, offset, newItemLoading, charEnded } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? this.renderItems(charList) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharListLoaded: PropTypes.func
}

export default CharList;
