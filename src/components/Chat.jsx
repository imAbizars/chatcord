import React, { useEffect, useState,useRef } from "react";
import {  IconButton,TextField} from "@mui/material";
import { useParams } from "react-router-dom";
import {db} from "../firebase/firebase"
import { doc, collection, onSnapshot, addDoc, serverTimestamp,query,orderBy} from "firebase/firestore";
import { BiHash } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import Messages from "./Message";


export default function Chat(){
  const { id } = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [userNewMsg, setUserNewMsg] = useState("");
  const [emojiBtn, setEmojiBtn] = useState(false);
  const messagesEndRef  = useRef(null);
  const textRef = useRef(null);

  const autoResize = () => {
    const textarea = textRef.current;
    textarea.style.height = "auto"; 
    textarea.style.height = textarea.scrollHeight + "px"; 
     if (textarea.scrollHeight > 150) {
         textarea.style.overflowY = "scroll"; 
      } else {
        textarea.style.overflowY = "hidden";
      }
  };
  
  useEffect(() => {
    if (id) {
      const channelRef = doc(db, "channels", id);
      const messagesRef = query(
        collection(db, "channels", id, "messages"),
        orderBy("timestamp", "asc")
      )
      //ngambil nama channel
      const unsubscribeChannel = onSnapshot(channelRef, (snapshot) => {
        setChannelName(snapshot.data()?.channelName || "Unknown");
      });

      // ambil pesan dari channel
      const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
        setAllMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

      return () => {
        unsubscribeChannel();
        unsubscribeMessages();
      };
    }
  }, [id]);


  const sendMsg = async (e) => {
    e.preventDefault();
    if (userNewMsg && id) {
      const userData = JSON.parse(localStorage.getItem("userDetails"));
      if (userData) {
        const messageObj = {
          text: userNewMsg,
          timestamp: serverTimestamp(),
          userImg: userData.photoURL,
          userName: userData.displayName,
          uid: userData.uid,
          likeCount: 0,
          likes: {},
          fireCount: 0,
          fire: {},
          heartCount: 0,
          heart: {},
        };

        try {
          await addDoc(collection(db, "channels", id, "messages"), messageObj);
          console.log("Message sent");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
      setUserNewMsg("");
      setEmojiBtn(false);
    }
  };

  const addEmoji = (emojiObject) => {
    if (!emojiObject || !emojiObject.emoji) {
      console.error("Emoji tidak ditemukan!", emojiObject);
      return;
    }
    setUserNewMsg((prev) => prev + emojiObject.emoji);
  };
 

  return (
    <div className="w-full h-screen flex flex-col pb-10">
      {/* {modalState && <FileUpload setState={openModal} file={file} />} */}

      {/* Header Channel */}
      <div className="flex items-center p-4 border-b border-black text-gray-200 pt-5">
        <BiHash className="text-xl" />
        <h3 className="ml-2 text-lg  font-bold">{channelName}</h3>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto ">
        <div className="h-full overflow-y-auto ">
          {allMessages.map((message) => (
            <Messages key={message.id} values={message.data} msgId={message.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className=" pb-20  md:pb-5 bg-[#171c2e] flex items-center  rounded-lg">
        {/* Emoji Picker */}
        <IconButton
        sx={{
          paddingBottom:"30px"
        }} 
        onClick={() => setEmojiBtn(!emojiBtn)}>
          <GrEmoji className="text-gray-400 " />
        </IconButton>
        {
         emojiBtn 
        && 
          <div className="absolute bottom-15 z-10 ">
              <EmojiPicker onEmojiClick={(emoji) => addEmoji(emoji)} theme="dark" />
           </div>
          }

        {/* Input Chat */}
        <form className="flex flex-1 items-center pb-5 " onSubmit={sendMsg}>
          <TextField
            inputRef={textRef}
          
            sx={{
              width:"100%",
              overflow: "auto",
              maxHeight: "150px", 
            }}
            required
            multiline
            rows={1}
            maxRow={2}
            placeholder="Enter Message"
            value={userNewMsg}
            onChange={(e) => {
              setUserNewMsg(e.target.value);
              autoResize(); 
            }}
            onInput={autoResize} 
          />
          <IconButton type="submit">
            <FiSend className="text-gray-400" />
          </IconButton>
        </form>
      </div>
    </div>
  );
};


