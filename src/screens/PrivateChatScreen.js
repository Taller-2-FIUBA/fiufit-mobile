import {Text, TextInput, View, ScrollView, TouchableOpacity} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, collection, addDoc, updateDoc, onSnapshot, setDoc, getDoc} from "firebase/firestore";
import { db } from "../utils/firebase"

const PrivateChatScreen = ({route}) => {
  const {chatInfo} = route.params;
  const [actualMessage, setActualMessage] = React.useState(null);
  const [actualUserId, setActualUserId] = React.useState(null);

  const [messages, setMessages] = React.useState([]);

  const handleMessageChange = (text) => {
    setActualMessage(text);
  };

  const handleSend = async () => {
    await updateDoc(doc(db, "conversations", chatInfo.conversationId), {
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

  const createChat = async (userId, conversationId, otherUserId ) => {
    try {
      const userDocRef = doc(db, "usersChats", userId);
      const userChat = await getDoc(userDocRef);
      if (userChat.exists()) {
        await updateDoc(userDocRef, {
          chats: [...userChat.data().chats, {userId: otherUserId, conversationId: conversationId}]
        });
      } else { 
        await setDoc(userDocRef, {
          chats: [{userId: otherUserId, conversationId: conversationId}]
        });
      }
    } catch (e) {
      console.error("Error creating or updating chat: ", e);
    }
  }

  const getConversationMessages = async () => {
    console.log("Buscar mensajes de la conversacion");
    const userId =  await AsyncStorage.getItem('@fiufit_userId');
    if (!chatInfo.conversationId) {
      console.log("No hay conversacion");
      const docRef = await addDoc(collection(db, "conversations"), {
        messages: []
      });
      chatInfo.conversationId = docRef.id;
      await createChat(userId, chatInfo.conversationId, chatInfo.user.id.toString());
      await createChat(chatInfo.user.id.toString(), chatInfo.conversationId, userId);
    }
    onSnapshot(doc(db, "conversations", chatInfo.conversationId), (doc) => {
      setMessages(doc.data().messages);
    });
    setActualUserId(userId);
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