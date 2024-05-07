// metro.confgi.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});
config.resolver.assetExts.push("jsfile");



config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== "jsfile"
);

module.exports = config;