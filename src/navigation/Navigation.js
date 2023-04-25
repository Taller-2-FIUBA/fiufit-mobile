import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TrainingsScreen from "../screens/TrainingsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserDataScreen from "../screens/UserDataScreen";
import SearchScreen from "../screens/SearchScreen";
import UserBiologicsScreen from "../screens/UserBiologicsScreen";
import {BottomNavigation, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommonActions, DrawerActions, useNavigation} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import FiufitDrawer from "../components/FiufitDrawer";
import ProfileScreen from "../screens/ProfileScreen";
import GoalsScreen from "../screens/GoalsScreen";
import {Image, TouchableOpacity} from "react-native";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <Drawer.Navigator drawerContent={props => <FiufitDrawer {...props} />}>
            <Drawer.Screen name="MainScreen" component={BottomTabNavigator} options={{
                title: 'Fiufit',
                headerTitleAlign: 'center',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer)}>
                        <Image source={require('../../resources/profile.jpg')} style={{
                            height: 30,
                            width: 30,
                            marginLeft: 15,
                            borderRadius: 40,
                        }}/>
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <Icon name="magnify"
                            size={30}
                            color={theme.colors.tertiary}
                            style={{marginRight: 15}}
                            onPress={() => navigation.navigate('Search')} />
                ),
                drawerLabel: 'Trainings',
                headerTintColor: theme.colors.tertiary,
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                drawerIcon: ({ focused, color, size }) => {
                    return <Icon name="weight-lifter" size={size} color={color} />;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,

            }}/>
            <Drawer.Screen name="Chat" component={ChatScreen} options={{
                title: 'Chat',
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.tertiary,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Icon name="arrow-left" size={24} color={theme.colors.tertiary} style={{marginLeft: 10}} />
                    </TouchableOpacity>
                ),
                drawerIcon: ({ focused, color, size }) => {
                    return <Icon name="forum" size={size} color={color} />;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,
            }}/>
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{
                title: 'Profile',
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.tertiary,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Icon name="arrow-left" size={24} color={theme.colors.tertiary} style={{marginLeft: 10}} />
                    </TouchableOpacity>
                ),
                drawerIcon: ({ focused, color, size }) => {
                    return <Icon name="account" size={size} color={color} />;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,
            }}/>
        </Drawer.Navigator>
    );
}

const BottomTabNavigator = () => {
    const theme = useTheme();

    return (
        <BottomTab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    activeColor={theme.colors.secondary}
                    inactiveColor={theme.colors.tertiary}
                    style={{
                        backgroundColor: theme.colors.background,
                    }}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ focused, color, size: 24 });
                        }

                        return null;
                    }}
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        return options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.title;
                    }}
                />
            )}
        >
            <BottomTab.Screen
                name="Home"
                component={TrainingsScreen}
                options={{
                    tabBarLabel: 'Trainings',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="weight-lifter" size={size} color={color} />;
                    },
                }}
            />
            <BottomTab.Screen
                name="Goals"
                component={GoalsScreen}
                options={{
                    tabBarLabel: 'Goals',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="flag-checkered" size={size} color={color} />;
                    },
                }}
            />
        </BottomTab.Navigator>
    );
};

const MainStackNavigator = () => {
    const theme = useTheme();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen}
                          options={{
                              headerShown: false,
                              statusBarColor: theme.colors.primary
                          }}/>
            <Stack.Screen name={"SignUp"} component={SignUpScreen}
                          options={{
                              headerShown: false,
                              statusBarColor: theme.colors.primary
                          }}/>
            <Stack.Screen name={"UserData"} component={UserDataScreen}
                          options={{
                              headerStyle: {
                                    backgroundColor: theme.colors.primary
                              },
                              headerTitle: "Personal data",
                              headerTintColor: theme.colors.secondary,
                              statusBarColor: theme.colors.primary
                          }}/>
            <Stack.Screen name={"UserBiologics"} component={UserBiologicsScreen}
                          options={{
                              headerStyle: {
                                  backgroundColor: theme.colors.primary,
                              },
                              headerTitle: "Physiological data",
                              headerTintColor: theme.colors.secondary,
                              statusBarColor: theme.colors.primary
                          }}/>
            <Stack.Screen name="Search" component={SearchScreen}
                          options={{
                                headerStyle: {
                                    backgroundColor: theme.colors.background,
                                },
                              headerTintColor: theme.colors.tertiary,
                              statusBarColor: theme.colors.background,
                          }}/>
            <Stack.Screen name="Trainings" component={AuthStack}
                          options={{
                              headerShown: false,
                              statusBarColor: theme.colors.background,
                          }}/>
        </Stack.Navigator>
    );
}

export default MainStackNavigator;
