import React from "react";
import { Link } from "react-router-dom";

import { getSavedMovieKey, getTempMovieKey } from "../../static";

import UploadZone from "./UploadZone";

function AddMovie() {
  const [uploadedFileName, setUploadedFileName] = React.useState(null);
  const [title, setTitle] = React.useState("");

  const [submitTried, setSubmitTried] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const invalidForm = !uploadedFileName || !title;

  //Validate and set title.
  function onTitleChange(e) {
    const value = e.target.value;
    if (value.length > MAX_TITLE_LENGTH) return;
    setTitle(value);
  }

  //On valid submit, move the file from the session storage to the local storage with the new key.
  //If invalid form, just set submit as tried to mark invalid fields.
  function onSubmit(e) {
    e.preventDefault();

    if (invalidForm) {
      setSubmitTried(true);
      return;
    }

    const tempKey = getTempMovieKey(uploadedFileName);
    const saveKey = getSavedMovieKey(uploadedFileName, title);

    localStorage.setItem(saveKey, sessionStorage.getItem(tempKey));
    sessionStorage.removeItem(tempKey);

    setSubmitted(true);
  }

  //Clear Session Storage on exit.
  React.useEffect(() => {
    return () => sessionStorage.clear();
  }, []);

  return (
    <section data-submitted={submitted} className="group pt-39 text-center">
      <h3 className="text-lf-aqua text-bolder text-center text-lf-lg-2 leading-lf-relaxed transition-spacing duration-500 group-data-[submitted=true]:text-bold group-data-[submitted=true]:text-white group-data-[submitted=true]:mt-24 group-data-[submitted=true]:text-lf-lg-3 group-data-[submitted=true]:text-lf-relaxed-3">
        {submitted ? "¡FELICITACIONES!" : "AGREGAR PELÍCULA"}
      </h3>

      {submitted ? (
        //Submitted movie interface
        <>
          <p className="text-lf-lg-2 w-80 leading-lf-loose mx-auto mt-10">
            {title} FUE CORRECTAMENTE SUBIDA.
          </p>

          <Link
            to="/"
            className="mt-34 block mx-auto text-default leading-tight text-lf-base-2 tracking-lf-normal w-65 pt-5 pb-4 bg-white/100 text-lf-gray transition duration-200 hover:bg-white/80 aria-disabled:bg-white/50 aria-disabled:cursor-not-allowed"
          >
            IR A HOME
          </Link>
        </>
      ) : (
        //Upload movie formulary.
        <form
          onSubmit={onSubmit}
          className="relative mt-18 flex flex-col items-center justify-center overflow-hidden"
        >
          <UploadZone
            submitTried={submitTried}
            onFileUploaded={setUploadedFileName}
          />

          {/* Title input */}
          <label className="block text-center mt-15 overflow-hidden">
            <input
              name="title"
              data-valued={!!title}
              onChange={onTitleChange}
              placeholder="TÍTULO"
              maxLength={MAX_TITLE_LENGTH}
              className="border-b-1 w-65 pb-2 border-white/50 uppercase text-center bg-transparent text-white/100 transition duration-300 text-lf-base tracking-lf-normal focus:outline-none hover:border-white/100 focus:border-white/100 placeholder:transition placeholder:duration-300 placeholder:hover:text-white/100 placeholder:focus:scale-x-0 data-[valued=true]:border-white/100"
            />
            {/* Message on invalid field */}
            {submitTried && !title && (
              <>
                <br />
                <span className="inline-block mt-4 text-bold text-red-400">
                  ESCRIBÍ UN TÍTULO
                </span>
              </>
            )}
          </label>

          {/* Submit and exit buttons */}
          <button
            type="submit"
            aria-disabled={invalidForm}
            className="mt-26 text-default text-center leading-tight text-lf-base-2 tracking-lf-normal w-65 pt-5 pb-4 bg-white/100 text-lf-gray transition duration-200 hover:bg-white/80 aria-disabled:bg-white/50 aria-disabled:cursor-not-allowed"
          >
            SUBIR PELÍCULA
          </button>
          <Link
            to="/"
            className="mt-8 text-default text-center leading-tight text-lf-base-2 tracking-lf-normal w-65 pt-5 pb-4 text-white/70 border-1 border-white/50 transition duration-200 hover:border-white/100 hover:text-white/100 focus:border-white/100 focus:text-white/100"
          >
            SALIR
          </Link>
        </form>
      )}
    </section>
  );
}

const MAX_TITLE_LENGTH = 50;

export default AddMovie;
