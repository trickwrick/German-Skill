"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { shouldUseHtmlEditor } from "../../../../../lib/blogFormUtils";
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
  "link",
  "image",
];

type HtmlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  note?: string;
};

function HtmlEditor({ value, onChange, note }: HtmlEditorProps) {
  return (
    <div className="blog-html-editor">
      {note ? <p className="blog-html-editor-note">{note}</p> : null}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={18}
        className="adm-input blog-html-editor-textarea"
      />
    </div>
  );
}

type EditorErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type EditorErrorBoundaryState = {
  hasError: boolean;
};

class EditorErrorBoundary extends Component<EditorErrorBoundaryProps, EditorErrorBoundaryState> {
  state: EditorErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function RichTextEditor({ value, onChange, editorKey }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const safeValue = typeof value === "string" ? value : "";
  const useHtmlEditor = shouldUseHtmlEditor(safeValue);

  useEffect(() => {
    setMounted(true);
  }, []);

  const htmlFallback = (
    <HtmlEditor
      value={safeValue}
      onChange={onChange}
      note="The visual editor could not load this content safely. Edit the HTML below."
    />
  );

  if (!mounted || useHtmlEditor) {
    return (
      <HtmlEditor
        value={safeValue}
        onChange={onChange}
        note={
          useHtmlEditor
            ? "This content uses tables or advanced HTML. Edit the HTML below to avoid breaking the layout."
            : undefined
        }
      />
    );
  }

  return (
    <EditorErrorBoundary fallback={htmlFallback}>
      <ReactQuill
        key={editorKey}
        theme="snow"
        value={safeValue}
        onChange={onChange}
        modules={modules}
        formats={formats}
        style={{ height: "400px", marginBottom: "50px", backgroundColor: "white", color: "black" }}
      />
    </EditorErrorBoundary>
  );
}
