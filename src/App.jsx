import { useRoutes } from "react-router-dom";

import Navigation from "./components/Navigation";

import routedPages from "./pages/index";

function App() {
  const currentPage = useRoutes(routedPages);

  return (
    <>
      <Navigation />
      <main className="pb-12 | lg:pb-0">{currentPage}</main>
    </>
  );
}

export default App;
