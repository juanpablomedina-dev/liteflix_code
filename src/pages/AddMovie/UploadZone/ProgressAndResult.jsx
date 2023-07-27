function ProgressAndResult({ progress, uploadState, onAction }) {
  const disabled = uploadState == "holding";
  const actionable = uploadState == "uploading" || uploadState == "error";

  function onActionButton() {
    if (actionable) onAction();
  }

  return (
    <div
      aria-disabled={disabled}
      data-file-state={uploadState}
      className="group absolute top-0 w-full px-6 text-white/100 transition duration-500 aria-disabled:translate-x-100 aria-disabled:opacity-0"
    >
      {/* Top left text */}
      <p className="text-lf-sm-2 text-left text-bold group-data-[file-state=uploading]:text-default">
        {(uploadState == "uploading" || uploadState == "holding") && (
          <>
            CARGANDO <span className="text-bold">{progress.toFixed(0)}%</span>
          </>
        )}
        {uploadState == "finishing" && "TERMINANDO, PODRÍA TOMAR UNOS SEGUNDOS"}

        {uploadState == "success" && "100% CARGADO"}
        {uploadState == "error" && (
          <>
            ¡ERROR!{" "}
            <span className="text-default">NO SE PUDO CARGAR LA PELÍCULA</span>
          </>
        )}
      </p>

      {/* Actual progress bar */}
      <div className="w-full h-1 bg-white/50 my-4 flex items-center">
        <div
          style={{ width: `${progress.toFixed(0)}%` }}
          className="bg-lf-aqua h-2 group-data-[file-state=error]:bg-lf-red"
        />
      </div>

      {/* Bottom right button */}
      <button
        disabled={disabled || uploadState == "finishing"}
        type="button"
        onClick={onActionButton}
        className="float-right text-lf-base tracking-lf-normal text-bold group-data-[file-state=success]:text-lf-aqua"
      >
        {LOADING_MESSAGE[uploadState]}
      </button>
    </div>
  );
}

const LOADING_MESSAGE = {
  holding: "CANCELADO",
  uploading: "CANCELAR",
  success: "¡LISTO!",
  error: "REINTENTAR",
  finishing: "",
};

export default ProgressAndResult;
