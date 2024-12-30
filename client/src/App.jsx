import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AuthComp } from "./pages/auth/AuthComp"
import { ChatComp } from "./pages/chat/ChatComp"
import { ProfileComp } from "./pages/profile/ProfileComp"
import { useUserInfo } from './store/store.js'
import axios from "axios";

const ProtectedRoutes = ({ children }) => {
  const { userInfo } = useUserInfo();
  return userInfo ? children : <Navigate to="/auth" />;
};


const AuthRoute = ({ children }) => {
  const { userInfo } = useUserInfo();
  return userInfo ? <Navigate to="/chat" /> : children;
};


function App() {
  const { userInfo, setUserInfo } = useUserInfo();


  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/userinfo",
          {withCredentials: true}
        );  
        
        if (response.data.id){
          setUserInfo(response.data);
          console.log("Saved the user in the store, (based on the JWT)")
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);        
      }
    }

    if (!userInfo){
      getUserInfo();
    } else {
      console.log("User is already saved in store");
      console.log({...userInfo});

      
    }

  }, [userInfo, setUserInfo]);


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <AuthComp />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoutes>
              <ChatComp />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ProfileComp />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
