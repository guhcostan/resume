/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Set to your repo name when deploying to GitHub Pages project sites,
  // e.g. basePath: "/resume". Leave empty for Vercel or a custom domain.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
};

module.exports = nextConfig;
