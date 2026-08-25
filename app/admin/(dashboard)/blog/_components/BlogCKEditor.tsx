"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "ckeditor4-react";
import { convertPlainTextPaste, preparePastedBlogHtml } from "../../../../../lib/blogHtmlUtils";
import { MAX_BLOG_PDF_SIZE_MB, validateBlogPdfFile } from "../../../../../lib/blogPdfValidation";

const CKEDITOR_CDN = "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js";
const CKEDITOR_DEFAULT_CONTENTS_CSS = "https://cdn.ckeditor.com/4.22.1/full-all/contents.css";
const CKEDITOR_CONTENTS_CSS = "/ckeditor-blog-contents.css";
const CKEDITOR_CITY_CONTENTS_CSS = "/ckeditor-city-contents.css";

type BlogCKEditorProps = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  showPdfUpload?: boolean;
  variant?: "blog" | "city";
};

type CKEditorDomElement = {
  getAttribute: (name: string) => string | null;
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
};

type CKEditorDocument = {
  find: (selector: string) => {
    count: () => number;
    getItem: (index: number) => CKEditorDomElement;
  };
};

type CKEditorInstance = {
  getData: () => string;
  setData: (data: string, callback?: () => void) => void;
  insertHtml: (html: string) => void;
  on: (...args: unknown[]) => void;
  fire: (name: string) => void;
  document: CKEditorDocument;
  editable: () => {
    attachListener: (target: unknown, event: string, handler: (evt: { data: { $: DragEvent; preventDefault: (stop?: boolean) => void } }) => void) => void;
  };
};

type CKEditorPasteEvent = {
  data: {
    dataValue: string;
    dataTransfer?: {
      getData: (type: string) => string;
      getFilesCount?: () => number;
      getFile?: (index: number) => File;
    };
  };
  cancel: () => void;
};

type CkEditorGlobal = {
  tools: {
    htmlEncodeAttr: (value: string) => string;
  };
  on: (event: string, handler: (evt: { data: { name: string; definition: { onOk?: () => boolean; getContentsElement?: (tab: string, id: string) => { getValue: () => string; setValue: (value: string) => void } | null } } }) => void) => void;
};

