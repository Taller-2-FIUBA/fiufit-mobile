import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from "./src/navigation/Navigation";
import {Provider as PaperProvider} from 'react-native-paper';
import {fiufitTheme} from "./src/consts/colors";

export default function App() {
    return (
        <PaperProvider theme={fiufitTheme}>
            <NavigationContainer>
                <MainStackNavigator/>
            </NavigationContainer>
        </PaperProvider>
    );
}
