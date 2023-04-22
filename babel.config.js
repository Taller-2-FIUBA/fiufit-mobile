module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    test: {
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', { loose: true }],
      ],
    },
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};