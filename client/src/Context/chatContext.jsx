import React, { createContext, useContext, useEffect, useState } from "react";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState("");
  const [userInfo, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [otherUsercontext,setotherUser] = useState();
 

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("token"));
    // console.log(userInfo);
    setUser(userInfo);

 
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        userInfo,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        otherUsercontext,
        setotherUser
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;