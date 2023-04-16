import {StyleSheet} from "react-native";
import {primaryColor, secondaryColor, tertiaryColor, whiteColor} from "./colors";

export const fiufitStyles = StyleSheet.create({
    logo: {
        height: 150,
        width: 150,
        paddingVertical: 100,
        marginBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: whiteColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        color: primaryColor,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: tertiaryColor,
        borderWidth: 2,
    },
    buttonText: {
        color: whiteColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: tertiaryColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonDate: {
        backgroundColor: whiteColor,
        width: '49%',
        padding: 15,
        marginTop: 5,
        borderRadius: 10,
    },
    inputHorizontal: {
        backgroundColor: whiteColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        color: primaryColor,
        flex: 1,
    },
    heightInputConfirmButton: {
        backgroundColor: primaryColor,
        borderColor: tertiaryColor,
        borderWidth: 2,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5
    }
})
