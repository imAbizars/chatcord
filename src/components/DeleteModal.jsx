import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";


export default function DeleteModal({ msgId, text,channelId,deleteMsg, handleModal}){
    const [open,setOpen] = useState(true);
    const handleDelete = ()=>{
        deleteMsg(msgId,channelId);
        handleModal();
    };
    const handleClose = ()=>{
        setOpen(false);
        handleModal();
    }
    return(
        <div>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure want to delete the messages?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                    style={{}}
                    >
                    {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                    onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                    onClick={handleDelete}
                    color="primary"
                    autoFocus
                    variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}