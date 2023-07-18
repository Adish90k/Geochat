import React, { useState } from 'react'
import { ChatState } from "../Context/chatContext";
import axios from "axios";
import "./Message.css"


function SingleMessage({allmessegesData}) {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewmessage] = useState();

    const loggedInUser = localStorage.getItem("user");
    const parsedLoggedInUser = JSON.parse(loggedInUser);
    const { selectedChat, setSelectedChat, userInfo, chats, setChats } =
    ChatState();

    console.log(allmessegesData);

  const typinghandler = (ev) =>{
    // console.log(ev.target.value);
    setNewmessage(ev.target.value);
  }
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsedTokem = JSON.parse(token);
      return `Bearer ${parsedTokem}`;
    }
    return null;
  };
   
  const handlesendMessage = async(ev) =>{
    const token = getToken();
      // console.log(`called`);
        try {
          const config = {
            headers:{
              "Content-type":"application/json",
               Authorization: token,
            }
          }
          setNewmessage("");
          // console.log(selectedChat);
         const {data} = await axios.post("http://localhost:5000/api/messages/",
         {
          content:newMessage,
          chatId:selectedChat._id
         },
         config
         ); 
        
      
         setMessages([...messages,data]); 
        } catch (error) {
          console.log(error);
        }
   
  }

  return (
    <div className='mainMessagediv'>

<div className="messagerenderdiv">
{allmessegesData.data ?(allmessegesData.data.map((message)=>{
  return (
    
    <p className={message.sender.name===parsedLoggedInUser?"loggedInusermessage":"otherusermessage"} key={message._id}>
      {/* {console.log("user:",message.sender,"logged in user:",parsedLoggedInUser)} */}
      {message.content}</p>
  )
})):(<p>send a message</p>)}



</div>

  <input type="text" placeholder='Enter your message here'
   onChange={(ev)=>typinghandler(ev)}
  
    
  />
    <button onClick={()=>handlesendMessage()}>send</button>    
    </div>
  )
}

export default SingleMessage