import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useState } from 'react'
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserInfo } from '../../store/store'


export const AuthComp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserInfo } = useUserInfo();

  const navigate = useNavigate();


  const registerHandler = async () => {
    if (!email.length) {
      toast.error("Please enter a valid email")
    } else if (!password.length) {
        toast.error("Please enter a password")
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        }
        else {
          const response = await axios.post(
              "http://localhost:3000/api/auth/register",
              {email, password},
              {withCredentials: true}
            ); 
          if (response.data == "Email address already registered"){
            toast.error(response.data);
          } else if (response.status === 201){
            setUserInfo(response.data)
            toast.success("Registration successful")
            navigate("/profile");
            console.log(response.data);
          } else {
            console.log(response.data);
          }
        }
  };

  const loginHandler = async () => {
    if (!email.length) {
      toast.error("Please enter a valid email")
    } else if (!password.length) {
        toast.error("Please enter a password")
      } else{
        try {
          const response = await axios.post(
            "http://localhost:3000/api/auth/login",
            {email, password},
            {withCredentials: true}
          ); 
          if (response.data == "Please check your email and password and try again."){
            toast.error(response.data);
          } else {
            console.log(response.data)
            setUserInfo(response.data)
            toast.success("Logged in successfully")
            // debugger;
            if (response.data.profileSetup){
              console.log(response.data.profileSetup)
              navigate("/chat");
            } else {
              navigate("/profile");
            }
          }
        } catch (error) {
          if (error.status === 976){
            toast.error(error.response.data);
          } else {
            console.log(error.response.data);
          }
        }
      }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#000000] ">
      <div className="h-[80vh] bg-[#0A0A0A] shadow-lg lg:w-[50vw] w-[60vw] rounded-3xl">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="flex items-center justify-center flex-col gap-4">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold mt-8 text-white">Chattly</h1>
            </div>
            <div>
              <p className="font-medium text-center text-white">Your daily pear to pear messenger</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full ">
            <Tabs defaultValue="login" className="flex flex-col items-center justify-center w-4/5">
              <TabsList className="w-full bg-[#ffffff]/5">
                <TabsTrigger value="login" className="w-full  text-white/35 data-[state=active]:text-[white]/80 data-[state=active]:bg-[white]/10">Login</TabsTrigger>
                <TabsTrigger value="register" className="w-full  text-white/35 data-[state=active]:text-[white]/80 data-[state=active]:bg-[white]/10">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col items-start justify-center w-full gap-8 mt-10">
                <div className="flex flex-col items-start justify-center w-full gap-3">
                  <p className="text-white">Email</p>
                  <Input className="bg-[#ffffff]/5 border-none text-white" type="email" placeholder="user@example.com" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col items-start justify-center w-full gap-3">
                  <p className="text-white">Password</p>
                  <Input className="bg-[#ffffff]/5 border-none text-white" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button className="w-full p-6 text-[#3aff7c] bg-[#0C160F] hover:bg-[#0C160F]/80" onClick={loginHandler}>Login</Button>
                </TabsContent>

                <TabsContent value="register" className="flex flex-col items-start justify-center w-full gap-8 ">
                  <div className="flex flex-col items-start justify-center w-full gap-3">
                    <p className="text-white">Email</p>
                    <Input className="bg-[#ffffff]/5 border-none text-white" type="email" placeholder="user@example.com" onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="flex flex-col items-start justify-center w-full gap-3">
                    <p className="text-white">Password</p>
                    <Input className="bg-[#ffffff]/5 border-none text-white" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="flex flex-col items-start justify-center w-full gap-3">
                    <p className="text-white">Confirm Password</p>
                    <Input className="bg-[#ffffff]/5 border-none text-white" type="password" placeholder="••••••••" onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>

                  <Button className="w-full p-6 text-[#3aff7c] bg-[#0C160F] hover:bg-[#0C160F]/80" onClick={registerHandler}>Register</Button>
                  </TabsContent>
            </Tabs>


          </div>
        </div>
      </div>
    </div>
  );
};
