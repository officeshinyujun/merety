import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  sassOptions: {
  additionalData: `
    @use "@/constants/COLORS.scss" as *;
    @use "@/constants/FONTS.scss" as *;
    @use "@/constants/SPACING.scss" as *;
  `,
},

};

export default nextConfig;