module.exports = {
  env: {
    development: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            exclude: ['transform-async-to-generator', 'transform-regenerator'],
            targets: {
              ie: 11
            }
          }
        ]
      ],
      plugins: [
        [
          'module:fast-async',
          {
            spec: true
          }
        ]
      ]
    },
    regressions: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              chrome: 69
            }
          }
        ]
      ]
    }
  }
};
