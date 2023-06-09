import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TrainingsScreen from "../screens/TrainingsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserDataScreen from "../screens/UserDataScreen";
import SearchUsersScreen from "../screens/SearchUsersScreen";
import SearchTrainingsScreen from "../screens/SearchTrainingsScreen";
import UserBiologicsScreen from "../screens/UserBiologicsScreen";
import {Avatar, BottomNavigation, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateTrainingScreen from '../screens/CreateTrainingScreen';
import {CommonActions, DrawerActions, useNavigation} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import FiufitDrawer from "../components/FiufitDrawer";
import ProfileScreen from "../screens/ProfileScreen";
import FollowedsScreen from "../screens/FollowedsScreen";
import FollowersScreen from "../screens/FollowersScreen";
import ProfilePublicScreen from "../screens/ProfilePublicScreen";
import GoalsScreen from "../screens/GoalsScreen";
import DashboardScreen from "../screens/DashboardScreen";
import {Alert, Image, TouchableOpacity} from "react-native";
import ChatScreen from "../screens/ChatScreen";
import InitialScreen from "../screens/InitialScreen";
import React, {useEffect, useState, useRef} from "react";
import { UserService } from "../services/userService";
import UserDataContext from "../contexts/userDataContext";
import PrivateChatScreen from "../screens/PrivateChatScreen";
import NotificationScreen from "../screens/NotificationScreen";
import {
    registerToken,
    removeNotificationSubscription,
    notificationListenerSubscriber,
    responseListenerSubscriber } from "../utils/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentsScreen from "../screens/PaymentsScreen";
import {showImage} from "../services/imageService";
import FastImage from 'react-native-fast-image';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const TopTab = createMaterialTopTabNavigator();
const FollowsTopTab = createMaterialTopTabNavigator();

const AuthStack = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [image, setImage] = useState("");
    const notificationListener = useRef();
    const responseListener = useRef();

    const initUserInfo = async () => {
        const username = await AsyncStorage.getItem('@fiufit_username');
        await registerToken();
        if (username) {
            UserService.getUserByUsername(username)
                .then((userData) => {
                    setName(userData.name);
                    setSurname(userData.surname);
                    setImage(userData.image);
                });
        }
    }

    useEffect(() => {
        initUserInfo();

        notificationListener.current = notificationListenerSubscriber();
        responseListener.current = responseListenerSubscriber(navigation);

        return () => {
            removeNotificationSubscription(notificationListener.current);
            removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Drawer.Navigator drawerContent={props => <FiufitDrawer {...props} />}>
            <Drawer.Screen name="MainScreen" component={BottomTabNavigator} options={{
                title: 'Fiufit',
                headerTitleAlign: 'center',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer)} style={{marginLeft: 10}}>
                        {image ? (
                            <FastImage 
                                source={{
                                    uri: showImage(image),
                                    priority: FastImage.priority.high,
                                }}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 50,
                                    marginTop: 20,
                                    marginBottom: 10
                                }}
                            />
                        ) : (
                            <Avatar.Text size={30} color={theme.colors.secondary}
                                         style={{
                                             backgroundColor: theme.colors.primary
                                         }}
                                         label={name?.charAt(0) + surname?.charAt(0)}
                            />
                        )}
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <Icon name="magnify"
                          size={30}
                          color={theme.colors.tertiary}
                          style={{marginRight: 15}}
                          onPress={() => navigation.navigate('Search')}/>
                ),
                drawerLabel: 'Trainings',
                headerTintColor: theme.colors.tertiary,
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                drawerIcon: ({color, size}) => {
                    return <Icon name="weight-lifter" size={size} color={color}/>;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,

            }}/>
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{
                title: 'Profile',
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                statusBarColor: theme.colors.background,
                headerTintColor: theme.colors.tertiary,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Icon name="arrow-left" size={24} color={theme.colors.tertiary} style={{marginLeft: 10}}/>
                    </TouchableOpacity>
                ),
                drawerIcon: ({color, size}) => {
                    return <Icon name="account" size={size} color={color}/>;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,
            }}/>
            <Drawer.Screen name="Chat" component={ChatScreen} options={{
                title: 'Chats',
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.tertiary,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Icon name="arrow-left" size={24} color={theme.colors.tertiary} style={{marginLeft: 10}}/>
                    </TouchableOpacity>
                ),
                drawerIcon: ({color, size}) => {
                    return <Icon name="forum" size={size} color={color}/>;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,
            }}/>
            <Drawer.Screen name="Wallet" component={PaymentsScreen} options={{
                title: 'Wallet',
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.tertiary,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Icon name="arrow-left" size={24} color={theme.colors.tertiary} style={{marginLeft: 10}}/>
                    </TouchableOpacity>
                ),
                drawerIcon: ({color, size}) => {
                    return <Icon name="wallet" size={size} color={color}/>;
                },
                drawerActiveTintColor: theme.colors.secondary,
                drawerInactiveTintColor: theme.colors.tertiary,
            }}/>
            <Drawer.Screen name="Notification" component={NotificationScreen} options={{
                title: 'Notifications',
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.tertiary,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <Icon name="arrow-left" size={24} color={theme.colors.tertiary} style={{marginLeft: 10}}/>
                    </TouchableOpacity>
                ),
                drawerIcon: ({color, size}) => {
                    return <Icon name="bell-ring" size={size} color={color}/>;
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
            tabBar={({navigation, state, descriptors, insets}) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    activeColor={theme.colors.secondary}
                    inactiveColor={theme.colors.tertiary}
                    style={{
                        backgroundColor: theme.colors.background,
                    }}
                    onTabPress={({route, preventDefault}) => {
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
                    renderIcon={({route, focused, color}) => {
                        const {options} = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({focused, color, size: 24});
                        }

                        return null;
                    }}
                    getLabelText={({route}) => {
                        const {options} = descriptors[route.key];
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
                    tabBarIcon: ({color, size}) => {
                        return <Icon name="weight-lifter" size={size} color={color}/>;
                    },
                }}
            />
            <BottomTab.Screen
                name="Goals"
                component={GoalsScreen}
                options={{
                    tabBarLabel: 'Goals',
                    tabBarIcon: ({color, size}) => {
                        return <Icon name="flag-checkered" size={size} color={color}/>;
                    },
                }}
            />
            <BottomTab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Progress',
                    tabBarIcon: ({color, size}) => {
                        return <Icon name="trophy" size={size} color={color}/>;
                    },
                }}
            />
        </BottomTab.Navigator>
    );
};

