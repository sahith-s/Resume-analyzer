import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Drag and Drop functionality
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".pdf",
  });

  // Remove selected file
  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent triggering the dropzone click
    setSelectedFile(null);
  };

  // Handle File Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Store analysis result in local storage and navigate to analysis page
      localStorage.setItem("analysisReport", response.data.analysis);
      navigate("/analysis");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Your Resume</h1>
      <p>Drag and drop your resume here or click to upload</p>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className="file-info">
            <p>{selectedFile.name}</p>
            <button 
              className="remove-file-btn" 
              onClick={handleRemoveFile}
              aria-label="Remove selected file"
            >
              ✕
            </button>
          </div>
        ) : (
          <p>Drop your PDF file here</p>
        )}
      </div>

      {selectedFile && (
        <button className="upload-button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      )}
    </div>
  );
};

export default Upload;