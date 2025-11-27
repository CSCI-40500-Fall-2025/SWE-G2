/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Homepage from './src/screens/homepage';
import Friends from './src/screens/Friends';
import Profile from './src/screens/Profile';
import AuthScreen from './src/screens/AuthScreen';
import ImageUploadScreen from './src/screens/CameraScreen';

import * as Sentry from '@sentry/react-native';
import log from './src/utils/logger';

Sentry.init({
  dsn: 'https://8ba65d59fcc2de5335f55531021b0a77@o4510370827534350.ingest.us.sentry.io/4510370828713984',
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

type RootStackParamList = {
  AuthScreen: undefined;
  HomeTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
      screenListeners={{
        tabPress: (e) => {
          const target = e.target;
          if (!target) return;
          
          const tabName = target.split('-')[0];
          
          switch(tabName) {
            case 'Homepage':
              log.info("User navigating to Homepage");
              break;
            case 'Profile':
              log.info("User accessing Profile");
              break;
            case 'Camera':
              log.info("User opening Camera");
              break;
            case 'Friends':
              log.info("User accessing Friends");
              break;
            case 'TEST SIGNUP':
              log.info("User accessing Auth screen");
              break;
          }
        },
      }}
    >
      <Tab.Screen name="Homepage" component={Homepage} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Photos" component={ImageUploadScreen} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="TEST SIGNUP" component={AuthScreen} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthScreen">
          <Stack.Screen 
            name="AuthScreen" 
            component={AuthScreen} 
            options={{ headerShown: false }}
            listeners={{
              focus: () => {
                log.info("User entered Auth screen");
              }
            }}
          />
          <Stack.Screen 
            name="HomeTabs" 
            component={HomeTabs} 
            options={{ headerShown: false }}
            listeners={{
              focus: () => {
                log.debug("User entered main app");
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);