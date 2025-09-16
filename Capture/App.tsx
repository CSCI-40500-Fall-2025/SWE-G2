/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Text, Button} from 'react-native';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homepage from './src/screens/homepage'; 

// import Signup from './src/screens/signup';
// import Signin from './src/screens/signin';
import Friends from './src/screens/friends';
import profile from './src/screens/profile';
import AuthScreen from './src/screens/AuthScreen';


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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Homepage" component={Homepage} />
      <Tab.Screen name="profile" component={profile} />
      <Tab.Screen name="friends" component={Friends} />
      <Tab.Screen name="TEST SIGNUP" component={AuthScreen} />
      {/** This will be removed later */}
    </Tab.Navigator>
  );
};  

const App: React.FC = (): React.JSX.Element => {
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
export default App;
