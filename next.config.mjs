/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old standalone routes now live under the unified Agents tab.
      { source: "/agent", destination: "/agents/coach", permanent: false },
      {
        source: "/trigger-hunter",
        destination: "/agents/trigger-hunter",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
