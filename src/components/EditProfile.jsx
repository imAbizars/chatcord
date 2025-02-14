import React,{useState,useEffect} from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import {db} from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function EditProfile({toggler,alert}){
    const [open,setIsOpen] = useState(true);
    const [userName,setUserName] = useState("");
    const [displayName,setDisplayName] = useState("");    
    const [email,setEmail] = useState("");
    const [uid,setUid] = useState("");

    const handleClose = () =>{
        setIsOpen(false);
        toggler();
    }
    const updateProfile = async (e) => {
        e.preventDefault();
        
        try {
          const userRef = doc(db, "users", uid);
          await updateDoc(userRef, { displayName });
      
          alert("Profile updated successfully!");
        } catch (err) {
          console.error("Error updating profile:", err);
        }
      
        setOpen(false);
        toggler();
      };
      
      useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userDetails"));
      
        if (userData) {
          setUserName(userData.name);
          setDisplayName(userData.displayName);
          setEmail(userData.email);
          setUid(userData.uid);
        }
      }, []);
    return(
        <div>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
                <DialogContent>
                    <form autoComplete="off">
                        <TextField
                        id="outlined-basic"
                        label="Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled
                        value={userName}
                        sx={{backgroundColor:"#2d2d49",borderRadius:"5px",color:"#a6a6a6"}}
                        />
                        <TextField
                        id="outlined-basic"
                        label="Email"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled
                        value={email}
                        sx={{backgroundColor:"#2d2d49",borderRadius:"5px",color:"#a6a6a6"}}
                        />
                        <TextField
                        id="outlined-basic"
                        label="Display Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={displayName}
                        sx={{backgroundColor:"#2d2d49",borderRadius:"5px",color:"#a6a6a6"}}
                        onChange={(e)=>{
                            setDisplayName(e.target.value);
                        }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                    sx={{color:"white"}}
                    onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={(e)=>updateProfile(e)}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};