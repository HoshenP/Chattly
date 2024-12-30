import { useState, useEffect } from "react";
import { useUserInfo } from "../../store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar } from "@/components/ui/avatar";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ProfileComp = () => {
  const { userInfo, setUserInfo } = useUserInfo();
  const [email, setEmail] = useState(`${userInfo.email}`);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");

  const [headerText, setHeaderText] = useState("So.. Lets get started?");

  const navigate = useNavigate();

  const updateInfoHandler = async () => {
    if (!email.length) {
      toast.error("Please enter a valid email");
    } else if (!firstName.length) {
      toast.error("Please enter a first name");
    } else if (!lastName.length) {
      toast.error("Please enter a last name");
    } else {
      const response = await axios.put(
        "http://localhost:3000/api/user/updateuser",
        { email, firstName, lastName, gender },
        { withCredentials: true }
      );
      console.log(response);

      if (response.data.message == "User updated successfully") {
        toast.success("User updated successfully");
        setUserInfo(response.data.user);
        navigate("/chat");
        console.log(response.data);
      } else {
        toast.error("Somehting went wrong");
      }
    }
  };

  useEffect(() => {
    console.log(userInfo.firstName);

    if (userInfo.profileSetup) {
      setEmail(userInfo.email);
      setFirstName(userInfo.firstName);
      setHeaderText("Account data");
      console.log("name set");
      setGender(userInfo.gender);
      setLastName(userInfo.lastName);
    }
  }, [userInfo]);

  // console.log(userInfo);
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center  bg-[#000000] gap-12">
      <div
        className=" flex items-center p-3 justify-center rounded-full hover:bg-[#3aff7c]/10 cursor-pointer transition-all duration-300"
        onClick={() => navigate("/chat")}
      >
        <IoMdArrowRoundBack className="text-[#3aff7c] text-2xl hover:scale-125  rounded-full cursor-pointer transition-all duration-300" />
      </div>

      <div className=" w-[80vw] flex flex-col justify-start bg-[#0A0A0A] lg:w-[50vw] rounded-2xl ">
        <div className=" w-[full] border-b p-8 border-[#beb7b71f] flex flex-col gap-2">
          <p className=" ml-4 text-2xl text-[white] font-bold">
            {headerText}
          </p>
          <p className="ml-4 font-sm text-white">Make sure you enter correct details</p>

        </div>
        <div className=" w-[full] flex items-center bg-[#000000] ">
          <div className="h-[60vh] w-[50vw] flex flex-col items-center justify-center bg-[#0A0A0A] gap-6 border-r border-[#beb7b71f] rounded-bl-2xl ">
            <Avatar className="h-24 w-24 md:w-32 md:h-32  rounded-full overflow-hidden">
              {gender == "male" ? (
                <div
                  className={`uppercase h-24 w-24 md:w-32 md:h-32  text-5xl bg-[#3b2c7157] text-[#4b57ff]  flex items-center justify-center rounded-full`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              ) : (
                <div
                  className={`uppercase h-24 w-24 md:w-32 md:h-32  text-5xl bg-[#712c6257] text-[#f740ba] flex items-center justify-center rounded-full`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            <RadioGroup defaultValue="male">
              <div className="flex items-center space-x-2 text-white">
                <RadioGroupItem
                  className="bg-[#3aff7c]/10 text-[#3aff7c]/80"
                  checked={gender == "male"}
                  value="male"
                  id="male"
                  onClick={() => setGender("male")}
                />
                <Label htmlFor="option-one">Male</Label>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <RadioGroupItem
                  checked={gender == "female"}
                  className=" text-white bg-[#3aff7c]/10 text-[#3aff7c]/80"
                  value="female"
                  id="female"
                  onClick={() => setGender("female")}
                />
                <Label htmlFor="option-two">Female</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="h-[60vh] w-[50vw] flex flex-col items-center justify-center bg-[#0A0A0A] rounded-br-2xl">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start justify-center w-[20vw] gap-3 text-white">
                  <p>Email</p>
                  <Input
                    type="email"
                    value={email}
                    placeholder={"user@example.com"}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#ffffff]/5 border-nonebg-[#ffffff]/5 border-none text-white"
                  />
                </div>
                <div className="flex flex-col items-start justify-center w-[20vw] gap-3 text-white">
                  <p>First name</p>
                  <Input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#ffffff]/5 border-none text-white"
                  />
                </div>
                <div className="flex flex-col items-start justify-center w-[20vw] gap-3 text-white">
                  <p>Last name</p>
                  <Input
                    type="text"
                    value={lastName}
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#ffffff]/5 border-none text-white"
                  />
                </div>
              </div>
              <div className="w-full">
                <Button
                  className="w-full text-[#3aff7c] bg-[#3aff7c]/10 hover:bg-[#3aff7c]/5"
                  onClick={updateInfoHandler}
                >
                  {" "}
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
