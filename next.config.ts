import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits plain HTML/CSS/JS to `out/`
  output: "export",
  // The default image optimizer needs a server, so serve images as-is
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
