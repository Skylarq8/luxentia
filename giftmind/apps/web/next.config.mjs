const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@giftmind/ui", "@giftmind/db"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  }
};

export default nextConfig;
