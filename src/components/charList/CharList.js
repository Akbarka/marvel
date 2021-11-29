import React, { useMemo } from "react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// import { setContent } from "../../utils/setContent";
import { useMarvelService } from "../../services/MarvelService";
import { Spinner } from "../spinner/Spinner";
import { ErrorMessage } from "../errorMessage/ErrorMessage";

import "./charList.scss";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
    case "confirmed":
      return <Component />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process");
  }
};

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(190);
  const [charEnded, setCharEned] = useState(false);
  const [showList, setShowList] = useState(false);

  const { getAllCharacters, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    setShowList(true);
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList < 9) {
      ended = true;
    }
    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEned(ended);
  };

  const itemsRef = useRef([]);

  const focusOnItem = (id) => {
    itemsRef.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemsRef.current[id].classList.add("char__item_selected");
    itemsRef.current[id].focus();
  };

  const renderItems = (arr) => {
    console.log("render");
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "contain" };
      }

      return (
        <CSSTransition timeout={500} classNames="char__item" key={i}>
          <li
            key={item.id}
            ref={(el) => (itemsRef.current[i] = el)}
            tabIndex={0}
            id={item.id}
            onClick={(e) => {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }}
            onKeyPress={(e) => {
              if (e.key === "" || e.key === "Enter") {
                props.onCharSelected(item.id);
                focusOnItem(i);
              }
            }}
            className="char__item"
          >
            <img src={item.thumbnail} alt={item.name} style={imgStyle} />
            <div className="char__name">{item.name}</div>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  };

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(charList), newItemLoading);
  }, [process]);

  return (
    <div className="char__list">
      {elements}
      <button
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharListLoaded: PropTypes.func,
};

export { CharList };
