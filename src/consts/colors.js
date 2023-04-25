import {DefaultTheme} from "react-native-paper";

export const primaryColor = '#012030'
export const secondaryColor = '#13678A'
export const tertiaryColor = '#45C4B0'
export const whiteColor  = '#FFFFFF'
export const greyColor = '#ADA7A7'
export const redColor = '#FF0000'

export const fiufitTheme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#13678A',
        secondary: '#45C4B0',
        secondaryContainer: '#13678A',
        tertiary: '#ADA7A7',
        background: '#012030',
    }
}
