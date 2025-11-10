const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db") 
const bcrypt = require('bcrypt');
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const { courseRouter } = require("./course");
const admin = require("../middleware/admin");

const saltRounds = 6;

adminRouter.post("/signup",async function(req, res) {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await adminModel.findOne({email});
    if (existingUser) {
        return res.status(400).json({
            message : "Admin already exist"
        })
    }
    try {
        const encryptedAdminPassword = await bcrypt.hash(password, saltRounds);

        await adminModel.create({
            email : email,
            password : encryptedAdminPassword,
            firstName,
            lastName
        })
        
    } catch (error) {
        console.error('Cant add admin credentials')
    }
    res.json({
        message : "Admin signed up!!!"
    })
})

adminRouter.post("/signin", async function(req, res) {
    const {email, password} = req.body;

    const admin = await adminModel.findOne({
        email,
    })

    if (!admin) {
        return res.status(401).json({ 
            message : "Admin not found"
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {

        return res.status(401).json({
            message : "password incorrect"
        })
    }
    const token = jwt.sign({
        id : admin.id,
    }, JWT_ADMIN_PASSWORD)
    res.json({
        message : token
    })
})
///Amin can create a course
adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price} = req.body

    const course = await courseModel.create({
        title : title,
        description : description,
        imageUrl : imageUrl,
        price : price,
        creatorId : adminId
    })
    res.json({
        message : "Course created",
        courseId : course._id
    })

})

///Admin can change the name/price of the course
adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id : courseId,
        creatorId : adminId
    }, {
        title : title,
        description : description,
        imageUrl : imageUrl,
        price : price,
        
    })

    res.json({
        message : "course updated",
        courseId : course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const course = await courseModel.find({
        creatorId : adminId
    });
    
    res.json({
        message : "Get all course",
        course : course._id
    })
})

module.exports = {
    adminRouter : adminRouter
}