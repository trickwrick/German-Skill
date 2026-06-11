type SiteLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function SiteLogo({ className = "site-logo", priority = false }: SiteLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/fluent-logo.png"
      alt="Fluent AUF — Learn German with Confidence"
      className={className}
      width={230}
      height={56}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
