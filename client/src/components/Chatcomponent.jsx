import React, { useState } from "react";
import { ChatState } from "../Context/chatContext";
import axios from "axios";
import { useEffect } from "react";

function Chatcomponent({Ongetallmessages}) {
  const { selectedChat, setSelectedChat, userInfo, chats, setChats,setotherUser,otherUsercontext } =
    ChatState();



    const getToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const parsedTokem = JSON.parse(token);
        return `Bearer ${parsedTokem}`;
      }
      return null;
    };
  
    const loggedInUser = localStorage.getItem("user");
    const parsedLoggedInUser = JSON.parse(loggedInUser);

  const fetchChats = async () => {
    try {
      const usertoken = localStorage.getItem("token");
      const parseduserToken = JSON.parse(usertoken);
      //   console.log(parseduserToken);
      if (usertoken) {
        const config = {
          headers: {
            Authorization: `Bearer ${parseduserToken}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:5000/api/chat/fetchallchats",
          config
        );
        setChats(data);
        // console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  useEffect(() => {
    fetchChats();
  }, []);

  let bg = {
    backgroundColor: "lightgreen",
  };
  let bg2 = {
    backgroundColor: "lightblue",
  };

  function handleChat(chat,otherUser) {
    // console.log(chat);
    setSelectedChat(chat);
    setotherUser(otherUser);
    // console.log("chat details are:",chat);
    Ongetallmessages(chat);
  }

  // async function getAllMessages(chat){
  //   const token = getToken();
  //   // console.log(token);
  //   if (token) {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/api/messages/${chat._id}`,
  //         {
  //           headers: {
  //             Authorization: token,
  //           },
  //         }
  //       );
  //       console.log(response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     console.log(`token doesnot exist`);
  //   } 
     
  // }
  // console.log(selectedChat);

  return (
    <>
      <div>
        {chats ? (
          chats.map((chat) => {
            const otherUser = chat.users.find(user => user.name !== parsedLoggedInUser);
            // console.log(otherUser);
            // console.log("Cadca");
           
            return (
             
              <div
                className="chatdiv"
                onClick={()=>handleChat(chat,otherUser)}
                style={selectedChat === chat ? bg : bg2}
                key={chat._id}
              >
              
                <p>{otherUser.name}</p>
              </div>
            );
          })
        ) : (
          <p>chats are loading</p>
        )}
      </div>

      {/* <div>{selectedChat ? (<></>) : <div></div>}</div> */}
    </>
  );
}

export default Chatcomponent;
