import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const HtmlTest = () =>{

    const gifDir = FileSystem.cacheDirectory + 'javascript/';
    const gifFileUri = (gifId) => gifDir + gifId;
    const gifUrls = [
        'runtime~app.95050ee161a67548be1d.js',
        'app.95050ee161a67548be1d.js',
        '13.95050ee161a67548be1d.js',
      ].map(gifId => `https://editor.deoairport.co.id/mobile/${gifId}`);
    
    // Checks if gif directory exists. If not, creates it
    async function ensureDirExists() {
        const dirInfo = await FileSystem.getInfoAsync(gifDir);
        if (!dirInfo.exists) {
            console.log("Gif directory doesn't exist, creating...");
            await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
        }
    }

    const downloadFile = async (url, fileName) => {
        const fileUri = gifFileUri(fileName);

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log(fileInfo);

        if (!fileInfo.exists) {
            console.log(`${fileName} isn't cached locally. Downloading...`);
            await FileSystem.downloadAsync(url, fileUri);
        }
    }

    const [filesDownloaded, setFilesDownloaded] = useState(false);

    const downloadAllFiles = async () => {
        await ensureDirExists();
        for (let i = 0; i < gifUrls.length; i++) {
            await downloadFile(gifUrls[i], `file${i}.js`);
        }
        setFilesDownloaded(true);
    }

    useEffect(() => {
        downloadAllFiles();
    }, []);








    return (
        <>
        <Text>{filesDownloaded}</Text>

            {filesDownloaded && (
                
                <WebView
                androidHardwareAccelerationDisabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="utf-8">
                <meta httpequiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover">
               <title>DEO MOBILE</title>
               <style>
                html,
                body,
                #root {
                  width: 100%;
                  /* To smooth any scrolling behavior */
                  -webkit-overflow-scrolling: touch;
                  margin: 0px;
                  padding: 0px;
                  /* Allows content to fill the viewport and go beyond the bottom */
                  min-height: 100%;
                  user-select: none;
                  overflow: hidden;
                  -webkit-user-select: none;
                  -moz-user-select: none;
                }
                #root {
                  flex-shrink: 0;
                  flex-basis: auto;
                  flex-grow: 1;
                  display: flex;
                  flex: 1;
                }
              
                html {
                  scroll-behavior: smooth;
                  /* Prevent text size change on orientation change https://gist.github.com/tfausak/2222823#file-ios-8-web-app-html-L138 */
                  -webkit-text-size-adjust: 100%;
                  height: calc(100% + env(safe-area-inset-top));
                }
              
                body {
                  display: flex;
                  /* Allows you to scroll below the viewport; default value is visible */
                  overflow-y: auto;
                  overscroll-behavior-y: none;
                  text-rendering: optimizeLegibility;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                  -ms-overflow-style: scrollbar;
                }
                /* Enable for apps that support dark-theme */
                /*@media (prefers-color-scheme: dark) {
                  body {
                    background-color: black;
                  }
                }*/</style>
                <script>
                SANDBOX_DOMAIN = ""
                MAIN_DOMAIN = ""
                SAML_ENABLED = JSON.parse("false")
                CLIENT_ID = ""
                RESTRICTED_DOMAIN = ""
                DISABLE_USER_PASS_LOGIN = JSON.parse("false")
                INCLUDE_COOKIES_IN_API_CALLS = ""
                window.htmlLoadedAt = performance.now()</script>
                
                
                <link rel="manifest" href="https://editor.deoairport.co.id/mobile/manifest.json">
                <meta name="mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-touch-fullscreen" content="yes">
                <meta name="apple-mobile-web-app-title" content="retool-mobile">
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
                </head>
                <body>
                
                <div id="root" class="fs-mask">
                BABI ANJING
                </div>
              
              
                          <script>
                          window.addEventListener("message", (e) => {
                            if(e.data?.key == 'YORI_MESSAGE'){
                              window.ReactNativeWebView?.postMessage(JSON.stringify(e.data.data));
                            }
                          });
                          </script>
                          
                          ${gifUrls.map((url, index) => `
                        <script src="${gifFileUri(`file${index}.js`)}"></script>
                    `).join('\n')}
                    </body>
                </html>` }}
      />
            )}
        </>
    )
}

export default HtmlTest
