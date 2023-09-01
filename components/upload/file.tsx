import { FC, useState } from "react";
import Modal from "@components/modal";
import PdfViewer from "@components/pdfViewer";
import { END_POINTS } from "@constants/endPoints";

interface Props {
  file: File;
  deleteFile: () => void;
  onUploadFinished?: (response: any) => void;
  isUploaded?: boolean;
}

const File: FC<Props> = (props) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<string>("0");
  const [isUploaded, setIsUploaded] = useState(props.isUploaded);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleUpload = () => {
    setError(false);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setIsUploaded(true);
        if (props.onUploadFinished) props.onUploadFinished(props.file); // should be xhr.response but set to input file for testing
      } else if (xhr.status > 204) {
        setError(true);
      }
    };
    xhr.upload.addEventListener("error", () => setError(true));
    xhr.upload.addEventListener("progress", (event) =>
      setUploadProgress((event.loaded / event.total).toFixed(0))
    );
    xhr.open("POST", END_POINTS.UPLOAD, true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    const formData = new FormData();
    formData.append("file", props.file);
    xhr.send(formData);
    setIsUploading(true);
  };

  const closePreviewAndDelete = () => {
    setIsPreviewVisible(false);
    props.deleteFile();
  };

  const handleStartUpload = () => {
    setIsPreviewVisible(false);
    handleUpload();
  };

  return (
    <div className="flex h-20 p-4 w-full bg-white rounded justify-between shadow">
      <Modal
        close={() => setIsPreviewVisible(false)}
        visible={isPreviewVisible}
      >
        <PdfViewer
          isUploaded={isUploaded}
          uploadFile={handleStartUpload}
          removeFile={closePreviewAndDelete}
          file={props.file}
        />
      </Modal>
      <label className="flex flex-col">
        <span>{props.file.name}</span>
        <span>
          {(props.file.size / 1024).toFixed(0)} KBytes{" "}
          {error ? (
            <span className="text-xs text-red-400">UPLOAD FAILED</span>
          ) : (
            <span className="text-xs text-slate-400">
              {isUploading && !isUploaded && !error
                ? `${uploadProgress}% UPLOADED`
                : isUploaded
                ? "UPLOADED"
                : "NOT UPLOADED"}
            </span>
          )}
        </span>
      </label>
      <label className="flex flex-col text-center text-blue-400">
        <a onClick={props.deleteFile} className="cursor-pointer">
          DELETE
        </a>
        <a onClick={() => setIsPreviewVisible(true)} className="cursor-pointer">
          VIEW
        </a>
      </label>
    </div>
  );
};
export default File;
