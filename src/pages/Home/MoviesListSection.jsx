import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

import { useInitialFetch } from "@tools/hooks";

import {
  MOVIE_STORAGE_NAME,
  getBackdropURL,
  getSavedMovieTitle,
} from "@static/index";
import { ENDPOINTS } from "@static/api";
import { ArrowIcon, CheckIcon, PlayIcon, StarIcon } from "@components/icons";

function MoviesListSection({ mainMovieId }) {
  const [setup, setSetup] = React.useState("loading");

  const [currentCtg, setCurrentCtg] = React.useState("popular");
  const [changingCategory, setChangingCategory] = React.useState(false);

  var popularList = React.useRef();
  var categoryChangerTimer = React.useRef();

  //Fetch popular movies only when the main movie is already loaded and select the first movies different to the main one.
  useInitialFetch(
    { endpoint: ENDPOINTS.POPULAR, condition: !!mainMovieId },
    function ({ data, error }) {
      if (error) {
        console.error({ error });
        setSetup("error");
        return;
      }

      const { results } = data;
      var firstMovies = results.slice(0, AMOUNT_OF_MOVIES);

      const mainMovieIndex = firstMovies.findIndex((m) => m.id == mainMovieId);
      if (mainMovieIndex >= 0)
        firstMovies = [
          ...results.slice(0, mainMovieIndex),
          ...results.slice(mainMovieIndex + 1, AMOUNT_OF_MOVIES + 1),
        ];

      popularList.current = firstMovies;

      setSetup("success");
    }
  );

  //Clear category changer timeout on unmount.
  React.useEffect(() => {
    return () => {
      if (categoryChangerTimer.current)
        clearTimeout(categoryChangerTimer.current);
    };
  }, []);

  //Hide the list, then change categories while hidden and show the new list.
  function changeCategory(newCtg) {
    if (currentCtg == newCtg) return;

    setChangingCategory(true);

    categoryChangerTimer.current = setTimeout(() => {
      setCurrentCtg(newCtg);
      setChangingCategory(false);
    }, 1000);
  }

  //List of keys (and titles) of all movies saved in the Local Storage.
  const myMoviesList = React.useMemo(() => {
    var list = [];

    for (let ls = 0; ls < localStorage.length; ls++) {
      const key = localStorage.key(ls);

      if (key.includes(MOVIE_STORAGE_NAME)) {
        const savedKey = key;
        const title = getSavedMovieTitle(savedKey);
        list.push({ id: title, title, savedKey });
      }
    }

    return list;
  }, []);

  //All available lists so they can be quickly changed. This can be done because lists are relatively small and/or local.
  const lists = {
    popular: popularList.current,
    myMovies: myMoviesList,
  };

  return (
    <section className="overflow-hidden | lg:absolute lg:z-50 lg:top-18 lg:right-20">
      {/* Category selector */}
      <div
        tabIndex="0"
        className="group relative group mt-12 w-70 mx-auto transition-all duration-300 border-1 h-14 overflow-hidden border-white/0 hover:border-white/50 focus-within:border-white/50 focus-within:h-38 | lg:w-60 lg:h-10 lg:mt-0 lg:focus-within:h-26"
      >
        <h3 className="relative z-20 text-lf-lg text-center py-5 text-bold cursor-pointer | lg:text-lf-base lg:py-3">
          <span className="text-light">VER:</span> {CATEGORIES[currentCtg]}{" "}
          <ArrowIcon className="inline-block transition text-lf-base duration-300 group-focus-within:rotate-180" />
        </h3>

        {Object.keys(CATEGORIES).map((ctg) => (
          <button
            onClick={() => changeCategory(ctg)}
            aria-pressed={currentCtg == ctg}
            key={ctg}
            tabIndex="0"
            className="relative z-20 px-6 py-2 group flex w-full tracking-lf-normal justify-between items-center cursor-pointer text-light transition-all duration-300 overflow-hidden aria-pressed:text-bold hover:text-bold | lg:text-lf-sm-2 lg:py-1 lg:px-4"
          >
            {CATEGORIES[ctg]}{" "}
            <CheckIcon className="mb-1 transition duration-300 translate-x-20 group-aria-pressed:translate-x-0" />
          </button>
        ))}

        <div className="absolute z-10 left-0 top-0 w-full h-full bg-black/10 transition duration-300 group-hover:bg-black/50 hidden | lg:block" />
      </div>

      {/* List of movies for the current category. If fetch not successful yet, shows a fetch state message. If current list is empty, shows the appropiate message. */}
      <div
        data-changing={changingCategory}
        className="transition duration-800 overflow-y-scroll scrollbar-hidden data-[changing=true]:translate-x-150 | lg:h-screen-9/12"
      >
        {setup == "success" ? (
          lists[currentCtg].length > 0 ? (
            lists[currentCtg].map((m) => (
              <MovieBox key={m.id} movieValues={m} currentCtg={currentCtg} />
            ))
          ) : (
            <p className="w-90 mx-auto text-center py-6 mt-8 px-4 leading-lf-relaxed mb-20 border-dashed border-1 bg-lf-gray/50 border-white/40 | lg:w-60 ">
              Sin películas en esta categoría
            </p>
          )
        ) : (
          <div
            data-setup={setup}
            className="mt-10 w-60 mx-auto bg-lf-gray/70 p-4 text-bold text-lf-base-2 leading-lf-relaxed text-center data-[setup=error]:text-red-400"
          >
            <AiOutlineLoading className="animate-spin inline-block w-10 h-10" />
            {SETUP_MESSAGES[setup] && (
              <p className="mt-6">{SETUP_MESSAGES[setup]}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function MovieBox({ movieValues, currentCtg }) {
  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setHidden(false), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <article
      aria-hidden={hidden}
      tabIndex="0"
      style={{
        backgroundImage: `url('${getBackdrop(currentCtg, movieValues)}')`,
      }}
      className="group cursor-pointer bg-clip-padding mt-4 pb-4 rounded-md overflow-hidden relative w-90 mx-auto flex flex-col justify-end items-center h-50 bg-cover bg-center border-1 border-lf-gray transition duration-1000 focus:border-white/50 aria-hidden:opacity-0 aria-hidden:translate-y-10  | lg:border-white/0 lg:w-60 lg:h-32"
    >
      {/* Title showing when not hovering/focusing */}
      <h4 className="relative z-10 text-center transition-all duration-500 group-hover:text-bold group-hover:scale-105 group-hover:translate-y-40 group-focus:translate-y-40 | lg:px-4">
        {movieValues.title}
      </h4>

      {/* Votes-Date row available for popular category only. */}
      {currentCtg == "popular" && (
        <p className="relative z-10 flex items-center justify-between w-full px-6 transition duration-500 translate-y-40 group-hover:translate-y-0 group-focus:translate-y-0 | lg:-mt-4">
          <span>
            <StarIcon className="inline-block text-lf-aqua mr-1 text-lf-sm" />{" "}
            {movieValues.vote_average}
          </span>
          <span>{movieValues.release_date.substring(0, 4)}</span>
        </p>
      )}

      {/* Transitioning name and play icon. */}
      <div className="absolute z-10 flex justify-center items-center transition-all duration-500 top-4/12 -translate-x-1/2 left-1/2 group-hover:translate-x-0 group-hover:left-6 group-hover:top-11/24 group-focus:translate-x-0 group-focus:left-6 group-focus:top-11/24 | lg:top-3/12 lg:group-hover:left-4 lg:group-hover:top-4/12 lg:group-focus:left-4 lg:group-focus:top-4/12">
        <div className="group/arrow relative w-11 h-11 p-2 border-1 rounded-full bg-lf-gray/40 border-white/70 text-white/70 transition-all duration-500 hover:bg-lf-aqua hover:text-black hover:border-black group-hover:w-8 group-hover:h-8 group-focus:w-8 group-focus:h-8 | lg:w-9 lg:h-9">
          <PlayIcon className="z-20 w-full h-full ml-1px fill-transparent group-hover/arrow:fill-black" />
        </div>
        <p className="absolute mt-1 left-12 leading-lf-relaxed transition-all duration-500 opacity-0 w-50 group-hover:opacity-100 group-focus:opacity-100 | lg:w-45">
          {movieValues.title}
        </p>
      </div>

      {/* Overlays */}
      <div className="absolute z-0 bottom-0 w-full h-9/12 bg-gradient-to-b from-black/0 to-black/80" />
      <div className="absolute z-0 bottom-0 w-full h-full bg-black/0 transition duration-500 group-hover:bg-black/30 group-focus:bg-black/50" />
    </article>
  );
}

const SETUP_MESSAGES = {
  loading: "Cargando...",
  success: "",
  error: "Error al cargar películas populares",
};

const CATEGORIES = {
  popular: "POPULARES",
  myMovies: "MIS PELICULAS",
};

const AMOUNT_OF_MOVIES = 4;

function getBackdrop(currentCtg, movieDetails) {
  switch (currentCtg) {
    case "popular":
      return getBackdropURL(movieDetails.backdrop_path, false);
    case "myMovies":
      return localStorage.getItem(movieDetails.savedKey);
  }
}

export default MoviesListSection;
