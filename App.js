import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import {primaryColor, secondaryColor} from "./src/consts/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen options={{
                headerShown: false,
                statusBarColor: secondaryColor
            }} name="Login" component={LoginScreen} />
            <Stack.Screen options={{
                headerShown: false,
                statusBarColor: secondaryColor
            }} name="SignUp" component={SignUpScreen} />
            <Stack.Screen options={{
                statusBarColor: secondaryColor,
                headerStyle: {
                    backgroundColor: secondaryColor
                }
            }} name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
