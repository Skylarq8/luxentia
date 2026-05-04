const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@giftmind/ui", "@giftmind/db", "@giftmind/api"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  }
};

export default nextConfig;
