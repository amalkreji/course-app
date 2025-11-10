const { Router } = require("express");
const { userModel } = require("../db");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const { JWT_USER_PASSWORD } = require("../config")
const saltRounds = 5;


const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body

    try {
        const encryptedUserPassword = await bcrypt.hash(password, saltRounds);

        await userModel.create({
            email,
            password : encryptedUserPassword,
            firstName,
            lastName

        })
    } catch (error) {
        console.error("Sign up has failed")
    }
        
    res.json({
        message : "signup completed"
    })
})

userRouter.post("/signin",async function(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email,
        password
    })
    if (user) {
        const token = jwt.sign({
            id : user._id 
        },JWT_USER_PASSWORD)


        res.json({
            token : token
        })     
    } else {
        res.status.json({
            message : "incorrect credential"
        })
    }

    
})

userRouter.get("/purchases" ,function(req , res) {
    res.json({
        message : "s"
    })
})

module.exports = {
    userRouter : userRouter
}