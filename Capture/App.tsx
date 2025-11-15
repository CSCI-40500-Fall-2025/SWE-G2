/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Text, Button} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homepage from './src/screens/homepage'; 

// import Signup from './src/screens/signup';
// import Signin from './src/screens/signin';
import Friends from './src/screens/Friends';
import Profile from './src/screens/Profile';
import AuthScreen from './src/screens/AuthScreen';
import CameraScreen from './src/screens/CameraScreen';
import * as Sentry from '@sentry/react-native';
import log from './src/utils/logger'; // Add this import

Sentry.init({
  dsn: 'https://8ba65d59fcc2de5335f55531021b0a77@o4510370827534350.ingest.us.sentry.io/4510370828713984',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

//place holder
type RootStackParamList = {
  AuthScreen: undefined;
  HomeTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// const Onboarding = ({ navigation }: OnboardingProps) => (
//   <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:50, backgroundColor:'white',}}>
//     <Signup />
//     <Button title="Sign in" onPress={() => navigation.replace('HomeTabs')} />
//   </SafeAreaView>
// );


//place holder

const HomeTabs: React.FC = () => {
  // Test logging in HomeTabs component
  useEffect(() => {
    log.debug('DEBUG: HomeTabs navigation initialized');
    log.info('INFO: HomeTabs component mounted');
    log.warn('WARN: HomeTabs - default route set');
    log.error('ERROR: HomeTabs - navigation state issue');
    log.fatal('FATAL: HomeTabs - critical navigation failure');
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Homepage" component={Homepage} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="TEST SIGNUP" component={AuthScreen} />

      {/** This will be removed later */}
    </Tab.Navigator>
  );
};  

const App: React.FC = (): React.JSX.Element => {
  // Test all 5 log levels when app starts
  useEffect(() => {
    log.debug('DEBUG: App component mounted - detailed initialization');
    log.info('INFO: App started successfully');
    log.warn('WARN: App - checking for potential issues');
    log.error('ERROR: App - configuration validation failed');
    log.fatal('FATAL: App - critical startup failure');
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthScreen">

          <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default Sentry.wrap(App);