const UserModel = require('../models/usersModel');
const bcrypt = require('bcrypt');

const registerUser = async ({ email, password }) => {
    try {
        let encryptedPassword = await bcrypt.hash(password, 12);
        try {

                let newUser = new UserModel({email:email, password:encryptedPassword});
                await newUser.save();
                return ({
                    message: "User registered successfully",
                    user: {
                        id: newUser?.id,
                        email: newUser?.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        gender: newUser.gender,
                        profileSetup: newUser.profileSetup,
                    }
                })

        } catch (error) {
            // error code 11000 means that you try to store unique data again in the database
            if (error.code == 11000){
                return ({ message: "Email address already registered" })
            }
            return ({ message: "Error while trying to create new user: " + error.message })
        }
    } catch (error) {
        return ({ message: "Error while trying to encrypt password: " + error.message })

    }
};


const loginUser = async ({ email, password }) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                return ({
                    message: "User logged in successfully",
                    user: {
                        id: user?.id,
                        email: user?.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        gender: user.gender,
                        profileSetup: user.profileSetup,
                    }
                })
            } else {
                return ({ message: "Password is incorrect" })
            }
        } else {
            return ({ message: "User with the given email address not found" })
                
        }

    } catch (error) {
        return ({ message: "Error while trying to find the user: " + error.message })

    }
};


module.exports = {
    registerUser,
    loginUser,
};