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
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
                port: "",
                pathname: "**",
            },
        ],
    },
};

export default nextConfig;
