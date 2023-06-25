import {TextInput, useTheme} from "react-native-paper";
import {Text} from "react-native";
import React from "react";

const PaymentInput = ({label, textInputRef, ...props}) => {
    const theme = useTheme();

    return (
        <TextInput
                   label={
                       <Text style={{
                           color: theme.colors.secondary,
                       }}>
                           {label}
                       </Text>
                   }
                   selectionColor={theme.colors.tertiary}
                   style={{
                       backgroundColor: theme.colors.primary,
                   }}
                   textColor={theme.colors.tertiary}
                   placeholderTextColor={theme.colors.tertiary}
                   ref={textInputRef}
                   {...props}
        />
    );
}

export default PaymentInput;
