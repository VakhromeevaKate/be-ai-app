# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

   ```bash
    npm run ios
   ```

   ```bash
    npm run android
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
 
 ## Add onnxruntime-react-native
 Library onnxruntime-react-native is not designed for expo, as it uses some native code. To add and use it:
 1 ```expo install onnxruntime-react-native```
 2 Put the model file under <SOURCE_ROOT>/assets
 3 add a new file metro.config.js (as in this project):
 ```
   const { getDefaultConfig } = require('@expo/metro-config');
   const defaultConfig = getDefaultConfig(__dirname);
   defaultConfig.resolver.assetExts.push('ort');
   module.exports = defaultConfig;
 ```
 4 In <SOURCE_ROOT>/app.json, add the following line to section expo:
 ```"plugins": ["onnxruntime-react-native"],```
 5 npx expo prebuild
 6 check or add this line in <SOURCE_ROOT>/ios/Podfile, add the following line to section target 'be-ai-app':
 ```pod 'onnxruntime-react-native', :path => '../node_modules/onnxruntime-react-native'```
 7 cd ios && pod install
 