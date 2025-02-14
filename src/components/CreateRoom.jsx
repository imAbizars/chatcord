import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function CreateRoom({ create, manage }) {
  const [roomName, setRoomName] = useState("");

  const handleClose = () => {
    manage();
  };

  const handleNewRoom = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      create(roomName.trim());
      manage();
    }
  };

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Create A New Channel</DialogTitle>
      <DialogContent>
        <form onSubmit={handleNewRoom}>
          <TextField
            label="Enter Channel Name"
            fullWidth
            margin="normal"
            variant="outlined"
            required
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            sx={{ backgroundColor: "rgb(45 45 73)", borderRadius: 1 }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleNewRoom} type="submit" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

