"use client";

import { useEffect, useRef, useState } from "react";
import { CKEditor } from "ckeditor4-react";
import { convertPlainTextPaste, preparePastedBlogHtml } from "../../../../../lib/blogHtmlUtils";

const CKEDITOR_CDN = "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js";
const CKEDITOR_CONTENTS_CSS = "/ckeditor-blog-contents.css";

const editorConfig = {
  height: 480,
  toolbar: "Full",
  allowedContent: true,
  extraAllowedContent: "*(*);*{*}",
  pasteFromWordRemoveFontStyles: true,
  pasteFromWordRemoveStyles: false,
  pasteFromWordPromptCleanup: false,
  forcePasteAsPlainText: false,
  ignoreEmptyParagraph: true,
  font_defaultLabel: "Segoe UI",
  fontSize_defaultLabel: "14",
  removePlugins: "exportpdf",
  contentsCss: CKEDITOR_CONTENTS_CSS,
  table_defaultAttributes: {
    border: 1,
    cellpadding: 8,
    cellspacing: 0,
  },
  table_defaultStyles: {
    "border-collapse": "collapse",
    width: "100%",
    border: "1px solid #d1d5db",
  },
  filebrowserUploadUrl: "/api/admin/blog-images/ckeditor",
  filebrowserImageUploadUrl: "/api/admin/blog-images/ckeditor",
};

type BlogCKEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type CKEditorInstance = {
  getData: () => string;
  setData: (data: string) => void;
};

type CKEditorPasteEvent = {
  data: {
    dataValue: string;
    dataTransfer?: {
      getData: (type: string) => string;
    };
  };
  cancel: () => void;
};

export default function BlogCKEditor({ value, onChange }: BlogCKEditorProps) {
  const editorRef = useRef<CKEditorInstance | null>(null);
  const isInternalChangeRef = useRef(false);
  const [editorStatus, setEditorStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isInternalChangeRef.current) {
      return;
    }

    const currentData = editor.getData();
    const nextData = value || "";
    if (currentData !== nextData) {
      editor.setData(nextData);
    }
  }, [value]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setEditorStatus((current) => (current === "loading" ? "error" : current));
    }, 15000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="blog-ckeditor-wrap blog-ckeditor4-wrap">
      {editorStatus === "loading" ? (
        <p className="blog-ckeditor-loading">Loading editor...</p>
      ) : null}
      {editorStatus === "error" ? (
        <p className="blog-ckeditor-error">
          Editor failed to load. Check your internet connection and refresh the page.
        </p>
      ) : null}
      <CKEditor
        editorUrl={CKEDITOR_CDN}
        initData={value || ""}
        config={editorConfig}
        onInstanceReady={(event) => {
          const editor = event.editor;
          editorRef.current = editor ?? null;
          setEditorStatus("ready");

          editor?.on(
            "paste",
            (pasteEvent: CKEditorPasteEvent) => {
              const html = (pasteEvent.data.dataValue ?? "").trim();
              const plainText = pasteEvent.data.dataTransfer?.getData("text/plain") ?? "";

              if (html) {
                pasteEvent.data.dataValue = preparePastedBlogHtml(html);
                return;
              }

              if (plainText) {
                pasteEvent.cancel();
                editor.insertHtml(convertPlainTextPaste(plainText));
              }
            },
            null,
            null,
            20,
          );
        }}
        onChange={(event) => {
          if (!event.editor) {
            return;
          }

          isInternalChangeRef.current = true;
          onChange(event.editor.getData());
          window.requestAnimationFrame(() => {
            isInternalChangeRef.current = false;
          });
        }}
      />
    </div>
  );
}
