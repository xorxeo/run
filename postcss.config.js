module.exports = {
  plugins: [
    // require.resolve("postcss-import"),
    // require.resolve("postcss-nested")({
    //   bubble: ["screen"],
    // }),
    require.resolve('tailwindcss'),
    require.resolve('autoprefixer'),
    require.resolve('postcss-import'),
  ],
};
