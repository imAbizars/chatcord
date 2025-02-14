import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Typography, Card, CardActionArea, CardContent, Avatar, Box } from "@mui/material";

export default function Home() {
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "channels"), orderBy("channelName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChannels(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ backgroundColor: "rgb(34 39 59)", minHeight: "120vh", p: 2}}>
      {/* Header */}
      <Box sx={{ textAlign: "center", pt: 4, pb: 3, color: "#f0f0f0"}}>
        <Typography variant="h3" fontWeight={700}>Welcome to Chatcord</Typography>
        <Typography variant="h5">lets make a friends!! </Typography>
      </Box>

      {/* Channel List dengan CSS Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          overflowY: "auto",
          maxHeight: "calc(100vh - 185px)",
        }}
      >
        {channels.map((channel) => (
          <Card
            key={channel.id}
            sx={{
              bgcolor: "#1e2439",
              boxShadow: 2,
              color: "rgb(220, 221, 222)",
            }}
          >
            <CardActionArea
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
              }}
              onClick={() => navigate(`/channel/${channel.id}`)}
            >
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#6a9ec066", fontSize: 32 }}>
                {channel.channelName[0].toUpperCase()}
              </Avatar>
              <Typography sx={{ pt: 2, fontSize: "1.2rem" }}>{channel.channelName}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

