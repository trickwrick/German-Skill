type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export default function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="adm-placeholder">
      <h1 className="adm-page-title">{title}</h1>
      <p>{description}</p>
    </div>
  );
}
