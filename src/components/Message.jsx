import React, { useState } from "react";
import {Avatar, Box, IconButton} from "@mui/material";
// import { deepPurple } from "";
import { AiFillLike, AiFillFire, AiFillHeart, AiFillDelete } from "react-icons/ai";
import { useParams } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import Linkify from "react-linkify";
import { doc, deleteDoc,runTransaction } from "firebase/firestore";
import {db} from "../firebase/firebase";


export default function Message({values,msgId}){
  const [style, setStyle] = useState({ display: "none" });
  const [deleteModal, setDeleteModal] = useState(false);
  const uid = JSON.parse(localStorage.getItem("userDetails")).uid;
  const messegerUid = values.uid;
  const date = values.timestamp?.toDate() ?? new Date();
  const time = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  const numLikes = values.likeCount;
  const numFire = values.fireCount;
  const numHeart = values.heartCount;
  const userLiked = values.likes[uid];
  const userFire = values.fire[uid];
  const userHeart = values.heart[uid];
  const { id: channelId } = useParams();

  const showDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const linkifyDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );

  const selectedLike = userLiked
    ? { color: "#A1E3F9", backgroundColor: "#3C3D37" }
    : null;
  const selectedHeart = userHeart
  ? { color: "#C62E2E", backgroundColor: "#3C3D37" }
  : null;

  const selectedFire = userFire
  ? { color: "#ffc336", backgroundColor: "#3C3D37" }
  : null;
  //logic untuk like
  const likeClick = async (channelId, msgId, uid) => {
    if (!channelId || !msgId || !uid) return;
  
    const messageDoc = doc(db, "channels", channelId, "messages", msgId);
  
    try {
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(messageDoc);
  
        if (!docSnap.exists()) {
          console.log("Document not found");
          return;
        }
  
        const messageData = docSnap.data();
        let newLikeCount = messageData.likeCount || 0;
        let newLike = messageData.like || {};
  
        if (userLiked) {
          newLikeCount -= 1;
          newLike[uid] = false;
          console.log("Disliked");
        } else {
          newLikeCount += 1;
          newLike[uid] = true;
          console.log("Liked");
        }
  
        transaction.update(messageDoc, {
          likeCount: newLikeCount,
          likes: newLike,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };
  //logic untuk memberi fireclick
  const fireClick = async (channelId, msgId, uid) => {
    if (!channelId || !msgId || !uid) return;
  
    const messageDoc = doc(db, "channels", channelId, "messages", msgId);
  
    try {
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(messageDoc);
  
        if (!docSnap.exists()) {
          console.log("Document not found");
          return;
        }
  
        const messageData = docSnap.data();
        let newFireCount = messageData.fireCount || 0;
        let newFire = messageData.fire || {};
  
        if (userFire) {
          newFireCount -= 1;
          newFire[uid] = false;
          console.log("Disliked");
        } else {
          newFireCount += 1;
          newFire[uid] = true;
          console.log("Liked");
        }
  
        transaction.update(messageDoc, {
          fireCount: newFireCount,
          fire: newFire,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  //logic untuk heartclick
  const heartClick = async (channelId, msgId, uid) => {
    if (!channelId || !msgId || !uid) return;
  
    const messageDoc = doc(db, "channels", channelId, "messages", msgId);
  
    try {
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(messageDoc);
  
        if (!docSnap.exists()) {
          console.log("Document not found");
          return;
        }
  
        const messageData = docSnap.data();
        let newHeartCount = messageData.heartCount || 0;
        let newHeart = messageData.heart || {};
  
        if (userHeart) {
          newHeartCount -= 1;
          newHeart[uid] = false;
          console.log("Disliked");
        } else {
          newHeartCount += 1;
          newHeart[uid] = true;
          console.log("Liked");
        }
  
        transaction.update(messageDoc, {
          heartCount: newHeartCount,
          heart: newHeart,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };
  const deleteMsg = async (msgId, channelId) => {
    if (!msgId || !channelId) {
      console.error("Error: msgId atau channelId tidak valid!", { msgId, channelId });
      return;
    }
  
    try {
      await deleteDoc(doc(db, "channels", channelId, "messages", msgId));
      console.log("Deleted successfully");
    } catch (err) {
      console.error("Error deleting document: ", err);
    }
  };

    return(
      <Box maxWidth="xs" sx={{flexGrow:1,position:"relative",p:"8px"}}>
        {/* delete modal */}
        {deleteModal?(  
          <DeleteModal
          msgId={msgId}
          channelId={channelId}
          text={values.text}
          deleteMsg={deleteMsg}
          handleModal={showDeleteModal}
        />
        ):null}
        {/* delete modal */}
        <div className="p-[8px] hover:bg-[#1f2436]" 
           onMouseEnter={(e) => setStyle({ display: "block" })}
           onMouseLeave={(e) => setStyle({ display: "none" })}
        >
          <div className="inline-block align-top">
            <Avatar
            alt={values.userName}
            src={values.userImg}
            className=""/>
          </div>
          {/* chat */}
          <div className="inline-block pl-4 w-[calc(100%-50px)] break-all">
            <div>
              <h6 className="m-0 inline-block text-base font-semibold text-white">{values.userName}</h6>
              <p className="m-0 inline-block pl-2 text-white">{time}</p>
            </div>
          <div className="text-[#dcddde]">
            <Linkify componentDecorator={linkifyDecorator}>
              {values.text}
            </Linkify>
          </div>
          </div>

          <div className="flex pt-[5px]">
              {numLikes > 0 ?(
                <div className="p-[3px]">
                  <IconButton
                  onClick={() => likeClick(channelId, msgId, uid)}
                  sx={{
                    padding:"3px",
                    borderRadius:"4px",
                    fontSize:"0.8em",
                    backgroundColor:"#ffffff4a",
                    color:"#cacaca",
                    paddingLeft:"5px",
                    paddingRight:"5px",
                    ":hover":{
                      backgroundColor:"#ffffff4a",
                      color: "#e7e7e7",
                    }
                  }}
                  style={selectedLike}
                  >
                    <AiFillLike/>
                    <div className="pl-[2px]">{numLikes}</div>
                  </IconButton>
                </div>
              ):null}
              {numFire > 0 ?(
                <div className="p-[3px]">
                  <IconButton
                  onClick={() => fireClick(channelId, msgId, uid)}
                  sx={{
                    padding:"3px",
                    borderRadius:"4px",
                    fontSize:"0.8em",
                    backgroundColor:"#ffffff4a",
                    color:"#cacaca",
                    paddingLeft:"5px",
                    paddingRight:"5px",
                    ":hover":{
                      backgroundColor:"#ffffff4a",
                      color: "#e7e7e7",
                    }
                  }}
                  style={selectedFire}
                  >
                    <AiFillFire/>
                    <div className="pl-[2px]">{numFire}</div>
                  </IconButton>
                </div>
              ):null}
              {numHeart > 0 ?(
                <div className="p-[3px]">
                  <IconButton
                  onClick={() => heartClick(channelId, msgId, uid)}
                  sx={{
                    padding:"3px",
                    borderRadius:"4px",
                    fontSize:"0.8em",
                    backgroundColor:"#ffffff4a",
                    color:"#cacaca",
                    paddingLeft:"5px",
                    paddingRight:"5px",
                    ":hover":{
                      backgroundColor:"#ffffff4a",
                      color: "#e7e7e7",
                    }
                  }}
                  style={selectedHeart}
                  >
                    <AiFillHeart/>
                    <div className="pl-[2px]">{numHeart}</div>
                  </IconButton>
                </div>
              ):null}
          </div>
          
          <div className="absolute right-0 top-0" style={style}>
          <div className="absolute right-0 pr-[35px] pl-[32px]">
            <div className="flex bg-[#2d2e31ba]  pl-[2px] pr-[2px]">
              <IconButton
                component="span"
                sx={{ padding: "4px" }}
                onClick={() => likeClick(channelId, msgId, uid)}
              >
                <AiFillLike className="text-[1rem] text-[#ffc336]"/>
              </IconButton>
              <IconButton
                component="span"
                sx={{ padding: "4px" }}
                onClick={() => fireClick(channelId, msgId, uid)}
              >
                <AiFillFire className="text-[1rem] text-[#ffc336]" />
              </IconButton>
              <IconButton
                component="span"
                sx={{ padding: "4px" }}
                onClick={() => heartClick(channelId, msgId, uid)}
              >
                <AiFillHeart className="text-[1rem] text-[#ffc336]" />
              </IconButton>
              {uid === messegerUid ? (
                <IconButton
                  component="span"
                  style={{ padding: "4px" }}
                  onClick={showDeleteModal}
                >
                  <AiFillDelete
                    className="text-[1rem] text-[#ffc336]"
                    color="#c3c3c3f0"
                  />
                </IconButton>
              ) : null}
            </div>
          </div>
        </div>
        </div>

      </Box>
    )
}