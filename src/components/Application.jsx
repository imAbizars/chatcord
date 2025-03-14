import React, { useState, useEffect } from "react";
import { 
  AppBar, Toolbar, Typography, Drawer, CssBaseline, Divider, 
  IconButton, Menu, MenuItem, Avatar, Badge, Grid, Snackbar, Fade, Box
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Close as CloseIcon } from "@mui/icons-material";
import { deepPurple } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import Rooms from "./Rooms";
import EditProfile from "./EditProfile";
import { GoSignOut } from "react-icons/go";
import { FaUserEdit } from "react-icons/fa";

const drawerWidth = 240;

const Application = ({ window, uid }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (uid) {
      const unsubscribe = onSnapshot(doc(db, "users", uid), (doc) => {
        setUserDetails(doc.data());
        localStorage.setItem("userDetails", JSON.stringify(doc.data()));
      });
      return () => unsubscribe();
    }
  }, [uid]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleEditProfile = () => setEditProfileModal(!editProfileModal);
  const handleAlert = () => setAlert(!alert);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      console.log("signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, bgcolor: "#171c2e", color: "white",overflow:"hidden" }}>
      <Toolbar>
        <Typography variant="h5" sx={{ fontWeight: "bold", letterSpacing: 2 }}>CHATCORD</Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "gray" }} />
      {userDetails && (
        <Box display="grid"  alignItems="center" spacing={2} sx={{ py: 2, pl:2 }}>
          <Box display="grid" >
            <Badge
              overlap="circular"
              badgeContent=" "
              color="success"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar sx={{ bgcolor: deepPurple[500] }} src={userDetails.photoURL} />
            </Badge>
          </Box>
          <Box display="grid" >
            <Typography variant="h6">{userDetails.displayName}</Typography>
            <Typography variant="body2" color="gray">{userDetails.email}</Typography>
          </Box>
        </Box>
      )}
      <Divider sx={{ bgcolor: "white" }} />
      <Rooms />
    </Box>
  );

  return (
    <Box sx={{ display: "flex"  }}>
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={handleAlert}
        TransitionComponent={Fade}
        message="Display Name Updated Successfully"
        action={
          <IconButton size="small" color="inherit" onClick={handleAlert}>
            <CloseIcon />
          </IconButton>
        }
      />

      {editProfileModal && <EditProfile toggler={toggleEditProfile} alert={handleAlert} />}

      <AppBar position="fixed" sx={{ bgcolor: "#22273b", color: "#dcddde", width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          </Typography>
          <IconButton onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem onClick={toggleEditProfile}><FaUserEdit /> Edit Profile</MenuItem>
            <MenuItem onClick={handleSignOut}><GoSignOut /> Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }}}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#171c2e" }}}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#171c2e",overflow:"hidden"}}}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Application;
