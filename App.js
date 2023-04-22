import {Provider as PaperProvider} from 'react-native-paper';
import {fiufitTheme} from "./src/consts/colors";
import MainStackNavigator from "./src/navigation/Navigation";

export default function App() {
  return (
      <PaperProvider theme={fiufitTheme}>
            <MainStackNavigator/>
      </PaperProvider>
  );
}
