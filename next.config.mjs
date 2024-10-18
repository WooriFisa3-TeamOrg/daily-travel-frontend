/** @type {import('next').NextConfig} */

const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/backend/:path*",
                destination: "http://localhost:8080" + "/:path*",
            },
        ];
    },
    env: {
        AXIOS_BASE_URL: process.env.AXIOS_BASE_URL,
    },
    reactStrictMode: true,
    images: {
        minimumCacheTTL: 60,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "s3.ap-northeast-2.amazonaws.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "**",
            },
        ],
    },
};

export default nextConfig;
