"use client";

import { useState, type ChangeEvent } from "react";
import type { GeneralPageImageFolder } from "../../../lib/generalPageImageStore";

type AdminImageUploadFieldProps = {
  label: string;
  value: string;
  folder: GeneralPageImageFolder;
  uploadLabel?: string;
  placeholder?: string;
  onChange: (path: string) => void;
};

export default function AdminImageUploadField({
  label,
  value,
  folder,
  uploadLabel,
  placeholder = "/tutors/name.jpg",
  onChange,
}: AdminImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setUploadError("");
    setSelectedFileName("");

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      if (uploadLabel) {
        formData.append("label", uploadLabel);
      }

      const response = await fetch("/api/admin/general-pages/upload-image", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      const data = (await response.json()) as { error?: string; path?: string };

      if (!response.ok || !data.path) {
        setUploadError(data.error ?? "Could not upload image.");
        event.target.value = "";
        return;
      }

      onChange(data.path);
      setSelectedFileName(file.name);
    } catch {
      setUploadError("Could not upload image.");
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="adm-form-field adm-form-field-full adm-image-field">
      <span>{label}</span>

      {value ? (
        <div className="adm-image-preview">
          <img src={value} alt={label} className="adm-image-preview-img" />
        </div>
      ) : null}

      <label className="adm-file-upload">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
        <span className="adm-file-btn">{uploading ? "Uploading..." : "Choose Image"}</span>
        <span className="adm-file-name">
          {selectedFileName || "Upload from PC or mobile (JPG, PNG, WEBP, GIF up to 5MB)"}
        </span>
      </label>

      {uploadError ? <p className="adm-file-error">{uploadError}</p> : null}

      <label className="adm-form-field adm-form-field-full adm-image-path-field">
        <span>Image Path</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        <small className="adm-field-hint">
          Upload an image from your PC or paste an existing image path manually.
        </small>
      </label>
    </div>
  );
}
