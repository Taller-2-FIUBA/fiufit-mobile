import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TrainingsScreen from "../screens/TrainingsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserDataScreen from "../screens/UserDataScreen";
import ChatScreen from "../screens/ChatScreen";
import SearchScreen from "../screens/SearchScreen";
import UserBiologicsScreen from "../screens/UserBiologicsScreen";
import {BottomNavigation, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommonActions} from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

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
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="magnify" size={size} color={color} />;
                    },
                }}
            />
            <BottomTab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="forum" size={size} color={color} />;
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
            <Stack.Screen name="Trainings" component={BottomTabNavigator}
                          options={{
                              headerShown: false,
                              statusBarColor: theme.colors.background,
                          }}/>
        </Stack.Navigator>
    );
}

export default MainStackNavigator;
