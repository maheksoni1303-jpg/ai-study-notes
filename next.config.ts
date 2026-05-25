import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@xenova/transformers",
    "onnxruntime-node",
    "pdf-parse",
    "pdfjs-dist",
  ],
};

export default nextConfig;