function toAbsoluteEditorUrl(url: string) {
  if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) {
    return url;
  }

  return `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
}

function buildUploadedImageHtml(url: string) {
  const ckeditor = (window as typeof window & { CKEDITOR?: CkEditorGlobal }).CKEDITOR;
  const absoluteUrl = toAbsoluteEditorUrl(url);
  const encodedUrl = ckeditor?.tools.htmlEncodeAttr(absoluteUrl) ?? absoluteUrl.replace(/"/g, "&quot;");

  return `<figure class="image"><img src="${encodedUrl}" alt="" /></figure>`;
}

async function uploadBlogEditorImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/blog-images", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  const data = (await response.json()) as { path?: string; url?: string; error?: string };
  if (!response.ok || !(data.path || data.url)) {
    throw new Error(data.error || "Failed to upload image.");
  }

  return toAbsoluteEditorUrl(data.path || data.url || "");
}

async function uploadBlogEditorPdf(file: File) {
  const validation = validateBlogPdfFile(file);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/blog-pdfs", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  const data = (await response.json()) as { path?: string; url?: string; error?: string };
  if (!response.ok || !(data.path || data.url)) {
    throw new Error(data.error || "Failed to upload PDF.");
  }

  return data.path || data.url || "";
}

function buildPdfLinkHtml(url: string, label: string) {
  const ckeditor = (window as typeof window & { CKEDITOR?: CkEditorGlobal }).CKEDITOR;
  const absoluteUrl = toAbsoluteEditorUrl(url);
  const encodedUrl = ckeditor?.tools.htmlEncodeAttr(absoluteUrl) ?? absoluteUrl.replace(/"/g, "&quot;");
  const safeLabel = label.trim() || "Download PDF";
  const encodedLabel = ckeditor?.tools.htmlEncodeAttr(safeLabel) ?? safeLabel.replace(/"/g, "&quot;");

  return `<p><a href="${encodedUrl}" target="_blank" rel="noopener noreferrer">${encodedLabel}</a></p>`;
}

function insertPdfLink(editor: CKEditorInstance, url: string, label: string) {
  editor.insertHtml(buildPdfLinkHtml(url, label));
}

function prepareBlogEditorHtml(html: string) {
  const trimmed = html?.trim() ?? "";
  if (!trimmed || typeof document === "undefined" || !/<img\b/i.test(trimmed)) {
    return trimmed;
  }

  const container = document.createElement("div");
  container.innerHTML = trimmed;

  container.querySelectorAll("img").forEach((img) => {
    if (img.closest("figure.image") || img.closest("table")) {
      const src = img.getAttribute("src");
      if (src) {
        img.setAttribute("src", toAbsoluteEditorUrl(src));
      }
      return;
    }

    const src = img.getAttribute("src");
    if (src) {
      img.setAttribute("src", toAbsoluteEditorUrl(src));
    }

    const figure = document.createElement("figure");
    figure.className = "image";
    img.parentNode?.insertBefore(figure, img);
    figure.appendChild(img);
  });

  return container.innerHTML;
}

function fixEditorImages(editor: CKEditorInstance) {
  const images = editor.document.find("img");

  for (let index = 0; index < images.count(); index += 1) {
    const img = images.getItem(index);
    const savedSrc = img.getAttribute("data-cke-saved-src");
    const currentSrc = img.getAttribute("src");
    const resolvedSrc = savedSrc || currentSrc;

    if (!resolvedSrc || resolvedSrc.startsWith("data:")) {
      continue;
    }

    const absoluteSrc = toAbsoluteEditorUrl(resolvedSrc);
    if (currentSrc !== absoluteSrc) {
      img.setAttribute("src", absoluteSrc);
    }

    if (savedSrc) {
      img.removeAttribute("data-cke-saved-src");
    }
  }
}

function setupBlogEditorUploads(
  editor: CKEditorInstance,
  onImagesFixed: () => void,
  getPdfLinkLabel: () => string,
) {
  let fixingImages = false;

  const refreshImages = () => {
    if (fixingImages) {
      return;
    }

    fixingImages = true;
    fixEditorImages(editor);
    fixingImages = false;
    onImagesFixed();
  };

  editor.on("change", refreshImages);
  editor.on("afterInsertHtml", refreshImages);
  editor.on("contentDom", refreshImages);
  editor.on("dialogHide", (evt: { data?: { name?: string } }) => {
    if (evt.data?.name === "image2") {
      window.setTimeout(refreshImages, 0);
    }
  });

  editor.on("contentDom", () => {
    const editable = editor.editable();

    editable.attachListener(editable, "drop", (evt) => {
      const files = evt.data.$.dataTransfer?.files;
      const file = files?.[0];

      if (!file) {
        return;
      }

      const isPdf =
        file.type === "application/pdf" ||
        file.type === "application/x-pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        evt.data.preventDefault(true);

        void uploadBlogEditorPdf(file)
          .then((url) => {
            insertPdfLink(editor, url, getPdfLinkLabel());
            refreshImages();
          })
          .catch((error) => {
            window.alert(error instanceof Error ? error.message : "Failed to upload PDF.");
          });
        return;
      }

      if (!file.type.startsWith("image/")) {
        return;
      }

      evt.data.preventDefault(true);

      void uploadBlogEditorImage(file)
        .then((url) => {
          editor.insertHtml(buildUploadedImageHtml(url));
          refreshImages();
        })
        .catch((error) => {
          window.alert(error instanceof Error ? error.message : "Failed to upload image.");
        });
    });
  });

  const ckeditor = (window as typeof window & { CKEDITOR?: CkEditorGlobal }).CKEDITOR;
  ckeditor?.on("dialogDefinition", (evt) => {
    if (evt.data.name !== "image2") {
      return;
    }

    const dialogDefinition = evt.data.definition;
    const originalOnOk = dialogDefinition.onOk;

    dialogDefinition.onOk = function (this: { getContentElement: (tab: string, id: string) => { getValue: () => string; setValue: (value: string) => void } | null }) {
      const srcField = this.getContentElement("info", "src");
      if (srcField) {
        srcField.setValue(toAbsoluteEditorUrl(srcField.getValue()));
      }

      const result = originalOnOk ? originalOnOk.call(this) : true;
      window.setTimeout(refreshImages, 0);
      return result;
    };
  });
}

export default function BlogCKEditor({
  value,
  onChange,
  height = 480,
  showPdfUpload = true,
  variant = "blog",
}: BlogCKEditorProps) {
  const editorRef = useRef<CKEditorInstance | null>(null);
  const isInternalChangeRef = useRef(false);
  const lastEditorHtmlRef = useRef<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const [editorStatus, setEditorStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pdfLinkLabel, setPdfLinkLabel] = useState("Download PDF");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState("");
  const pdfLinkLabelRef = useRef(pdfLinkLabel);

  pdfLinkLabelRef.current = pdfLinkLabel;

  const handlePdfFile = async (file: File) => {
    setPdfUploadError("");
    setPdfUploading(true);

    try {
      const editor = editorRef.current;
      if (!editor) {
        throw new Error("Editor is not ready yet.");
      }

      const url = await uploadBlogEditorPdf(file);
      insertPdfLink(editor, url, pdfLinkLabelRef.current);
      editor.fire("change");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload PDF.";
      setPdfUploadError(message);
    } finally {
      setPdfUploading(false);
    }
  };

  const editorConfig = useMemo(
    () => ({
      height,
      toolbar: "Full",
      allowedContent: true,
      extraAllowedContent: "*(*);*{*}",
      extraPlugins: "image2",
      pasteFromWordRemoveFontStyles: true,
      pasteFromWordRemoveStyles: false,
      pasteFromWordPromptCleanup: false,
      forcePasteAsPlainText: false,
      ignoreEmptyParagraph: true,
      font_defaultLabel: "Segoe UI",
      fontSize_defaultLabel: "14",
      removePlugins: "exportpdf,image,uploadimage,elementspath",
      image2_disableResizer: false,
      disableObjectResizing: false,
      removeDialogTabs: "link:advanced",
      contentsCss:
        variant === "city"
          ? [CKEDITOR_DEFAULT_CONTENTS_CSS, CKEDITOR_CITY_CONTENTS_CSS]
          : [CKEDITOR_DEFAULT_CONTENTS_CSS, CKEDITOR_CONTENTS_CSS],
      filebrowserUploadUrl: "/api/admin/blog-images/ckeditor?",
      filebrowserImageUploadUrl: "/api/admin/blog-images/ckeditor?",
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
    }),
    [height, variant],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isInternalChangeRef.current) {
      return;
    }

    const nextData = value || "";
    if (lastEditorHtmlRef.current === nextData) {
      return;
    }

    const currentData = editor.getData();
    const preparedData = prepareBlogEditorHtml(nextData);
    if (currentData === preparedData) {
      lastEditorHtmlRef.current = nextData;
      return;
    }

    lastEditorHtmlRef.current = nextData;
    isInternalChangeRef.current = true;
    editor.setData(preparedData, () => {
      isInternalChangeRef.current = false;
      fixEditorImages(editor);
    });
  }, [value]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setEditorStatus((current) => (current === "loading" ? "error" : current));
    }, 20000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`blog-ckeditor-wrap blog-ckeditor4-wrap${
        variant === "city" ? " blog-ckeditor4-wrap-city" : ""
      }`}
    >
      {editorStatus === "ready" && showPdfUpload ? (
        <div className="blog-pdf-upload-bar">
          <label className="blog-pdf-upload-field">
            <span>PDF link text</span>
            <input
              type="text"
              value={pdfLinkLabel}
              onChange={(event) => setPdfLinkLabel(event.target.value)}
              placeholder="Download PDF"
              className="adm-input"
            />
          </label>
          <label className="adm-file-upload blog-pdf-upload-btn">
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf,.pdf"
              disabled={pdfUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) {
                  void handlePdfFile(file);
                }
              }}
            />
            <span className="adm-file-btn">{pdfUploading ? "Uploading PDF..." : "Upload PDF"}</span>
            <span className="adm-file-name">PDF up to {MAX_BLOG_PDF_SIZE_MB}MB — inserts a download link in content</span>
          </label>
        </div>
      ) : null}
      {pdfUploadError ? <p className="adm-file-error blog-pdf-upload-error">{pdfUploadError}</p> : null}
      {editorStatus === "loading" ? (
        <p className="blog-ckeditor-loading">Loading editor...</p>
      ) : null}
      {editorStatus === "error" ? (
        <p className="blog-ckeditor-error">
          Editor failed to load. Please hard refresh the page (Ctrl+Shift+R) and check your internet connection.
        </p>
      ) : null}
      <CKEditor
        editorUrl={CKEDITOR_CDN}
        initData={value || ""}
        config={editorConfig}
        onInstanceReady={(event) => {
          try {
            const editor = event.editor as CKEditorInstance;
            editorRef.current = editor;
            setEditorStatus("ready");

            const syncEditorHtml = () => {
              if (isInternalChangeRef.current) {
                return;
              }

              isInternalChangeRef.current = true;
              const html = editor.getData();
              lastEditorHtmlRef.current = html;
              onChange(html);
              window.requestAnimationFrame(() => {
                isInternalChangeRef.current = false;
              });
            };

            setupBlogEditorUploads(editor, syncEditorHtml, () => pdfLinkLabelRef.current);

            const initialHtml = prepareBlogEditorHtml(editor.getData());
            if (initialHtml !== editor.getData()) {
              isInternalChangeRef.current = true;
              editor.setData(initialHtml, () => {
                isInternalChangeRef.current = false;
                fixEditorImages(editor);
                const html = editor.getData();
                lastEditorHtmlRef.current = html;
                onChange(html);
              });
            } else {
              fixEditorImages(editor);
              lastEditorHtmlRef.current = editor.getData();
            }

            editor.on(
              "paste",
              (pasteEvent: CKEditorPasteEvent) => {
                const html = (pasteEvent.data.dataValue ?? "").trim();
                const plainText = pasteEvent.data.dataTransfer?.getData("text/plain") ?? "";
                const dataTransfer = pasteEvent.data.dataTransfer;
                const pastedFile =
                  dataTransfer?.getFilesCount && dataTransfer.getFilesCount() > 0
                    ? dataTransfer.getFile?.(0)
                    : undefined;

                if (pastedFile && pastedFile.type.startsWith("image/")) {
                  pasteEvent.cancel();

                  void uploadBlogEditorImage(pastedFile)
                    .then((url) => {
                      editor.insertHtml(buildUploadedImageHtml(url));
                      fixEditorImages(editor);
                      syncEditorHtml();
                    })
                    .catch((error) => {
                      window.alert(error instanceof Error ? error.message : "Failed to upload image.");
                    });
                  return;
                }

                if (
                  pastedFile &&
                  (pastedFile.type === "application/pdf" ||
                    pastedFile.name.toLowerCase().endsWith(".pdf"))
                ) {
                  pasteEvent.cancel();

                  void uploadBlogEditorPdf(pastedFile)
                    .then((url) => {
                      insertPdfLink(editor, url, pdfLinkLabelRef.current);
                      syncEditorHtml();
                    })
                    .catch((error) => {
                      window.alert(error instanceof Error ? error.message : "Failed to upload PDF.");
                    });
                  return;
                }

                if (html) {
                  pasteEvent.data.dataValue = prepareBlogEditorHtml(preparePastedBlogHtml(html));
                  window.setTimeout(() => fixEditorImages(editor), 0);
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
          } catch (error) {
            console.error("Blog CKEditor init failed", error);
            setEditorStatus("error");
          }
        }}
        onChange={(event) => {
          if (!event.editor || isInternalChangeRef.current) {
            return;
          }

          isInternalChangeRef.current = true;
          const html = event.editor.getData();
          lastEditorHtmlRef.current = html;
          onChange(html);
          window.requestAnimationFrame(() => {
            isInternalChangeRef.current = false;
          });
        }}
      />
    </div>
  );
}
