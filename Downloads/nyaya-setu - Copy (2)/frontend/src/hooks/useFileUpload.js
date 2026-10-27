import { useState } from "react";

export default function useFileUpload() {
  const [files, setFiles] = useState([]);
  function addFile(file) {
    setFiles((current) => [...current, file]);
  }
  function removeFile(index) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }
  return { files, addFile, removeFile };
}
