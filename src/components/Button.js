import {Text, TouchableOpacity} from "react-native";
import React from "react";
import {tertiaryColor} from "../consts/colors";
import {fiufitStyles} from "../consts/fiufitStyles";

const Button = ({title, onPress = () => {}}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={fiufitStyles.registerButton}>
            <Text style={{
                color: tertiaryColor,
                fontWeight: '700',
                fontSize: 16,
            }}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button;
