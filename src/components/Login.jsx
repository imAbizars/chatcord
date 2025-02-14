import React from "react";
import { Container, Typography, Button } from "@mui/material";
import logo from "../assets/logochatcord.png";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth"; 

export default function Login() {
    const login = async () => { 
        try {
            await signInWithPopup(auth, provider);  
            console.log("Success");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container component="div" maxWidth="xs" className="bg-[#171c30] text-white">
            <div className="flex flex-col items-center mt-20 pb-[25px] pt-[35px]">
                <img src={logo} alt="logo" className="p-6 m-10 " />
                <Typography variant="h4" className="pt-[15px]">Sign In To Chatcord</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FcGoogle />}
                    sx={{ color: "white", marginTop: "50px" }}
                    onClick={login}
                >
                    Sign In With Google
                </Button>
            </div>
        </Container>
    );
}
