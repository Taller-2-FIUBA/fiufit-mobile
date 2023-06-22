import {View, Text, TouchableWithoutFeedback} from "react-native";
import PaymentInput from "../components/PaymentInput";
import React, {useRef} from "react";
import {Button, HelperText, useTheme} from "react-native-paper";
import {validateAmount, validateWallet} from "../utils/validations";
import {fiufitStyles} from "../consts/fiufitStyles";

const WithdrawScreen = ({wallet, amount, setWallet, setAmount, onConfirm, onCancel, ...props}) => {
    const theme = useTheme();
    const textInputRef = useRef(null);

    const blurInputs = () => {
        textInputRef.current?.blur();
    }

    return (
        <TouchableWithoutFeedback onPress={blurInputs}>
            <View>
                <Text
                    style={{
                        color: theme.colors.secondary,
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 20,
                    }}>
                    Withdraw
                </Text>
                <PaymentInput
                    label={'Address'}
                    value={wallet}
                    onChangeText={text => {
                        setWallet(text)
                    }}
                    textInputRef={textInputRef}
                    {...props}
                />
                <HelperText type={'error'} visible={!validateWallet(wallet, true)}>
                    Invalid wallet
                </HelperText>
                <PaymentInput
                    label={'Amount'}
                    keyboardType={'numeric'}
                    value={amount}
                    onChangeText={text => {
                        setAmount(text)
                    }}
                    textInputRef={textInputRef}
                    {...props}
                />
                <HelperText type={'error'} visible={!validateAmount(amount, true)}>
                    Invalid amount
                </HelperText>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                }}>
                    <Button style={{...fiufitStyles.buttonOutline}}
                            mode={'contained'}
                            onPress={onConfirm}>
                        <Text style={fiufitStyles.buttonOutlineText}>
                            Confirm
                        </Text>
                    </Button>
                    <Button style={{...fiufitStyles.buttonOutline}}
                            mode={'contained'}
                            onPress={onCancel}>
                        <Text style={fiufitStyles.buttonOutlineText}>
                            Cancel
                        </Text>
                    </Button>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default WithdrawScreen;
