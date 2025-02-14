import { useState, useEffect } from "react";
import Application from "./components/Application";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth,db} from "./firebase/firebase";
import "./App.css";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            console.log("User exists:", docSnap.data());
          } else {
            const details = {
              name: user.displayName || "Anonymous",
              displayName: user.displayName ? user.displayName.split(" ")[0] : "User",
              photoURL: user.photoURL || "",
              email: user.email || "",
              uid: user.uid,
            };

            await setDoc(userRef, details);
            console.log("New user created");
          }

          setUser(user.uid);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
    <Router>
      {!user ? (
        <Login />
      ) : (
        <div className="flex">
          <Application uid={user} />
          <main className="flex-grow bg- h-screen">
            <div className="min-h-[50px]" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/channel/:id" element={<Chat />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  </div>
  );
}

export default App;
