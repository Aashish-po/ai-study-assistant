/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const ensureCssInteropCache = () => {
  const cacheDir = path.join(__dirname, "node_modules", "react-native-css-interop", ".cache");
  const webCss = path.join(cacheDir, "web.css");

  try {
    fs.mkdirSync(cacheDir, { recursive: true });
    if (!fs.existsSync(webCss)) {
      fs.writeFileSync(webCss, "");
    }
  } catch (error) {
    console.warn("[nativewind] Unable to prepare css-interop cache", error);
  }
};

ensureCssInteropCache();

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
  forceWriteFileSystem: true,
});