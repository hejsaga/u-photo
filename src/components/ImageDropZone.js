import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";
import useImageUpload from "../hooks/useImageUpload";

const ImageDropzone = ({ albumId }) => {
  const uploadImage = useImageUpload(albumId);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) {
      return;
    }

    uploadImage.mutate(acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/gif, image/jpeg, image/png, image/webp",
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      id="upload-image-dropzone-wrapper"
      className={`${isDragAccept ? "drag-accept" : ""} ${
        isDragReject ? "drag-reject" : ""
      }`}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        isDragAccept ? (
          <p>Drop images</p>
        ) : (
          <p>This file is not supported</p>
        )
      ) : (
        <p>Upload images</p>
      )}

      {acceptedFiles.length > 0 && (
        <div className="accepted-files mt-2">
          <ul className="list-unstyled">
            {acceptedFiles.map((file) => (
              <li key={file.name}>
                {file.name} ({Math.round(file.size / 1024)} kb)
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadImage.uploadProgress !== null && (
        <ProgressBar
          variant="success"
          animated
          now={uploadImage.uploadProgress}
        />
      )}

      {uploadImage.isError && (
        <Alert variant="warning">{uploadImage.error}</Alert>
      )}
      {uploadImage.isSuccess && (
        <Alert variant="success">Images uploaded successfully!</Alert>
      )}
    </div>
  );
};

export default ImageDropzone;
