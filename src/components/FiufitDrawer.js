import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {Image, Text, View} from "react-native";
import {useTheme} from "react-native-paper";
import Button from "./Button";
import {useNavigation} from "@react-navigation/native";

const FiufitDrawer = (props) => {
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
        }}>
            <View style={{
                backgroundColor: theme.colors.background,
                marginLeft: 20,
                marginRight: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.primary,
            }}>
                <Image source={require('../../resources/profile.jpg')} style={{
                    height: 50,
                    width: 50,
                    marginBottom: 15,
                    marginTop: 20,
                    borderRadius: 40,
                }}/>
                <Text
                    style={{
                        marginBottom: 20,
                        color: theme.colors.tertiary,
                        fontSize: 15,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                }}>
                    John Doe
                </Text>
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={{
                backgroundColor: theme.colors.background,
                flex: 1
            }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={{
                borderTopWidth: 1,
                borderTopColor: theme.colors.primary,
                marginLeft: 20,
                marginRight: 20,
            }}>
                <Button title="Logout" onPress={() => navigation.navigate('Login')}/>
            </View>
        </View>
    );
}

export default FiufitDrawer;
