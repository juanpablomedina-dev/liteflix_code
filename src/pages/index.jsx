import Home from "./Home";
import AddMovie from "./AddMovie";

export default [
  { path: "/", element: <Home /> },

  { path: "/agregar_pelicula", element: <AddMovie /> },
];
