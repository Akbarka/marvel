import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useMarvelService } from "../../services/MarvelService";
import { ErrorMessage } from "../errorMessage/ErrorMessage";
import { Spinner } from "../spinner/Spinner";

import "./comicsList.scss";

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

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [offset, setOffset] = useState(8);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { getAllComics, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicsListLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList < 8) {
      ended = true;
    }
    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setNewItemLoading(false);
    setOffset(offset + 8);
    setComicsEnded(ended);
  };

  const renderComics = (arr) => {
    const items = arr.map((item, i) => {
      return (
        <CSSTransition classNames="comics__item" timeout={500}>
          <li key={i} className="comics__item">
            <Link to={`/comics/${item.id}`}>
              <img
                src={item.thumbnail}
                alt="ultimate war"
                className="comics__item-img"
              />
              <div className="comics__item-name">{item.title}</div>
              <div className="comics__item-price">{item.price}</div>
            </Link>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className="comics__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  };

  return (
    <div className="comics__list">
      {setContent(process, () => renderComics(comicsList), newItemLoading)}
      <button
        disabled={newItemLoading}
        className="button button__main button__long"
        style={{ display: comicsEnded ? "none" : "block" }}
      >
        <div className="inner" onClick={() => onRequest(offset)}>
          load more
        </div>
      </button>
    </div>
  );
};

export { ComicsList };
