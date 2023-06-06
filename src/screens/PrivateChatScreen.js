import {Text, TextInput, View, ScrollView, TouchableOpacity} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";


const PrivateChatScreen = ({route}) => {
  const {user} = route.params;
  const [actualMessage, setActualMessage] = React.useState(null);
  const [actualUserId, setActualUserId] = React.useState(null);

  const [messages, setMessages] = React.useState([
    {message: "Hola soy Okteto", direction: "left"},
    {message: "Hola como estas, Okteto?", direction: "right"},
    {message: "Adios me cai", direction: "left"},
  ]);

  const handleMessageChange = (text) => {
    setActualMessage(text);
  };

  const handleSend = () => {
    //TODO enviar mensaje a firebase
    setMessages([...messages, {message: actualMessage, direction: "right"}]);
    setActualMessage(null);
  }

  const MessageItem = ({message, direction}) => {
    const messageStyle = direction == "right"
      ? fiufitStyles.messageChatItemRight 
      : fiufitStyles.messageChatItemLeft;

    return (
      <View style={messageStyle}>
        <Text style={fiufitStyles.buttonText}>
          {message}
        </Text>
      </View>
    );
  }

  const getActualUser = async () => {
    setActualUserId(await AsyncStorage.getItem('@fiufit_userId'));
  }

  useEffect(() => {
    //TODO buscar mensajes del usuario en firebase
    console.log("Iniciar chat con: " + user.name + " " + user.surname);
    getActualUser().then(() => console.log("Actual user: " + actualUserId));
  }, [actualUserId]);

  return (
    <ScrollView contentContainerStyle={fiufitStyles.messageChatContainer}>
      {messages && messages.map((message) => (
        <MessageItem message={message.message} direction={message.direction} />
      ))}
      <View style={fiufitStyles.messageChatInputContainer}>
        <TextInput style={fiufitStyles.messageChatInput}
          placeholder="Message"
          value={actualMessage}
          onChangeText={text => handleMessageChange(text)}
        />
        <TouchableOpacity onPress={handleSend} style={fiufitStyles.messageChatButton}>
          <Text style={fiufitStyles.buttonText}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
      
    </ScrollView>
  );
};

export default PrivateChatScreen