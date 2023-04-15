import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import {secondaryColor, tertiaryColor} from "../consts/colors";
import {Octicons} from "@expo/vector-icons";
import UserDataScreen from "../screens/UserDataScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveBackgroundColor: secondaryColor,
                tabBarInactiveBackgroundColor: secondaryColor,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarIcon: ({ focused}) => {
                    let iconName;

                    switch (route.name) {
                        case 'HomeTab':
                            iconName = 'home';
                            break;
                        case 'Search':
                            iconName = 'search';
                            break;
                        case 'ProfileTab':
                            iconName = 'person';
                            break;
                        default:
                            iconName = 'home';
                            break;
                    }

                    const iconColor = focused ? tertiaryColor : 'white';

                    return <Octicons name={iconName} size={24} color={iconColor} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen}
                        options={{
                            headerShown: false,
                        }}/>
            <Tab.Screen name="Search" component={HomeScreen}
                        options={{
                            headerShown: false,
                        }}/>
            <Tab.Screen name="ProfileTab" component={ProfileScreen}
                        options={{
                            headerShown: false,
                        }}/>
        </Tab.Navigator>
    );
};

const MainStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen}
                          options={{
                              headerShown: false,
                              statusBarColor: secondaryColor
                          }}/>
            <Stack.Screen name={"SignUp"} component={SignUpScreen}
                          options={{
                              headerShown: false,
                              statusBarColor: secondaryColor
                          }}/>
            <Stack.Screen name={"UserData"} component={UserDataScreen}
                          options={{
                              headerShown: false,
                              statusBarColor: secondaryColor
                          }}/>
            <Stack.Screen name="Home" component={MainTabNavigator}
                          options={{
                              headerShown: false,
                              statusBarColor: secondaryColor,
                              headerTintColor: 'white',
                              headerStyle: {
                                  backgroundColor: secondaryColor
                              }
                          }}/>
        </Stack.Navigator>
    );
}

export default MainStackNavigator;
