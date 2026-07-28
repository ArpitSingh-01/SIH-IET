import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    exclude: [
      /middleware-manifest\.json$/,
      /_middleware\.js$/,
      /_middleware\.js\.map$/,
      /page_client-reference-manifest\.js$/,
      /page_client-reference-manifest\.js\.map$/,
    ],
  },
});

const nextConfig: NextConfig = {
};

export default withPWA(nextConfig);
