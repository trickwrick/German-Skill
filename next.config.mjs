const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["react-international-phone"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fluentauf.com",
      },
      {
        protocol: "https",
        hostname: "www.fluentauf.com",
      },
    ],
  },
  async headers() {
    const cacheHeader = {
      key: "Cache-Control",
      value: "public, s-maxage=300, stale-while-revalidate=600",
    };

    // Keep /blogs short-lived so a bad empty response cannot sit on the CDN for long.
    const blogListCacheHeader = {
      key: "Cache-Control",
      value: "public, s-maxage=60, stale-while-revalidate=30",
    };

    return [
      {
        source: "/",
        headers: [cacheHeader],
      },
      {
        source: "/courses",
        headers: [cacheHeader],
      },
      {
        source: "/course/:path*",
        headers: [cacheHeader],
      },
      {
        source: "/blogs",
        headers: [blogListCacheHeader],
      },
      {
        source: "/blog/:path*",
        headers: [cacheHeader],
      },
      {
        source: "/terms",
        headers: [cacheHeader],
      },
      {
        source: "/privacy",
        headers: [cacheHeader],
      },
      {
        source: "/refund",
        headers: [cacheHeader],
      },
      {
        source: "/about/our-company",
        headers: [cacheHeader],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/courses/a1", destination: "/course/german-a1", permanent: true },
      { source: "/courses/a2", destination: "/course/german-a2", permanent: true },
      { source: "/courses/b1", destination: "/course/german-b1", permanent: true },
      { source: "/courses/b2", destination: "/course/german-b2", permanent: true },
      { source: "/courses/c1", destination: "/course/german-c1", permanent: true },
      { source: "/courses/c2", destination: "/course/german-c2", permanent: true },
      { source: "/course/German A1", destination: "/course/german-a1", permanent: true },
      { source: "/course/German A2", destination: "/course/german-a2", permanent: true },
      { source: "/course/German B1", destination: "/course/german-b1", permanent: true },
      { source: "/course/German B2", destination: "/course/german-b2", permanent: true },
      { source: "/course/German C1", destination: "/course/german-c1", permanent: true },
      { source: "/course/German C2", destination: "/course/german-c2", permanent: true },
      { source: "/course/German%20A1", destination: "/course/german-a1", permanent: true },
      { source: "/course/German%20A2", destination: "/course/german-a2", permanent: true },
      { source: "/course/German%20B1", destination: "/course/german-b1", permanent: true },
      { source: "/course/German%20B2", destination: "/course/german-b2", permanent: true },
      { source: "/course/German%20C1", destination: "/course/german-c1", permanent: true },
      { source: "/course/German%20C2", destination: "/course/german-c2", permanent: true },
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/about/careers", destination: "/about/apply-job", permanent: true },
    ];
  },
};

export default nextConfig;
