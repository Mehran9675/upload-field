"use client";
import preventDefault from "@functions/preventDefault";
import { ChangeEvent, DragEvent, FC, useMemo, useRef, useState } from "react";
import File from "@components/upload/file";
import stopPropagation from "@functions/stopPropagation";

interface Props {
  onChange?: (values: any[]) => void;
  value?: File[];
}

const UploadField: FC<Props> = (props) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileNames = useMemo(() => files.map((file) => file.name), [files]);
  console.log(props.value);
  const handleAddFile = (file: File) => {
    if (!fileNames.includes(file.name)) setFiles((files) => [...files, file]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files[0].type !== "application/pdf") return;
    handleAddFile(event.dataTransfer.files[0]);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) handleAddFile(newFile);
    if (inputRef.current) inputRef.current.files = null;
  };

  const handleDeleteFile = (file: File) => () =>
    setFiles((files) =>
      files.filter((currFile) => currFile.name !== file.name)
    );

  const handleDeleteExternalFile = (file: File) => () => {
    if (props.onChange && props.value)
      props.onChange(
        props.value.filter((extFile) => extFile.name !== file.name)
      );
  };

  const openFileBrowser = () => inputRef.current?.click();

  const onUpload = (res: any) => {
    if (props.onChange) props.onChange([...(props.value || []), res]);
  };

  const renderFiles = (file: File) => (
    <File
      onUploadFinished={onUpload}
      key={file.name}
      deleteFile={handleDeleteFile(file)}
      file={file}
    />
  );

  const renderExternalFiles = (file: File) => {
    if (!fileNames.includes(file.name))
      return (
        <File
          key={file.name}
          file={file}
          deleteFile={handleDeleteExternalFile(file)}
          isUploaded
        />
      );
  };

  return (
    <div className="flex flex-col space-y-3 w-full max-w-5xl">
      <div
        onDrop={handleDrop}
        onDragOver={preventDefault}
        onClick={stopPropagation}
        className="flex flex-col p-4 rounded-xl items-center justify-center border border-gray-300 h-40  w-full m-auto bg-white"
      >
        <p>
          Drag and drop your pdf file or{" "}
          <a onClick={openFileBrowser} className="text-blue-400 cursor-pointer">
            Browse files
          </a>
        </p>
        <input
          onChange={handleFileSelect}
          type="file"
          ref={inputRef}
          hidden
          accept=".pdf"
        />
      </div>
      {(props.value || []).map(renderExternalFiles)}
      {files.map(renderFiles)}
    </div>
  );
};
export default UploadField;
