'use client'
import axiosInstance from "@/api/axiosInstance";
import React, { useState } from "react";


const CertificateUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a certificate file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/certificates/upload-certificate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        
        },
      });

      setMessage("Certificate uploaded successfully!");
      console.log("Uploaded URL:", response.data.chef.certificate);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Upload Certificate</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-700"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mb-4 h-40 object-contain border rounded"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default CertificateUpload;
