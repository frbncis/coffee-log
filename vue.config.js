// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gitDescribeSync } = require('git-describe');

process.env.VUE_APP_GIT = gitDescribeSync().hash;

module.exports = {
  productionSourceMap: false,
  pwa: {
    name: 'Coffee Log',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      exclude: [
        'CNAME',
        '404.html',
      ],
    },
  },
};
