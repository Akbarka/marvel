import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMarvelService } from "../../services/MarvelService";
import { setContent } from "../../utils/setContent";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { getCharacter, clearError, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    updateChar();
  }, []);

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    clearError();
    const { charId } = props;
    if (!charId) {
      return;
    }

    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => {
        setProcess("confirmed");
      });
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  return (
    <div className="char__info">
      {setContent(process, View, char)}
    </div>
  );
};

const View = ({ data }) => {
  const { name, description, thumbnail, homePage, wiki, comics } = data;

  let imgStyle = { objectFit: "cover" };
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = {
      objectFit: "contain",
    };
  }

  return (
    <>
      <div className="char__basics">
        <img style={imgStyle} src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homePage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comics with this character"}
        {comics.map((item, index) => {
          if (index > 9) return;
          return (
            <li key={index} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export { CharInfo };
