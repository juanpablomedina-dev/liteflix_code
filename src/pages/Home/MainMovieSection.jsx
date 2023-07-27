import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

import { useInitialFetch, useBreakpoint } from "@tools/hooks";

import { parseMovieTitle, getBackdropURL } from "@static/index";
import { ENDPOINTS } from "@static/api";
import { PlayIcon, PlusIcon } from "@components/icons";

function MainMovie({ setMainMovieId }) {
  const bp = useBreakpoint();

  const [setup, setSetup] = React.useState("fetching");

  var mainMovieValues = React.useRef();

  //Fetch now playing movies and select a random one as main.
  useInitialFetch(
    { endpoint: ENDPOINTS.NOW_PLAYING },
    function ({ data, error }) {
      if (error) {
        console.error({ error });
        setSetup("error");
        return;
      }

      const mainMovie =
        data.results[Math.floor(Math.random() * data.results.length)];
      const parsedTitle = parseMovieTitle(mainMovie.title, bp.name);

      mainMovieValues.current = {
        id: mainMovie.id,
        backdropURL: getBackdropURL(mainMovie.backdrop_path, true),
        ...parsedTitle,
      };

      setSetup("loadingBackdrop");
    }
  );

  //Initial load will finish once the backdrop image has loaded.
  const onBackdropLoad = React.useCallback(
    (error) => {
      if (error) {
        console.log({ error });
        setSetup("error");
        return;
      }

      setSetup("success");
      setMainMovieId(mainMovieValues.current.id);
    },
    [setMainMovieId]
  );

  return (
    <section
      aria-disabled={setup != "success"}
      className="group relative flex flex-col items-center justify-end bg-right bg-cover overflow-hidden h-150 aria-disabled:justify-center | lg:h-screen lg:w-screen lg:items-start"
    >
      {(setup == "loadingBackdrop" || setup == "success") && (
        <BackdropImage
          onLoad={onBackdropLoad}
          backdropURL={mainMovieValues.current.backdropURL}
        />
      )}

      {setup == "success" ? (
        <Content {...mainMovieValues.current} />
      ) : (
        <div
          data-setup={setup}
          className="w-full text-bold text-center data-[setup=error]:text-red-400"
        >
          <AiOutlineLoading
            data-setup={setup}
            className="animate-spin inline-block w-20 h-20"
          />
          {SETUP_MESSAGES[setup] && (
            <p data-setup={setup} className="mt-10 text-lf-xl leading-lf-loose">
              {SETUP_MESSAGES[setup]}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function BackdropImage({ backdropURL, onLoad }) {
  const [transitioning, setTransitioning] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const imgRef = React.useRef();
  var interval = React.useRef();

  //Load Backdrop image before rendering anything.
  React.useEffect(() => {
    imgRef.current.onload = () => {
      onLoad();

      setLoaded(true);

      setTransitioning(true);
      interval.current = setInterval(
        () => setTransitioning((prev) => !prev),
        BACKDROP_TRANSITION_SECONDS * 1000
      );
    };

    imgRef.current.onerror = (error) => {
      onLoad(error);
    };

    imgRef.current.src = backdropURL;

    return () => clearInterval(interval.current);
  }, [backdropURL, onLoad]);

  return (
    <img
      ref={imgRef}
      aria-hidden={!loaded}
      data-cover-transition={transitioning}
      style={{ transitionDuration: `${BACKDROP_TRANSITION_SECONDS * 1000}ms` }}
      className="w-[1280px] h-[720px] max-w-none absolute transition-all ease-linear translate-x-70 aria-hidden:invisible data-[cover-transition=true]:-translate-x-70 | sm:translate-x-40 sm:data-[cover-transition=true]:-translate-x-40 | lg:h-full lg:translate-x-0 lg:scale-130 lg:data-[cover-transition=true]:translate-x-0 lg:data-[cover-transition=true]:scale-100 | xl:w-full"
      alt="Portada de película destacada"
    />
  );
}

function Content({ mainTitle, secondaryTitle, mainTitleLength }) {
  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setHidden(false), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Titles */}
      <h4
        aria-hidden={hidden}
        className="relative z-20 text-shadow shadow-strongest text-lf-lg leading-lf-relaxed-2 text-light transition duration-2000 aria-hidden:opacity-0 aria-hidden:-translate-x-100 | lg:pl-20"
      >
        ORIGINAL DE <span className="text-bold">LITEFLIX</span>
      </h4>
      <h1
        aria-hidden={hidden}
        data-main-length={mainTitleLength}
        className="relative z-20 text-shadow shadow-medium pl-2 mt-4 text-bolder text-center text-lf-5xl tracking-lf-title leading-lf-title-3 w-96 text-lf-aqua transition duration-700 data-[main-length=long]:leading-lf-title-2 data-[main-length=long]:text-lf-4xl data-[main-length=very-long]:leading-lf-title data-[main-length=very-long]:text-lf-3xl aria-hidden:opacity-0 aria-hidden:translate-x-100 | sm:w-11/12 | lg:text-left lg:pl-20 lg:text-lf-6xl lg:tracking-lf-title-2 lg:leading-lf-title-4 lg: lg:w-9/12 lg:aria-hidden:translate-x-0 lg:aria-hidden:-translate-y-50 lg:data-[main-length=long]:leading-lf-title-3 lg:data-[main-length=long]:text-lf-5xl lg:data-[main-length=very-long]:leading-lf-title-2 lg:data-[main-length=very-long]:text-lf-4xl"
      >
        {mainTitle}
      </h1>
      {secondaryTitle && (
        <h2
          aria-hidden={hidden}
          data-main-length={mainTitleLength}
          className="relative z-20 text-shadow shadow-strongest text-center text-bolder text-lf-2xl tracking-lf-wide leading-lf-loose w-94 text-lf-aqua transition duration-700 aria-hidden:opacity-0 aria-hidden:-translate-x-100 data-[main-length=very-long]:mt-2 | lg:pl-20 lg:w-auto lg:text-lf-4xl lg:tracking-lf-title lg:leading-lf-title-2 lg:aria-hidden:translate-x-0 lg:aria-hidden:translate-y-50 lg:data-[main-length=long]:mt-4 lg:data-[main-length=very-long]:mt-4"
        >
          {secondaryTitle}
        </h2>
      )}

      {/* Action buttons */}
      <div className="mt-10 flex flex-col | lg:mt-5 lg:pl-20 lg:pb-30 lg:flex-row lg:items-center">
        <button className="relative z-20 w-70 text-white/90 tracking-lf-wide text-lf-lg bg-lf-gray py-4 transition-all duration-300 border-1 border-white/0 hover:border-white/50 hover:text-bold hover:text-lf-lg-2 focus:text-bold focus:border-white/100 focus:text-lf-lg-2 | lg:shadowed-box lg:mr-6">
          <PlayIcon className="inline-block fill-transparent" /> REPRODUCIR
        </button>
        <button className="relative z-20 w-70 tracking-lf-wide text-white/90 text-lf-lg mt-4 bg-lf-gray/0 border-1 border-white/30 py-4 transition-all duration-300 focus:border-white/100 focus:bg-lf-gray focus:text-lf-lg-2 focus:text-bold hover:text-lf-lg-2 hover:border-white hover:bg-lf-gray hover:text-bold | lg:bg-lf-gray/50 lg:border-white/70 lg:shadowed-box lg:mt-0">
          <PlusIcon className="inline-block text-lf-base mr-1" /> MI LISTA
        </button>
      </div>

      {/* Overlays */}
      <div
        aria-hidden={hidden}
        className="absolute z-10 left-0 bottom-0 w-full h-full bg-black/20 transition duration-2000 aria-hidden:bg-black/80 "
      />
      <div className="absolute z-10 left-0 bottom-10 w-full h-80 bg-gradient-to-b from-lf-gray/0 to-lf-gray/95 | lg:hidden" />
      <div className="absolute z-10 left-0 bottom-0 w-full h-10 bg-gradient-to-b from-lf-gray/95 to-lf-gray/100 | lg:hidden" />
      <div className="absolute z-10 left-0 top-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent | lg:hidden" />
    </>
  );
}

const SETUP_MESSAGES = {
  fetching: "",
  loadingBackdrop: "",
  success: "",
  error: "Error al cargar película destacada",
};

const BACKDROP_TRANSITION_SECONDS = 30;

export default MainMovie;
