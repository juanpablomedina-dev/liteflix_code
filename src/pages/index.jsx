import Home from "./Home";
import AddMovie from "./AddMovie";
import NotFound from "./NotFound";

export default [
  { path: "/", element: <Home /> },

  { path: "/agregar_pelicula", element: <AddMovie /> },

  { path: "*", element: <NotFound /> },
];
