import {StyleSheet} from "react-native";
import {greyColor, primaryColor, redColor, secondaryColor, tertiaryColor, whiteColor} from "./colors";

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
    buttonHeight: {
        backgroundColor: secondaryColor,
        width: '49%',
        padding: 15,
        marginTop: 15,
        borderRadius: 10,
    },
    buttonDate: {
        backgroundColor: secondaryColor,
        padding: 15,
        marginTop: 15,
        borderRadius: 10,
        marginBottom: 15,
        height: 51,
    },
    buttonDateError: {
        backgroundColor: secondaryColor,
        borderColor: redColor,
        borderWidth: 0.5,
        padding: 15,
        marginTop: 15,
        borderRadius: 10,
        marginBottom: 15
    },
    inputWeight: {
        backgroundColor: secondaryColor,
        paddingHorizontal: 15,
        paddingVertical: 11,
        borderRadius: 10,
        marginTop: 15,
        color: tertiaryColor,
        marginLeft: 5,
    },
    heightInputConfirmButton: {
        backgroundColor: primaryColor,
        borderColor: tertiaryColor,
        borderWidth: 2,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5
    },
    registerInput: {
        height: 55,
        backgroundColor: secondaryColor,
        flexDirection: 'row',
        borderWidth: 0.5,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    iconStyle: {
        fontSize: 22,
        color: tertiaryColor,
        marginRight: 10,
    },
    registerButton: {
        backgroundColor: primaryColor,
        marginVertical: 10,
        borderColor: tertiaryColor,
        borderWidth: 2,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    haveAccount: {
        color: greyColor,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsText: {
        color: greyColor,
        fontSize: 18,
        marginVertical: 10,
    },
    titleText: {
        color: tertiaryColor,
        fontSize: 40,
        fontWeight: 'bold',
    },
    pickerSelect: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center",
    },
    createTrainingInput: {
        height: 50,
        backgroundColor: secondaryColor,
        color: tertiaryColor,
        borderWidth: 1,
        borderRadius: 10,
    },
    trainingItemContainer: {
        height: 50,
        backgroundColor: primaryColor,
        borderColor: tertiaryColor,
        flexDirection: 'row',
        borderWidth: 0.5,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 5
    },
    addTrainingButton: {
        position: 'absolute',
        marginBottom: 16,
        right: 0,
        bottom: 0,
        borderRadius: 30,
        backgroundColor: secondaryColor,
        color: tertiaryColor,
        alignSelf: 'flex-end',
    },
    editButton: {
        position: 'absolute',
        bottom: 2,
        right: 2,
    },
    trainingInput: {
        fontSize: 14,
        borderColor: primaryColor,
        borderWidth: 0.8,
        color: tertiaryColor,
        paddingHorizontal: 5
    },
    trainingNotEditableInpunt: {
        fontSize: 14,
        borderColor: primaryColor,
        borderWidth: 0.8,
        color: secondaryColor,
        paddingHorizontal: 10
    },
    trainingButtonContainer: {
        flexDirection: 'row',
        width: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 5,
        marginLeft: 30
    },
    trainingActionButton: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center'
    },
    trainingActionButtonText: {
        color: tertiaryColor,
        fontWeight: '700',
        fontSize: 16,
    },
    trainingPickerSelect: {
        marginTop: 2,
        marginBottom: 5,
        alignItems: "center",
        width: 150,
        backgroundColor: secondaryColor,
        color: tertiaryColor,
        borderRadius: 10
    },
    trainingsList: { 
        height: 50, 
        width: 350, 
        marginBottom: 3, 
        backgroundColor: tertiaryColor,
        borderRadius: 10
    },
    exerciseInput: {
        height: 50,
        backgroundColor: secondaryColor,
        color: tertiaryColor,
        borderWidth: 1,
        borderRadius: 10,
        width: '80%',
        marginRight: 50,
    },
    exerciseDetails: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    userContainer: {
        backgroundColor: '#eaeaea',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
      },
      userName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    imagePickerButton: {
        backgroundColor: primaryColor,
        borderWidth: 1,
        borderColor: tertiaryColor,
        width: 100,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 12,
        borderRadius: 50,
        marginRight: 15,
    }
})
