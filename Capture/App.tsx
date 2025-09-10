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

// import { onboarding } from './src/screens/onboarding';
import Friends from './src/screens/friends';
import profile from './src/screens/profile';
// import { homepage } from './src/screens/homepage';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

//place holder
type RootStackParamList = {
  Onboarding: undefined;
  HomeTabs: undefined;
};

type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const Onboarding = ({ navigation }: OnboardingProps) => (
  <SafeAreaView>
    <Text>Welcome to Onboarding</Text>
    <Button title="test" onPress={() => navigation.replace('HomeTabs')} />
  </SafeAreaView>
);



// const Friends = () => (
//   <SafeAreaView>
//     <Text>Friends</Text>
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
      <Tab.Screen name="Profile" component={profile} />
      <Tab.Screen name="friends" component={Friends} />
    </Tab.Navigator>
  );
};

const App: React.FC = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding">

          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default App;
