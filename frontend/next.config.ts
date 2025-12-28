import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
  additionalData: `
    @use "@/styles/COLORS.scss" as *;
    @use "@/styles/FONTS.scss" as *;
    @use "@/styles/SPACING.scss" as *;
  `,
},

};

export default nextConfig;