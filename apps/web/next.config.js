/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/design-system'],
  async rewrites() {
    return [
      {
        source: '/js/script.tagged-events.outbound-links.js',
        destination: 'https://plausible.io/js/script.tagged-events.outbound-links.js',
      },
      {
        source: '/api/event',
        destination: 'https://plausible.io/api/event',
      },
      {
        source: '/.well-known/:path*',
        destination: '/well-known/:path*',
      },
    ];
  },
};
