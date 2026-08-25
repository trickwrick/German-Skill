"use client";

import BlogContentEditor from "../(dashboard)/blog/_components/BlogContentEditor";

type AdminRichTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  height?: number;
  showPdfUpload?: boolean;
};

export default function AdminRichTextField({
  label,
  value,
  onChange,
  hint,
  height = 280,
  showPdfUpload = false,
}: AdminRichTextFieldProps) {
  return (
    <div className="adm-city-field adm-city-rich-field">
      <span>{label}</span>
      <BlogContentEditor
        value={value}
        onChange={onChange}
        height={height}
        showPdfUpload={showPdfUpload}
        variant="city"
      />
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
