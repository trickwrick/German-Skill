const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/courses/a1", destination: "/course/German-A1", permanent: true },
      { source: "/courses/a2", destination: "/course/German-A2", permanent: true },
      { source: "/courses/b1", destination: "/course/German-B1", permanent: true },
      { source: "/courses/b2", destination: "/course/German-B2", permanent: true },
      { source: "/courses/c1", destination: "/course/German-C1", permanent: true },
      { source: "/courses/c2", destination: "/course/German-C2", permanent: true },
      { source: "/course/German A1", destination: "/course/German-A1", permanent: true },
      { source: "/course/German A2", destination: "/course/German-A2", permanent: true },
      { source: "/course/German B1", destination: "/course/German-B1", permanent: true },
      { source: "/course/German B2", destination: "/course/German-B2", permanent: true },
      { source: "/course/German C1", destination: "/course/German-C1", permanent: true },
      { source: "/course/German C2", destination: "/course/German-C2", permanent: true },
      { source: "/course/German%20A1", destination: "/course/German-A1", permanent: true },
      { source: "/course/German%20A2", destination: "/course/German-A2", permanent: true },
      { source: "/course/German%20B1", destination: "/course/German-B1", permanent: true },
      { source: "/course/German%20B2", destination: "/course/German-B2", permanent: true },
      { source: "/course/German%20C1", destination: "/course/German-C1", permanent: true },
      { source: "/course/German%20C2", destination: "/course/German-C2", permanent: true },
    ];
  },
};

export default nextConfig;
