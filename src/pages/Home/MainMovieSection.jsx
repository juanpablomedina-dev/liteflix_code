import React from "react";
import { BsPlay, BsPlus } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";

import useInitialFetch from "../../tools/hooks/useInitialFetch";
import { parseMovieTitle } from "../../static";

function MainMovie({ setMainMovieId }) {
  const [reqState, setReqState] = React.useState("loading");

  const [coverTransition, setCoverTransition] = React.useState(true);
  const [transitions, setTransitions] = React.useState(false);

  var mainMovieValues = React.useRef();

  //Fetch now playing movies and select a random one as main.
  useInitialFetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=6f26fd536dd6192ec8a57e94141f8b20",
    ({ data, error }) => {
      if (error) {
        console.log({ error });
        setReqState("error");
        return;
      }

      const mainMovie =
        data.results[Math.floor(Math.random() * data.results.length)];
      const parsedTitle = parseMovieTitle(mainMovie.title);

      mainMovieValues.current = {
        backdropURL: `https://image.tmdb.org/t/p/original${mainMovie.backdrop_path}`,
        ...parsedTitle,
      };

      setMainMovieId(mainMovie.id);
      setReqState("success");
    }
  );

  // Start transitions whenever reqState changes
  React.useEffect(() => {
    setCoverTransition((prev) => !prev);
    setTransitions((prev) => !prev);

    const i = setInterval(
      () => setCoverTransition((prev) => !prev),
      EXPANSION_SECONDS * 1000
    );

    return () => clearInterval(i);
  }, [reqState]);

  return reqState == "success" ? (
    <section
      aria-hidden={!transitions}
      className="group relative flex flex-col items-center justify-end bg-right bg-cover overflow-hidden h-150 | lg:h-screen lg:w-screen lg:items-start"
    >
      {/* Movie title */}
      <h4 className="relative z-20 text-shadow shadow-strongest text-lf-lg leading-lf-relaxed-2 text-light transition duration-2000 group-aria-hidden:-translate-x-100 | lg:pl-20">
        ORIGINAL DE <span className="text-bold">LITEFLIX</span>
      </h4>
      <h1
        data-main-length={mainMovieValues.current.mainTitleLength}
        className="relative z-20 text-shadow shadow-medium pl-1 mt-4 text-bolder text-lf-5xl text-center tracking-lf-title leading-lf-title-3 w-96 text-lf-aqua transition duration-700 data-[main-length=long]:leading-lf-title-2 data-[main-length=long]:text-lf-4xl data-[main-length=very-long]:leading-lf-title data-[main-length=very-long]:text-lf-3xl group-aria-hidden:translate-x-100 | lg:text-left lg:pl-20 lg:!text-lf-5xl lg:!tracking-lf-title lg:!leading-lf-title-3 lg:w-9/12 lg:group-aria-hidden:translate-x-0 lg:group-aria-hidden:-translate-y-50 lg:group-aria-hidden:opacity-0"
      >
        {mainMovieValues.current.mainTitle}
      </h1>
      {mainMovieValues.current.secondaryTitle && (
        <h2
          data-main-length={mainMovieValues.current.mainTitleLength}
          className="relative z-20 text-shadow shadow-strongest text-center text-bolder text-lf-2xl tracking-lf-wide leading-lf-loose w-94 text-lf-aqua transition duration-700 group-aria-hidden:-translate-x-100 data-[main-length=very-long]:mt-2 | lg:pl-20 lg:w-auto lg:group-aria-hidden:translate-x-0 lg:group-aria-hidden:translate-y-50 lg:group-aria-hidden:opacity-0"
        >
          {mainMovieValues.current.secondaryTitle}
        </h2>
      )}

      {/* Movie backdrop image */}
      <img
        data-cover-transition={coverTransition}
        style={{ transitionDuration: `${EXPANSION_SECONDS * 1000}ms` }}
        className="w-[1280px] h-[720px] max-w-none absolute transition-all ease-linear translate-x-50 data-[cover-transition=true]:-translate-x-50 | lg:h-full lg:translate-x-0 lg:scale-100 lg:data-[cover-transition=true]:translate-x-0 lg:data-[cover-transition=true]:scale-120"
        src={mainMovieValues.current.backdropURL}
        alt="Portada de película destacada"
      />

      <div className="mt-10 flex flex-col | lg:mt-5 lg:pl-20 lg:pb-30 lg:flex-row lg:items-center">
        {/* Action buttons */}
        <button className="relative z-20 w-70 text-white/90 tracking-lf-wide text-lf-lg bg-lf-gray py-4 transition-all duration-300 border-1 border-white/0 hover:border-white/50 hover:text-bold hover:text-lf-lg-2 focus:text-bold focus:border-white/100 focus:text-lf-lg-2 | lg:shadowed-box lg:mr-6">
          <BsPlay className="inline-block text-lf-lg-3" /> REPRODUCIR
        </button>
        <button className="relative z-20 w-70 tracking-lf-wide text-white/90 text-lf-lg mt-4 bg-lf-gray/0 border-1 border-white/30 py-4 transition-all duration-300 focus:border-white/100 focus:bg-lf-gray focus:text-lf-lg-2 focus:text-bold hover:text-lf-lg-2 hover:border-white hover:bg-lf-gray hover:text-bold | lg:bg-lf-gray/50 lg:border-white/70 lg:shadowed-box lg:mt-0">
          <BsPlus className="inline-block text-lf-lg-3" /> MI LISTA
        </button>
      </div>

      {/* Overlays */}
      <div className="absolute z-10 left-0 bottom-0 w-full h-full bg-black/20 transition duration-2000 group-aria-hidden:bg-black/80 " />
      <div className="absolute z-10 left-0 bottom-10 w-full h-80 bg-gradient-to-b from-lf-gray/0 to-lf-gray/95 | lg:hidden" />
      <div className="absolute z-10 left-0 bottom-0 w-full h-10 bg-gradient-to-b from-lf-gray/95 to-lf-gray/100 | lg:hidden" />
      <div className="absolute z-10 left-0 top-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent | lg:hidden" />
    </section>
  ) : (
    <div
      data-error={reqState == "error"}
      className="h-150 w-70 mx-auto text-center flex flex-col justify-center items-center text-white/100 text-lf-lg leading-lf-relaxed text-bold data-[error=true]:text-red-400 | lg:w-screen lg:h-screen"
    >
      <AiOutlineLoading className="animate-spin inline-block mb-6 w-20 h-20" />
      {LOADING_MESSAGES[reqState] && (
        <p className="mt-6">{LOADING_MESSAGES[reqState]}</p>
      )}
    </div>
  );
}

const LOADING_MESSAGES = {
  loading: null,
  success: null,
  error: "Error al cargar película destacada",
};

const EXPANSION_SECONDS = 20;

export default MainMovie;
