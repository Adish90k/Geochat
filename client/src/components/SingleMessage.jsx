import React, { useEffect, useState } from 'react'
import { ChatState } from "../Context/chatContext";
import axios from "axios";
import "./Message.css"
import io from "socket.io-client";


const ENDPOINT = "http://localhost:5000/";
var socket;


function SingleMessage({allmessegesData,handlenewMessagereceived}) {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewmessage] = useState();

    const loggedInUser = localStorage.getItem("user");
    const parsedLoggedInUser = JSON.parse(loggedInUser);
    const { selectedChat, setSelectedChat, userInfo, chats, setChats,userIdC,setuserIdC } =
    ChatState();
    const [sockets,setSocketConnected] = useState(false);

    // console.log(allmessegesData);

    const userIDL = JSON.parse(localStorage.getItem("userId"));
   
    useEffect(()=>{
   
      socket = io(ENDPOINT);
      console.log(userIDL);
      socket.emit("setup",userIDL);
      socket.emit("connected",()=>setSocketConnected(true));
   
     },[])
     

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
        //  socket = io(ENDPOINT);
         socket.emit("new message",data);
         setMessages([...messages,data]); 
      
        } catch (error) {
          console.log(error);
        }
   
  }


  useEffect(()=>{
    console.log(`hello`);
    // socket = io(ENDPOINT);
    socket.on("message recieved",(newMessagerecieved)=>{
      console.log("inside");
      if(!selectedChat || selectedChat._id!==newMessagerecieved.chat._id){
        console.log("inside if");
      }else{
        console.log(newMessagerecieved);
        console.log(allmessegesData);
        handlenewMessagereceived(newMessagerecieved);
        // setAllmessagesData([...allmessagesData,newMessagerecieved]);
      }
    })
  })
  




  return (
    <div className='mainMessagediv'>

<div className="messagerenderdiv">
{allmessegesData ?(allmessegesData.map((message)=>{
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