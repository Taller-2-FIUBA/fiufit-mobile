import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image source={require('../../resources/profile.jpg')} style={{
                        height: 50,
                        width: 50,
                        marginBottom: 15,
                        marginTop: 20,
                        borderRadius: 40,
                    }}/>
                </TouchableOpacity>
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
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{
                    marginTop: 10,
                    marginBottom: 10,
                    alignContent: 'flex-end',
                    justifyContent: 'flex-start',
                    width: '40%',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 10, color: theme.colors.secondary }}>Logout</Text>
                        <Icon name="logout" size={30} color={theme.colors.secondary} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FiufitDrawer;
