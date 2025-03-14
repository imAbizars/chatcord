import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  IconButton, 
  Divider, 
  Snackbar, 
  Fade,
  Box
} from "@mui/material";
import { ExpandLess, ExpandMore, Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { IoMdChatboxes } from "react-icons/io";
import { BiHash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import CreateRoom from "./CreateRoom";

const NestedListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));

const IconDesign = styled("div")({
  fontSize: "1.5em",
  color: "#cb43fc",
});

function Rooms() {
  const [open, setOpen] = useState(true);
  const [channelList, setChannelList] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "channels"), orderBy("channelName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChannelList(
        snapshot.docs.map((doc) => ({
          channelName: doc.data().channelName,
          id: doc.id,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => setOpen(!open);

  const goToChannel = (id) => navigate(`/channel/${id}`);

  const manageCreateRoomModal = () => setShowCreateRoom(!showCreateRoom);

  const handleAlert = () => setAlert(!alert);

  const addChannel = async (cName) => {
    if (cName) {
      cName = cName.toLowerCase().trim();
      if (!cName) {
        handleAlert();
        return;
      }
      if (channelList.some((channel) => channel.channelName === cName)) {
        handleAlert();
        return;
      }
      try {
        await addDoc(collection(db, "channels"), { channelName: cName });
        console.log("Added new channel");
      } catch (error) {
        console.error("Error adding channel: ", error);
      }
    }
  };

  return (
    <div  >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Room Name Already Exists!!"
        action={
          <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />

      {showCreateRoom && <CreateRoom create={addChannel} manage={manageCreateRoomModal} />}
      
      <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
        <ListItemText sx={{fontSize:"10px"}} primary="Create New Channel" />
        <IconButton edge="end" aria-label="add" onClick={manageCreateRoomModal}>
          <AddIcon sx={{ color: "#cb43fc" }} />
        </IconButton>
      </ListItem>
      <Divider />

      <List component="nav" sx={{ maxHeight: "300px" }}>
        <ListItem  onClick={handleClick}>
          <ListItemIcon>
            <IconDesign as={IoMdChatboxes} />
          </ListItemIcon>
          <ListItemText primary="CHANNELS" sx={{ color: "#8e9297" }} />
          {open ? <ExpandLess sx={{ color: "#cb43fc" }} /> : <ExpandMore sx={{ color: "#cb43fc" }} />}
        </ListItem>

        <Collapse in={open} timeout="auto">
          <Box sx={{ maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
            <List component="div">
              {channelList.map((channel) => (
                <NestedListItem key={channel.id} onClick={() => goToChannel(channel.id)}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <IconDesign as={BiHash} sx={{ color: "#b9bbbe" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={channel.channelName.length > 12 ? `${channel.channelName.substr(0, 12)}...` : channel.channelName}
                    sx={{ color: "#dcddde" }}
                  />  
                </NestedListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      </List>
    </div>
  );
}

export default Rooms;
