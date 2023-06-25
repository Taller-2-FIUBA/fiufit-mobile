import {FAB, Text, useTheme} from "react-native-paper";
import {View} from "react-native";

const PaymentsFAB = ({label, iconName, onPress}) => {
    const theme = useTheme();
    return (
        <View>
            <FAB size={'medium'}
                 style={{
                     elevation: 4,
                     backgroundColor: theme.colors.primary,
                 }}
                 color={theme.colors.secondary}
                 icon={iconName}
                 onPress={onPress}
            />
            <Text style={{
                color: theme.colors.tertiary,
                textAlign: 'center',
                marginTop: 6,
            }}>
                {label}
            </Text>
        </View>
    );
}

export default PaymentsFAB;
