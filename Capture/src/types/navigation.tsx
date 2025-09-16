import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParamList = {
  AuthScreen: undefined;
  HomeTabs: undefined;

};

export type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>;
//Signin
export type SignInFormProps = {
  onSwitchToSignUp: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};
//SignUp
export type SignUpFormProps = {
  onSwitchToSignIn: () => void;
};
//AuthScreen
export type AuthScreenProps = {
  onSwitchToSignUp: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

