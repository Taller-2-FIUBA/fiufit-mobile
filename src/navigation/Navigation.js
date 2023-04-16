import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TrainingsScreen from "../screens/TrainingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import {secondaryColor, tertiaryColor, whiteColor} from "../consts/colors";
import {Octicons} from "@expo/vector-icons";
import UserDataScreen from "../screens/UserDataScreen";
import {TabBarButton} from "./Animations";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GoalsScreen from "../screens/GoalsScreen";
import ChatScreen from "../screens/ChatScreen";
import SearchScreen from "../screens/SearchScreen";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: tertiaryColor,
                tabBarInactiveTintColor: whiteColor,
                tabBarIndicatorStyle: { backgroundColor: tertiaryColor },
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                },
                tabBarStyle: { backgroundColor: secondaryColor },
            }}
        >
            <TopTab.Screen name="Trainings" component={TrainingsScreen}/>
            <TopTab.Screen name="Goals" component={GoalsScreen}/>
        </TopTab.Navigator>
    );
}

const BottomTabNavigator = () => {
    return (
        <BottomTab.Navigator
            screenOptions={({route}) => ({
                tabBarActiveBackgroundColor: secondaryColor,
                tabBarInactiveBackgroundColor: secondaryColor,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarButton: (props) => <TabBarButton {...props} />,
                tabBarIcon: ({focused}) => {
                    let iconName;

                    switch (route.name) {
                        case 'TrainingsTab':
                            iconName = 'home';
                            break;
                        case 'SearchTab':
                            iconName = 'search';
                            break;
                        case 'ProfileTab':
                            iconName = 'person';
                            break;
                        case 'ChatTab':
                            iconName = 'mail';
                            break;
                        default:
                            iconName = 'home';
                            break;
                    }

                    const iconColor = focused ? tertiaryColor : 'white';

                    return <Octicons name={iconName} size={24} color={iconColor}/>;
                },
            })}
        >
            <BottomTab.Screen name="TrainingsTab" component={TopTabNavigator}
                              options={{
                                  headerShown: false,
                              }}/>
            <BottomTab.Screen name="SearchTab" component={SearchScreen}
                              options={{
                                  headerShown: false,
                              }}/>
            <BottomTab.Screen name="ChatTab" component={ChatScreen}
                              options={{
                                  headerShown: false,
                              }}/>
            <BottomTab.Screen name="ProfileTab" component={ProfileScreen}
                              options={{
                                  headerShown: false,
                              }}/>
        </BottomTab.Navigator>
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
            <Stack.Screen name="Trainings" component={BottomTabNavigator}
                          options={{
                              headerShown: false,
                              statusBarColor: secondaryColor,
                              headerTintColor: whiteColor,
                              headerStyle: {
                                  backgroundColor: secondaryColor
                              }
                          }}/>
        </Stack.Navigator>
    );
}

export default MainStackNavigator;
