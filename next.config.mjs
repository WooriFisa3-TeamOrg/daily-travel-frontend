/** @type {import('next').NextConfig} */

const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/backend/:path*",
                destination: "http://localhost:8080/:path*",
            },
        ];
    },
};

export default nextConfig;
