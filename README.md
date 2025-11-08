![Tests](https://github.com/CSCI-40500-Fall-2025/SWE-G2/actions/workflows/tests.yml/badge.svg)
[![Android CI/CD](https://github.com/CSCI-40500-Fall-2025/SWE-G2/actions/workflows/android-cicd.yml/badge.svg)](https://github.com/CSCI-40500-Fall-2025/SWE-G2/actions/workflows/android-cicd.yml)
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_KG6YNPd)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=20217788)

# Project 2

## Product Vision: Capture!
A media app that mixes a diary and social media, where the user can log in.
User is able to:
“log” a photo (selected at random from the last 24 hours from their camera roll), then write a description of the photo that was selected, then can post it either privately (no one but you will see), friends only, or public.
View your “feed” of those that you are friended, follow, or randoms.

Notify user to log for the day

Revenue Options:
Premium: User is able to reroll 3 times a day AND INCLUDES VIDEOS? or infinite (tbd) for the images.
ADVERTISEMENTS 

**For individuals Who wants to document their life or make a journal**
The Capture! is a mix of a journal and a social media app
That allows users to log their own journeys in life while viewing what others have posted as well
Unlike Bereal, Capture! has private journaling and optional sharing that lets users share entries with close friends. They make the user take the picture on the spot, making the image feel planned more so than an actual snapshot of your day.
Our Product prioritizes the idea of ‘capturing the moment’ and the activities throughout your day, giving you a variety of logs. Favoring a more lifestyle post approach than favoring ‘highlights’ and ‘popular’ moments in your life.

Hybrid local-cloud sync
Mix of local and cloud storage, local when logs are private and cloud for shared online (all logs are sent to local and a copy is made and sent to cloud for shared).

# Getting Started

## Requirements
> **1**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.
  **2**: 
## Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.
To start the Metro dev server, run the following command from the root of your React Native project:

```sh
cd SWE-G2/Capture

# Using npm
npm start

# OR using Yarn
yarn start
```

## Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler (or through brew) to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
cd ios
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Layered Software Architecture


<img width="969" height="1090" alt="image" src="https://github.com/user-attachments/assets/8a103706-3aeb-4f10-bd9f-67051583efa8" />
<img width="950" height="727" alt="image" src="https://github.com/user-attachments/assets/08d31534-7f8c-4da5-8a6b-f125a6d8f310" />



User Interface
Framework: React Native (current stack)
Navigation: React Navigation
UI Components: React Native Elements or NativeBase
Image Handling: react-native-image-picker

Authentication & User Interaction
Auth Service: Creating our own Authentication
Session Management:  ??? + Context API + React Navigation

Application-Specific Functionality
Photo Processing: react-native-camera, react-native-video

Basic Shared Services
Cloud Storage: MongoDB


