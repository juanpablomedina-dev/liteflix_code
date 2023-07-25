import React from "react";
import { BsPaperclip } from "react-icons/bs";

import { getTempMovieKey } from "../../static";

function UploadZone({ submitTried, onFileUploaded }) {
  const [dragging, setDragging] = React.useState(false);
  const [invalid, setInvalid] = React.useState(null);

  const [uploadState, setUploadState] = React.useState("holding");
  const [progress, setProgress] = React.useState(0);

  const inputRef = React.useRef();

  //When dropping file, prevent default, proccess files and finish the "dragging".
  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    onFilesAttach(files);
    setDragging(false);
  }

  //Process attached files (both when dropping it or selecting it) by validating it's 1 file and is an image.
  //If valid set the upload state as uploading. If invalid set the appropiate error to be shown.
  function onFilesAttach(files) {
    if (uploadState !== "holding") return;

    if (files && files.length > 0) {
      if (files.length > 1) setInvalid("amount");
      else if (!files[0].type.includes("image/")) setInvalid("format");
      else {
        setInvalid(false);
        uploadFile(files[0]);
      }
    }
  }

  //"Upload file" (read it as dataURL and save it in the Session Storage) and handle events.
  //On success, we want to avoid handling around the actual dataURL as much as possible to save memory, so we just save it into Session Storage right here.
  function uploadFile(file) {
    setUploadState("uploading");

    const reader = new FileReader();

    reader.onprogress = (f) => setProgress((f.loaded / f.total) * 100);
    reader.onerror = () => setUploadState("error");
    reader.onload = (f) => {
      setUploadState("success");

      sessionStorage.setItem(getTempMovieKey(file.name), f.target.result);

      onFileUploaded(file.name);
    };

    reader.readAsDataURL(file);
  }

  function onLoadingButton() {
    if (uploadState == "uploading" || uploadState == "error") {
      setUploadState("holding");
      setProgress(0);
    }
  }

  return (
    <>
      {/* File input with label. The input itself is hidden to avoid default interface. */}
      <label
        htmlFor="fileInput"
        tabIndex="0"
        //Handle 'Enter' as a click on the input to allow keyboard access.
        onKeyDown={(e) =>
          e.key == "Enter" &&
          uploadState == "holding" &&
          inputRef.current.click()
        }
        onDragEnter={() => uploadState == "holding" && setDragging(true)}
        onDragLeave={() => uploadState == "holding" && setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        data-dragging={dragging}
        data-file-state={uploadState}
        className="block w-86 mx-auto px-8 py-8 border-2 border-dashed text-center cursor-pointer text-default text-white/70 border-white/50 transition duration-300 hover:text-white/100 hover:border-white/100 -translate-x-150 data-[dragging=true]:text-white/100 data-[dragging=true]:border-white/100 data-[file-state=holding]:translate-x-0"
      >
        <input
          name="image"
          ref={inputRef}
          multiple={false}
          accept="image/*"
          id="fileInput"
          type="file"
          className="hidden"
          onChange={(e) => onFilesAttach(e.target.files)}
        />
        {/* Label content */}
        <BsPaperclip className="inline-block -rotate-45 w-5 h-5 mr-2" />
        AGREGÁ UN ARCHIVO
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

      {/* Progress bar when uploading a file. */}
      <div
        data-file-state={uploadState}
        className="group absolute top-0 w-full px-6 text-white/100 transition duration-500 translate-x-0 data-[file-state=holding]:translate-x-150"
      >
        {/* Top left text */}
        <p className="text-lf-sm-2 text-bold group-data-[file-state=uploading]:text-default">
          {(uploadState == "uploading" || uploadState == "holding") && (
            <>
              CARGANDO <span className="text-bold">{progress.toFixed(0)}%</span>
            </>
          )}
          {uploadState == "success" && "100% CARGADO"}
          {uploadState == "error" && (
            <>
              ¡ERROR!{" "}
              <span className="text-default">
                NO SE PUDO CARGAR LA PELÍCULA
              </span>
            </>
          )}
        </p>

        {/* Actual progress bar */}
        <div className="w-full h-1 bg-white/50 my-4 flex items-center">
          <div
            style={{ width: `${progress.toFixed(2)}%` }}
            className="bg-lf-aqua h-2 group-data-[file-state=error]:bg-lf-red"
          />
        </div>

        {/* Bottom right button */}
        <button
          type="button"
          onClick={onLoadingButton}
          className="float-right text-lf-base tracking-lf-normal text-bold group-data-[file-state=success]:text-lf-aqua"
        >
          {LOADING_MESSAGE[uploadState]}
        </button>
      </div>
    </>
  );
}

const INVALID_MESSAGES = {
  amount: "SÓLO 1 ARCHIVO",
  format: "SÓLO IMÁGENES",
};

const LOADING_MESSAGE = {
  uploading: "CANCELAR",
  success: "¡LISTO!",
  error: "REINTENTAR",
};

export default UploadZone;