const RegistrationStackNavigator = (props) => {
    const theme = useTheme();
    const [userData, setUserData] = useState({
        email: props.route.params?.email,
        password: '',
        name: '',
        surname: '',
        username: '',
        location: '',
        is_athlete: true,
        height: '',
        weight: '',
        birth_date: '',
        registration_date: new Date().toISOString().split('T')[0],
        google_token: props.route.params?.token
    });

    return (
        <UserDataContext.Provider value={{userData: userData, setUserData: setUserData}}>
            <Stack.Navigator initialRouteName={(userData.email && userData.google_token) ? "UserData" : "SignUp"}>
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
            </Stack.Navigator>
        </UserDataContext.Provider>
    );
}


const TabsNavigation = () => {
    const theme = useTheme();
    return (
    <TopTab.Navigator
        screenOptions={{
            tabBarActiveTintColor: theme.colors.secondary,
            tabBarIndicatorStyle: {
                backgroundColor: theme.colors.secondary,
                height: 2
            },
            tabBarStyle: {
                backgroundColor: theme.colors.primary,
            },
        }}>
        <TopTab.Screen name="Users" component={SearchUsersScreen}/>
        <TopTab.Screen name="Trainings" component={SearchTrainingsScreen} />
    </TopTab.Navigator>
    );
};

const FollowTabsNavigation = ({ route }) => {
    const theme = useTheme();
    const { user } = route.params;
    return (
      <FollowsTopTab.Navigator
        screenOptions={{
            tabBarActiveTintColor: theme.colors.secondary,
            tabBarIndicatorStyle: {
                backgroundColor: theme.colors.secondary,
                height: 2
            },
            tabBarStyle: {
                backgroundColor: theme.colors.primary,
            },
        }}>
        <FollowsTopTab.Screen name="Following" component={FollowedsScreen} initialParams={{ user }}/>
        <FollowsTopTab.Screen name="Followers" component={FollowersScreen} initialParams={{ user }}/>
      </FollowsTopTab.Navigator>
    );
  };

const MainStackNavigator = () => {
    const theme = useTheme();

    return (
        <Stack.Navigator initialRouteName={"Initial"}>
            <Stack.Screen name="Initial" component={InitialScreen}
                options={{
                    headerShown: false,
                    statusBarColor: theme.colors.primary
                }}/>
            <Stack.Screen name="Login" component={LoginScreen}
                options={{
                    headerShown: false,
                    statusBarColor: theme.colors.primary
                }}/>
            <Stack.Screen name="Registration" component={RegistrationStackNavigator}
                options={{
                    headerShown: false,
                    statusBarColor: theme.colors.primary
                }}/>
            <Stack.Screen name="Search" component={TabsNavigation}
                options={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.tertiary,
                    statusBarColor: theme.colors.background,
                }}/>
            <Stack.Screen name="FollowTabs" component={FollowTabsNavigation}
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
            <Stack.Screen name="CreateTraining" component={CreateTrainingScreen}
                options={{
                    headerShown: false,
                    statusBarColor: theme.colors.background,
                }}/>
            <Stack.Screen name="ProfilePublic" component={ProfilePublicScreen}
                options={{
                    title: 'Profile',
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.tertiary,
                    statusBarColor: theme.colors.background,
                }}/>
            <Stack.Screen name="PrivateChat" component={PrivateChatScreen}
                options={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.tertiary,
                    statusBarColor: theme.colors.background,
                }}/>
        </Stack.Navigator>
    );
}

export default MainStackNavigator;
