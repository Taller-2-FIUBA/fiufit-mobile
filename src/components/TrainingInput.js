import {Text, TextInput, View} from "react-native";
import {greyColor, redColor, secondaryColor, tertiaryColor} from "../consts/colors";
import {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";

const TrainingInput = ({
                   label, error, onFocus = () => {
    }, ...props
               }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={{marginBottom: 20,}}>
            <Text style={{marginVertical: 5, marginHorizontal: 5, fontSize: 14, color: greyColor,}}>{label}</Text>
            <View style={[
                fiufitStyles.createTrainingInput,
                {borderColor: error ? redColor : isFocused ? tertiaryColor : secondaryColor,
                }]}>
                <TextInput
                    placeholderTextColor={greyColor}
                    style={{marginHorizontal: 10, color: tertiaryColor, flex: 1}}
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </View>
            {error &&
                <Text style={{color: redColor, marginLeft: 5, fontSize: 12, marginTop: 5}}>{error}</Text>
            }
        </View>
    )
}

export default TrainingInput;
