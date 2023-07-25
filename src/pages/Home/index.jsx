import React from "react";

import MoviesList from "./MoviesListSection";
import MainMovie from "./MainMovieSection";

function Home() {
  const [mainMovieId, setMainMovieId] = React.useState();

  return (
    <div className="| lg:overflow-y-hidden lg:flex lg:justify-end lg:items-center">
      <MainMovie setMainMovieId={setMainMovieId} />

      <MoviesList mainMovieId={mainMovieId} />
    </div>
  );
}

export default Home;
