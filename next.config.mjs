/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uploadthing.com", "utfs.io"], // Add utfs.io here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/a/bspl1n3yy6/*",
      },
    ],
  },
};

export default nextConfig;
