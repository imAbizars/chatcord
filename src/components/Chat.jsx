import React, { useEffect, useState,useRef } from "react";
import {  IconButton,TextField} from "@mui/material";
import { useParams } from "react-router-dom";
import {db} from "../firebase/firebase"
import { doc, collection, onSnapshot, addDoc, serverTimestamp,query,orderBy} from "firebase/firestore";
import { BiHash } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import ScrollToBottom from "react-scroll-to-bottom";
import EmojiPicker from "emoji-picker-react";
import { FaArrowDown } from "react-icons/fa";
import Messages from "./Message";


export default function Chat(){
  const { id } = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [userNewMsg, setUserNewMsg] = useState("");
  const [emojiBtn, setEmojiBtn] = useState(false);
  const textRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
  };
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
    <div className="w-full h-screen flex flex-col">
    {/* Header Channel */}
    <div className="flex items-center p-4  text-gray-200 pt-5">
      <BiHash className="text-xl" />
      <h3 className="ml-2 text-lg font-bold">{channelName}</h3>
    </div>
  
    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto min-h-0 relative" onScroll={handleScroll}>
      <ScrollToBottom className="h-full" checkInterval={0} >
        {allMessages.map((message) => (
          <Messages key={message.id} values={message.data} msgId={message.id} />
        ))}
        <div ref={scrollRef} />
      </ScrollToBottom>
  
      
    </div>
  
    {/* Chat Input (Tetap di Bawah) */}
    <div className="w-full bg-[#171c2e] flex items-center p-4 ">
      {/* Emoji Picker */}
      <IconButton onClick={() => setEmojiBtn(!emojiBtn)}>
        <GrEmoji className="text-gray-400" />
      </IconButton>
  
      {emojiBtn && (
        <div className="absolute bottom-16 left-4 z-10">
          <EmojiPicker onEmojiClick={(emoji) => addEmoji(emoji)} theme="dark" />
        </div>
      )}
  
      {/* Input Chat */}
      <form className="flex flex-1 items-center space-x-2" onSubmit={sendMsg}>
        <TextField
          inputRef={textRef}
          sx={{
            width: "100%",
            overflow: "auto",
            maxHeight: "150px",
          }}
          required
          multiline
          minRows={1} 
          maxRows={2}
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


