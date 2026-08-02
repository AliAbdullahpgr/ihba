import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Contact details moved into the Organisation settings screen. Handled
        // here rather than by a redirecting page component, which Next cannot
        // collect page data for at build time.
        source: "/admin/contact",
        destination: "/admin/organisation",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
