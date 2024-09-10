/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/dictapi/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/dict-api/:path*"
            : "/dictapi/",
      },
    ];
  },
};

module.exports = nextConfig;
