import {Text, TextInput, View, ScrollView, TouchableOpacity} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, collection, addDoc, updateDoc, onSnapshot, setDoc, getDoc} from "firebase/firestore";
import { db } from "../utils/firebase";
import { sendNotification } from "../utils/notification";

const PrivateChatScreen = ({route}) => {
  const {chatInfo} = route.params;
  const [actualMessage, setActualMessage] = React.useState(null);
  const [actualUserId, setActualUserId] = React.useState(null);
  const [actualUserName, setActualUserName] = React.useState(null);

  const [messages, setMessages] = React.useState([]);

  const handleMessageChange = (text) => {
    setActualMessage(text);
  };

  const handleSend = async () => {
    try {
      await updateDoc(doc(db, "conversations", chatInfo.conversationId), {
        messages: [...messages, {message: actualMessage, userId: actualUserId}]
      });
      await sendNotification(chatInfo.otherUserId, {
          title: actualUserName, message: actualMessage, 
          body: {
            type: "PrivateChat", 
            chatInfo: {otherUserId: actualUserId, otherUsername: actualUserName, conversationId: chatInfo.conversationId}}
        });
    } catch (e) {
      console.error("Error sending message: ", e);
    }
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
    const userId =  await AsyncStorage.getItem('@fiufit_userId');
    const username =  await AsyncStorage.getItem('@fiufit_username');
    if (!chatInfo.conversationId) {
      const docRef = await addDoc(collection(db, "conversations"), {
        messages: []
      });
      chatInfo.conversationId = docRef.id;
      await createChat(userId, chatInfo.conversationId, chatInfo.otherUserId);
      await createChat(chatInfo.otherUserId, chatInfo.conversationId, userId);
    }
    onSnapshot(doc(db, "conversations", chatInfo.conversationId), (doc) => {
      setMessages(doc.data().messages);
    });
    setActualUserId(userId);
    setActualUserName(username);
  }

  useEffect(() => {
    getConversationMessages();
  }, []);

  return (
    <View style={fiufitStyles.messageChatContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {messages && messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </ScrollView>
      <View style={fiufitStyles.messageChatInputContainer}>
        <View style={fiufitStyles.messageChatInput}>
          <TextInput style={{paddingLeft: 10, alignItems: 'center', justifyContent: 'center', flex: 1}}
            placeholder="Message"
            value={actualMessage}
            onChangeText={text => handleMessageChange(text)}
          />
        </View>
        <TouchableOpacity onPress={handleSend} style={fiufitStyles.messageChatButton}>
          <Text style={fiufitStyles.buttonText}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
   
    </View>
    
  );
};

export default PrivateChatScreen