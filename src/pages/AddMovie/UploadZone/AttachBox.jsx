import React from "react";
import { HiOutlineCursorClick } from "react-icons/hi";

import { useBreakpoint } from "@tools/hooks";
import { ClipIcon } from "@components/icons";

function AttachBox({ uploadState, onUploadFile, submitTried }) {
  const bp = useBreakpoint();

  const [dragging, setDragging] = React.useState(false);
  const [invalid, setInvalid] = React.useState(null);

  const inputRef = React.useRef();
  const disabled = uploadState !== "holding";

  //Process attached files (both when dropping it or selecting it) by validating it's 1 file and is an image.
  //If valid set the upload state as uploading. If invalid set the appropiate error to be shown.
  const onFilesAttach = React.useCallback(
    function (files) {
      if (disabled) return;

      if (files && files.length > 0) {
        const typeCategory = files[0].type.split("/")[0];

        if (files.length > 1) setInvalid("amount");
        else if (!SUPPORTED_FILE_CATEGORIES.includes(typeCategory))
          setInvalid("format");
        else if (files[0].size > 1000 * MAX_KILOBYTES)
          setInvalid("size"); //Optional size check
        else {
          setInvalid(false);
          onUploadFile(files[0]);
        }
      }
    },
    [onUploadFile, disabled]
  );

  //Add whole-window drag&drop events handlers.
  React.useEffect(() => {
    function onDragging(e) {
      e.preventDefault();
      e.stopPropagation();

      const entering = document.contains(e.target);

      if (entering !== undefined) setDragging(entering);
    }

    function onDrop(e) {
      e.preventDefault();
      e.stopPropagation();

      const { files } = e.dataTransfer;

      onFilesAttach(files);
      setDragging(false);
    }

    if (!disabled) {
      window.addEventListener("dragover", onDragging);
      window.addEventListener("drop", onDrop);
    }

    return () => {
      window.removeEventListener("dragover", onDragging);
      window.removeEventListener("drop", onDrop);
    };
  }, [onFilesAttach, uploadState, disabled]);

  //Handle 'Enter' on label focus as a click on the input to allow keyboard access.
  function onKeyDown(e) {
    if (!disabled && e.key == "Enter") inputRef.current.click();
  }

  return (
    <>
      <label
        htmlFor="fileInput"
        tabIndex={disabled ? undefined : "0"}
        onKeyDown={onKeyDown}
        aria-disabled={disabled}
        aria-hidden={dragging}
        className="relative z-20 block w-86 mx-auto px-8 py-8 border-2 border-dashed text-center cursor-pointer text-default text-white/70 border-white/50 transition duration-500 hover:text-white/100 hover:border-white/100 hover:bg-black/10 aria-disabled:-translate-x-50 aria-disabled:opacity-0 aria-hidden:-translate-x-100 aria-hidden:opacity-0 | lg:w-150"
      >
        <input
          name="image"
          ref={inputRef}
          multiple={false}
          accept={SUPPORTED_FILE_CATEGORIES.map((t) => `${t}/*`).join(",")}
          id="fileInput"
          type="file"
          className="hidden"
          disabled={disabled}
          onChange={(e) => onFilesAttach(e.target.files)}
        />

        <ClipIcon className="inline-block w-5 h-5 mr-4" />

        <>
          <span className="text-bold">AGREGÁ UN ARCHIVO</span>{" "}
          {bp.isDesktop() && "O ARRASTRALO Y SOLTALO AQUI"}
        </>

        {/* Message on invalid format */}
        {invalid && (
          <>
            <br />
            <span className="inline-block mt-4 text-bold text-red-400">
              INVÁLIDO: {INVALID_MESSAGES[invalid]}
            </span>
          </>
        )}
        {/* Message on invalid field */}
        {submitTried && uploadState !== "success" && (
          <>
            <br />
            <span className="inline-block mt-4 text-bold text-red-400">
              SUBÍ UN ARCHIVO
            </span>
          </>
        )}
      </label>

      <div
        aria-hidden={!dragging}
        aria-disabled={disabled}
        className="absolute z-10 top-0 w-86 mx-auto px-8 py-8 text-bold border-2 border-dashed text-center text-default text-white/100 border-white/100 transition duration-500 aria-hidden:translate-x-50 aria-hidden:opacity-0 aria-hidden:aria-disabled:-translate-x-100 aria-disabled:opacity-0 | lg:w-150"
      >
        <HiOutlineCursorClick className="inline-block w-5 h-5 mr-3" />
        SOLTÁ PARA SUBIR {bp.isDesktop() && "EL ARCHIVO DE PELÍCULA"}
      </div>
    </>
  );
}

const SUPPORTED_FILE_CATEGORIES = ["image"];

const MAX_KILOBYTES = 500;

const INVALID_MESSAGES = {
  amount: "SÓLO 1 ARCHIVO",
  format: "SÓLO IMÁGENES",
  size: `MÁXIMO DE ${MAX_KILOBYTES} KB`,
};

export default AttachBox;
