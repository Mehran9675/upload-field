"use client";
import { pdfjs } from "react-pdf";
import { FC, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import stopPropagation from "@functions/stopPropagation";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface Props {
  file: File;
  uploadFile: () => void;
  removeFile: () => void;
  isUploaded?: boolean;
}

const PdfViewer: FC<Props> = (props) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  const handleGoToNextPage = () => {
    if (currentPage + 1 > numPages) return;
    setCurrentPage((prev) => prev + 1);
  };
  const handleGoToPreviousPage = () => {
    if (currentPage - 1 === 0) return;
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div
      onClick={stopPropagation}
      className="space-y-2 min-h-screen flex flex-col justify-center items-center"
    >
      <Document file={props.file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={currentPage} />
      </Document>
      <div className="flex items-center justify-between bg-white p-2 rounded text-xs w-full">
        <div className="space-x-2">
          <span>
            Page {currentPage} of {numPages}
          </span>
          <button
            disabled={currentPage - 1 === 0}
            onClick={handleGoToPreviousPage}
            className="shadow p-1 px-2 border border-gray-300 rounded disabled:opacity-25"
          >
            {"<"}
          </button>
          <button
            disabled={currentPage === numPages}
            onClick={handleGoToNextPage}
            className="shadow p-1 px-2 border border-gray-300 rounded disabled:opacity-25"
          >
            {">"}
          </button>
        </div>
        {!props.isUploaded ? (
          <div className="space-x-2">
            <button
              onClick={props.removeFile}
              className="shadow p-1 px-2 border border-gray-300 rounded"
            >
              Delete
            </button>
            <button
              onClick={props.uploadFile}
              className="shadow p-1 px-2 border border-gray-300 rounded"
            >
              Upload
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PdfViewer;
