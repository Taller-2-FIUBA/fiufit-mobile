import {Text, TextInput, View} from "react-native";
import {greyColor, redColor, secondaryColor, tertiaryColor} from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";

const Input = ({
                   label, iconName, error, password, onFocus = () => {
    }, ...props
               }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(password);

    return (
        <View style={{marginBottom: 20,}}>
            <Text style={{marginVertical: 5, fontSize: 14, color: greyColor,}}>{label}</Text>
            <View style={[
                fiufitStyles.registerInput,
                {borderColor: error ? redColor : isFocused ? tertiaryColor : secondaryColor,
                }]}>
                <Icon name={iconName} style={fiufitStyles.iconStyle}/>
                <TextInput
                    secureTextEntry={hidePassword}
                    placeholderTextColor={greyColor}
                    style={{color: tertiaryColor, flex: 1}}
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {password &&
                    <Icon
                        onPress={() => setHidePassword(!hidePassword)}
                        name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                        style={{fontSize: 22, color: tertiaryColor}}/>
                }
            </View>
            {error &&
                <Text style={{color: redColor, marginLeft: 5, fontSize: 12, marginTop: 5}}>{error}</Text>
            }
        </View>
    )
}

export default Input;
