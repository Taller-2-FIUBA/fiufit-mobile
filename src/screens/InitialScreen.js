import {Image, SafeAreaView} from "react-native";
import {useTheme} from "react-native-paper";
import {fiufitStyles} from "../consts/fiufitStyles";
import {useEffect} from "react";
import {setNavigation} from "../services/config/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InitialScreen = ({ navigation }) => {
    const theme = useTheme();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('@fiufit_token');
            if (token) {
                return 'Trainings';
            } else {
                return 'Login';
            }
        };

        setNavigation(navigation);
        checkToken().then(screen => navigation.replace(screen));
    }, []);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image source={require('../../resources/logo.png')} style={fiufitStyles.logo}/>
        </SafeAreaView>
    );
}

export default InitialScreen;
