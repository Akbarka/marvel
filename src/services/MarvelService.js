import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { request, clearError, process, setProcess } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=38b070ade7dd3594f3f8ffe4805143a2";
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);

    return _transformComics(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : `There is no description for this character 😢`,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homePage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      language: comics.textObjects.language || "en-us",
      price:
        comics.prices[0].price === 0
          ? "not available"
          : `${comics.prices[0].price}$`,
      thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
      comicsDetail: comics.urls[0].url,
      pageCount: comics.pageCount
        ? `${comics.pageCount} pages`
        : "No information about the number of pages",
    };
  };

  return {
    process,
    clearError,
    getAllCharacters,
    getCharacterByName,
    getCharacter,
    getAllComics,
    getComics,
    setProcess
  };
};

export { useMarvelService };
