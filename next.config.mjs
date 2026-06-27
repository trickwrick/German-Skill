const nextConfig = {
  reactStrictMode: true,
  images: {
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
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
