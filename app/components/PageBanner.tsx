import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type PageBannerProps = {
  title: string;
  breadcrumbs: Crumb[];
  description?: string;
  variant?: "default" | "brand";
  layout?: "standard" | "stacked";
};

export default function PageBanner({
  title,
  breadcrumbs,
  description,
  variant = "default",
  layout = "standard",
}: PageBannerProps) {
  const isStacked = layout === "stacked";

  const breadcrumbNav = (
    <nav className="page-banner-breadcrumbs" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.label} className="page-banner-crumb">
          {index > 0 ? <span className="page-banner-sep" aria-hidden="true">»</span> : null}
          {crumb.href ? (
            <Link href={crumb.href}>{crumb.label}</Link>
          ) : (
            <span className="page-banner-current">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );

  return (
    <section
      className={`page-banner${variant === "brand" ? " page-banner-brand" : ""}${isStacked ? " page-banner-stacked" : ""}`}
      aria-labelledby="page-banner-title"
    >
      {variant === "default" ? <div className="page-banner-flare" aria-hidden="true" /> : null}
      <div className="page-banner-inner">
        {isStacked ? breadcrumbNav : null}
        <h1 id="page-banner-title">{title}</h1>
        {!isStacked ? breadcrumbNav : null}
        {description ? <p className="page-banner-description">{description}</p> : null}
      </div>
    </section>
  );
}
