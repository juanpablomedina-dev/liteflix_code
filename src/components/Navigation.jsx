import React from "react";
import { Link } from "react-router-dom";

import { useBordersVisibility, useBreakpoint } from "@tools/hooks";
import {
  BellIcon,
  PlusIcon,
  CloseIcon,
  MenuIcon,
  OvalIcon,
} from "@components/icons";

import userAvatar from "@assets/images/userAvatar.jpg";

function Navigation() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const visible = useBordersVisibility({
    pixelsForVisibleTop: 20,
    disable: "bottom-sensor",
  });

  const bp = useBreakpoint();
  const sidebarRef = React.useRef();

  //Add listeners to close the sidebar on click outside and on escape.
  React.useEffect(() => {
    const onMouseDown = (e) => {
      if (!sidebarRef.current.contains(e.target)) setSidebarOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setSidebarOpen(false);

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function onLogoClick() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  const burgerButton = (
    <>
      <MenuIcon
        onKeyDown={(e) => e.key == "Enter" && setSidebarOpen(true)}
        onClick={() => setSidebarOpen(true)}
        tabIndex={sidebarOpen ? undefined : "0"}
        className="absolute text-white/100 box-content p-1 cursor-pointer transition duration-500 -translate-y-20 group-hover:text-white/70 group-aria-expanded:text-white/70 group-hover:hover:text-white/100 group-hover:focus:text-white/100 group-aria-hidden:translate-y-0"
      />
      <div className="w-9 h-9 box-content p-1 border-1 invisible">
        {/* Invisible but same sizing styles than the avatar so the title is centered. */}
      </div>
    </>
  );

  return (
    <>
      <nav
        aria-hidden={!sidebarOpen}
        aria-expanded={!visible.top}
        className="group fixed z-70 px-6 py-4 text-lf-lg-3 w-full left-0 top-0 flex justify-between items-center transition-all duration-500 hover:aria-hidden:bg-lf-gray-darker aria-expanded:py-3 aria-expanded:aria-hidden:bg-lf-gray-darker | lg:px-20 lg:py-3"
      >
        {!bp.isDesktop() && burgerButton}
        <CloseIcon
          onKeyDown={(e) => e.key == "Enter" && setSidebarOpen(false)}
          tabIndex={sidebarOpen ? "0" : undefined}
          onClick={() => setSidebarOpen(false)}
          className="absolute text-white/70 w-5 h-5 box-content p-1 cursor-pointer transition duration-500 hover:text-white/100 focus:text-white/100 -translate-x-1 group-aria-hidden:opacity-0 group-aria-hidden:-translate-x-20 | lg:group-aria-hidden:translate-x-0 lg:group-aria-hidden:-translate-y-20 lg:right-131"
        />

        <div className="flex justify-start items-center">
          <h2
            onClick={onLogoClick}
            tabIndex={visible.top ? undefined : "0"}
            className="text-lf-xl text-light text-shadow shadow-strongest text-lf-aqua pt-1 cursor-pointer transition duration-100 hover:scale-110 focus:scale-110 | lg:text-lf-2xl"
          >
            <Link to="/">
              <span className="text-bold">LITE</span>FLIX
            </Link>
          </h2>
          {bp.isDesktop() && (
            <Link
              onClick={() => setSidebarOpen(false)}
              className="group/add_movie ml-10 text-lf-base-2 block px-2 py-1 bg-lf-gray/0 transition-all duration-200 hover:text-bold group-aria-expanded:bg-lf-gray/40"
              to="/agregar_pelicula"
            >
              <PlusIcon className="inline-block mr-3 text-lf-base mb-1px transition duration-200 group-hover/add_movie:scale-120" />
              AGREGAR PELÍCULA
            </Link>
          )}
        </div>

        <div className="flex items-center">
          {bp.isDesktop() && burgerButton}
          {bp.isDesktop() && (
            <button className="relative flex items-center justify-center ml-4 p-1 text-white/100 cursor-pointer transition duration-300 group-hover:text-white/70 group-aria-expanded:text-white/70 group-hover:hover:text-white/100">
              <BellIcon />
              <OvalIcon className="text-lf-aqua w-11px h-11px absolute top-3px right-4px" />
            </button>
          )}
          <img
            alt="Avatar del usuario"
            src={userAvatar}
            tabIndex="0"
            className="w-9 h-9 box-content rounded-full p-1 transition cursor-pointer duration-300 border-1 border-white/0 hover:border-white/50 | lg:ml-6"
          />
        </div>
      </nav>

      <aside
        ref={sidebarRef}
        aria-hidden={!sidebarOpen}
        className="fixed right-0 pb-8 top-0 w-full h-full bg-lf-gray z-60 pt-20 transition duration-500 overflow-y-scroll aria-hidden:-translate-x-500 focus:outline-none | lg:bg-lf-gray/90 lg:aria-hidden:translate-x-500 lg:w-150"
      >
        {SIDEBAR_LINKS.map(({ text, goesTo, outstand, Icon }) => (
          <Link
            onClick={() => setSidebarOpen(false)}
            data-outstand={outstand}
            className="group block py-4 mt-4 px-6 transition-all duration-200 text-light border-y-1 border-white/0 hover:text-bold hover:border-white/30 data-[outstand=true]:text-default data-[outstand=true]:my-6 hover:data-[outstand=true]:text-bold | lg:text-lf-lg lg:px-12 lg:mt-2"
            key={text}
            to={goesTo}
          >
            {Icon && (
              <Icon className="inline-block mr-2 transition duration-200 group-hover:scale-120" />
            )}{" "}
            {text}
          </Link>
        ))}
      </aside>
    </>
  );
}

const SIDEBAR_LINKS = [
  { text: "INICIO", goesTo: "/" },
  { text: "SERIES", goesTo: "/" },
  { text: "PELÍCULAS", goesTo: "/" },
  { text: "AGREGADAS RECIENTEMENTE", goesTo: "/" },
  { text: "POPULARES", goesTo: "/" },
  { text: "MIS PELÍCULAS", goesTo: "/" },
  { text: "MI LISTA", goesTo: "/" },
  {
    text: "AGREGAR PELÍCULA",
    goesTo: "/agregar_pelicula",
    outstand: true,
    Icon: PlusIcon,
  },
  { text: "CERRAR SESIÓN", goesTo: "/" },
];

export default Navigation;
