import React from "react";
import { useRoutes } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";

import Navigation from "@components/Navigation";
import { useInitialFetch } from "@tools/hooks";
import { ENDPOINTS } from "@static/api";
import { CONFIG_LOCAL_STORAGE_NAME } from "@static/index";

import routedPages from "./pages/index";

function App() {
  const currentPage = useRoutes(routedPages);
  const [setup, setSetup] = React.useState("loading");

  //Fetch configuration.
  useInitialFetch({ endpoint: ENDPOINTS.CONFIG }, function ({ data, error }) {
    if (error) {
      console.error(error);
      setSetup("error");
      return;
    }

    localStorage.setItem(CONFIG_LOCAL_STORAGE_NAME, JSON.stringify(data));

    setSetup("success");
  });

  return setup == "success" ? (
    <>
      <Navigation />
      <main className="pb-12 | lg:pb-0">{currentPage}</main>
    </>
  ) : (
    <div
      data-setup={setup}
      className="h-screen w-screen flex flex-col justify-center items-center text-bold text-center data-[setup=error]:text-red-400"
    >
      <AiOutlineLoading className="animate-spin inline-block mb-20 w-20 h-20" />
      {SETUP_MESSAGES[setup] && (
        <p className="text-lf-2xl leading-lf-title">{SETUP_MESSAGES[setup]}</p>
      )}
    </div>
  );
}

const SETUP_MESSAGES = {
  loading: "",
  success: "",
  error: "Error al cargar la aplicación",
};

export default App;
