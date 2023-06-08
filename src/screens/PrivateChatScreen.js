import {Text, TextInput, View, ScrollView, TouchableOpacity} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, addDoc, updateDoc, onSnapshot} from "firebase/firestore";
import { db } from "../utils/firebase"

const PrivateChatScreen = ({route}) => {
  const {chatInfo} = route.params;
  const [actualMessage, setActualMessage] = React.useState(null);
  const [actualUserId, setActualUserId] = React.useState(null);

  const [messages, setMessages] = React.useState([]);

  const handleMessageChange = (text) => {
    setActualMessage(text);
  };

  const handleSend = () => {
    updateDoc(doc(db, "conversations", chatInfo.conversationId), {
      messages: [...messages, {message: actualMessage, userId: actualUserId}]
    });
    setActualMessage(null);
  }

  const MessageItem = ({message}) => {
    const messageStyle = message.userId == actualUserId
      ? fiufitStyles.messageChatItemRight
      : fiufitStyles.messageChatItemLeft;

    return (
      <View style={messageStyle}>
        <Text style={fiufitStyles.buttonText}>
          {message.message}
        </Text>
      </View>
    );
  }

  const getActualUser = async () => {
    const userId =  await AsyncStorage.getItem('@fiufit_userId');
    setActualUserId(userId);
  }

  const getConversationMessages = async () => {
    //TODO buscar mensajes del usuario en firebase
    console.log("Buscar mensajes de la conversacion");
    await getActualUser();
    if (!chatInfo.conversationId) {
      console.log("No hay conversacion");
      chatInfo.conversationId = "1";
    }
    onSnapshot(doc(db, "conversations", chatInfo.conversationId), (doc) => {
      setMessages(doc.data().messages);
    });
  }

  useEffect(() => {
    getConversationMessages();
  }, []);

  return (
    <ScrollView contentContainerStyle={fiufitStyles.messageChatContainer}>
      {messages && messages.map((message, index) => (
        <MessageItem key={index} message={message} />
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