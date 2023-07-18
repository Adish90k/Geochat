import React, { useEffect, useState } from "react";
import axios from "axios";
import Chatcomponent from "./Chatcomponent";
import { ChatState } from "../Context/chatContext";
import "./Chat.css";
import SingleMessage from "./SingleMessage";


function Chat() {
  const [inputDistance, setInputDistance] = useState(0);
  const [users, setUsers] = useState(null);
  const [userDistance, setUserDistance] = useState([]);
  const [messages, setMessage] = useState(null);
  const [allmessagesData,setAllmessagesData] = useState(null); 
  
  const { selectedChat, setSelectedChat, userInfo, chats, setChats,otherUsercontext,setotherUser } =
    ChatState();

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsedTokem = JSON.parse(token);
      return `Bearer ${parsedTokem}`;
    }
    return null;
  };

  function findistance(users) {
    // console.log("users are:",users);

    const user = localStorage.getItem("user");
    const userparsed = JSON.parse(user);
    for (let i = 0; i < users.length; i++) {
      if (users[i].user1.name === userparsed) {
        const loggedInUserValue = users[i].user1.name;
        const otherUser = users[i].user2.name;
        const distanceBetweenUsers = users[i].distance;
        const loggedInUserId = users[i].user1.id;
        const otherUserId = users[i].user2.id;
        setUserDistance((prev) => [
          ...prev,
          {
            distanceBetweenUsers,
            otherUser,
            loggedInUserValue,
            loggedInUserId,
            otherUserId,
          },
        ]);
      } else if (users[i].user2.name === userparsed) {
        const loggedInUserValue = users[i].user2.name;
        const otherUser = users[i].user1.name;
        const loggedInUserId = users[i].user2.id;
        const otherUserId = users[i].user1.id;
        const distanceBetweenUsers = users[i].distance;
        setUserDistance((prev) => [
          ...prev,
          {
            distanceBetweenUsers,
            otherUser,
            loggedInUserValue,
            loggedInUserId,
            otherUserId,
          },
        ]);
      }
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      // console.log(token);
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/user/getallusers",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setUsers(response.data);
          findistance(response.data);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log(`token doesnot exist`);
      }
    };

    fetchData();
  }, []);

  // console.log(users);
  const accessChat = async (userId) => {
    const token = getToken();
    // console.log("this is from chatcomponent", token);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat/accesschat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  function handlechat(userId) {
    accessChat(userId);
    //  return userId;
  }

  let count = 0;


///messages


async function getAllMessages(chat){
  const token = getToken();
  // console.log(token);
  if (token) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${chat._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
       setAllmessagesData(response);
    //  console.log(response);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log(`token doesnot exist`);
  } 
   
}



  return (
    <div className="mainallContainer">
      <div className="mainusersContainer">
        {userDistance &&
          userDistance.map((elem) => (
            <div key={count}>
              <p>
                {elem.otherUser}:{elem.distanceBetweenUsers}
              </p>
              <button onClick={() => handlechat(elem.otherUserId)}>
                message
              </button>
              {count++}
            </div>
          ))}
      </div>

      <div className="mainchatsContainer">
        <Chatcomponent Ongetallmessages={getAllMessages}/>
      </div>
 
      <div className="mainMessagesContainer">         
          <>{selectedChat?
          (
          <div>
            <header>
              <h2>{selectedChat?(otherUsercontext).name:""}</h2>
            </header>
            {allmessagesData? <SingleMessage allmessegesData={allmessagesData}/>:(
             <h2 className="beforemessagetxt">messages are loading</h2>
            )} 
          </div>):(<h2 className="beforemessagetxt">pleas select a chat</h2>)}
          </>
      </div>
    </div>
  );
}

export default Chat;