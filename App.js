import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from "./src/navigation/Navigation";

export default function App() {
  return (
      <NavigationContainer>
            <MainStackNavigator/>
      </NavigationContainer>
  );
}
