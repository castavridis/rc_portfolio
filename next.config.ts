import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/toys/calder',
        destination: '/toys/sandy',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/toys/calder/:page',
        destination: '/toys/sandy/:page',
        permanent: true,
      },      // Basic redirect
      {
        source: '/toys/raincheck',
        destination: '/toys/rain_check',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/toys/raincheck/:page',
        destination: '/toys/rain_check/:page',
        permanent: true,
      },
    ]
  },
}

export default {
  ...nextConfig,
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  turbopack: {
    root: "/Users/cstavridis/Git/rc_portfolio"
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}