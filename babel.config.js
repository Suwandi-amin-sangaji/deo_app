module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "react-native-reanimated/plugin",
      "expo-router/babel",
      "nativewind/babel",
      ["module-resolver", {
        "alias": {
          "@components": "./src/components",
          "@app": "./src/app",
          "@context": "./src/context",
          "@api": "./src/api",
          "@assets": "./assets",
          "@hooks": "./src/hooks",
          "@utils": "./src/utils",
        },
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ]
      }],
    ]
  };
};
