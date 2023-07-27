import React from "react";

import { getTempMovieKey } from "@static/index";

import AttachBox from "./AttachBox";
import ProgressAndResult from "./ProgressAndResult";

function UploadZone({ submitTried, onFileUploaded }) {
  const [uploadState, setUploadState] = React.useState("holding");
  const [progress, setProgress] = React.useState(0);

  var fileReader = React.useRef(new FileReader());

  //"Upload file" (read it as dataURL and save it in the Session Storage) and handle events.
  const onUploadFile = React.useCallback(
    function (file) {
      setUploadState("uploading");

      const reader = fileReader.current;

      //When finishing it lags out for a few seconds, so it's better to indicate the user to be patient.
      reader.onprogress = (e) => {
        const progress = (e.loaded / e.total) * 100;

        if (progress > PROGRESS_FINISHING_LIMIT) {
          setProgress(PROGRESS_FINISHING_LIMIT);
          setUploadState("finishing");
        } else {
          setProgress(progress);
        }
      };

      //On success, we want to avoid handling around the actual dataURL as much as possible to save memory, so we just save it into Session Storage right here.
      reader.onload = (e) => {
        sessionStorage.setItem(getTempMovieKey(file.name), e.target.result);

        onFileUploaded(file.name);

        setProgress(100);
        setUploadState("success");
      };

      reader.onerror = () => {
        setUploadState("error");
      };

      reader.readAsDataURL(file);
    },
    [onFileUploaded]
  );

  React.useEffect(() => {
    return () => fileReader.current.abort();
  }, []);

  const onUploadingAction = React.useCallback(function () {
    setUploadState("holding");
    setProgress(0);
    fileReader.current.abort();
  }, []);

  return (
    <>
      <AttachBox
        onUploadFile={onUploadFile}
        submitTried={submitTried}
        uploadState={uploadState}
      />

      <ProgressAndResult
        progress={progress}
        onAction={onUploadingAction}
        uploadState={uploadState}
      />
    </>
  );
}

//Percentage of the progress to consider it finishing.
const PROGRESS_FINISHING_LIMIT = 90;

export default UploadZone;
