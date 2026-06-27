"use client";

import dynamic from "next/dynamic";
import { hasUnsupportedQuillHtml } from "../../../../../lib/blogFormUtils";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  editorKey?: string;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
];

export default function RichTextEditor({ value, onChange, editorKey }: RichTextEditorProps) {
  const safeValue = typeof value === "string" ? value : "";

  if (hasUnsupportedQuillHtml(safeValue)) {
    return (
      <div className="blog-html-editor">
        <p className="blog-html-editor-note">
          This content uses HTML tables or advanced markup. Edit the HTML below to avoid breaking
          the layout.
        </p>
        <textarea
          value={safeValue}
          onChange={(event) => onChange(event.target.value)}
          rows={18}
          className="adm-input blog-html-editor-textarea"
        />
      </div>
    );
  }

  return (
    <ReactQuill
      key={editorKey}
      theme="snow"
      value={safeValue}
      onChange={onChange}
      modules={modules}
      formats={formats}
      style={{ height: "400px", marginBottom: "50px", backgroundColor: "white", color: "black" }}
    />
  );
}
