import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center px-16">
      <h3 className="leading-lf-title text-lf-2xl text-center | lg:text-lf-3xl">
        Lo sentimos, no encontramos esta página.
      </h3>

      <Link
        to="/"
        className="group text-center text-lf-aqua text-lf-lg tracking-lf-normal mt-20 py-4 w-60 border-2 border-white/50 hover:text-bold focus:text-bold hover:border-white/100 focus:border-white/100 | lg:py-6 lg:text-lf-lg-2 lg:w-80"
      >
        <BsArrowLeft className="inline-block mr-2 transition duration-200 text-lf-lg-2 group-hover:-translate-x-2 group-focus:-translate-x-2 | lg:text-lf-xl" />{" "}
        IR A INICIO
      </Link>
    </section>
  );
}

export default NotFound;
