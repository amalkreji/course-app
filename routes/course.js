const { Router } = require("express");
const courseRouter = Router();


courseRouter.post("/purchase" ,function(req , res) {
    res.json({
        message : "s"
    })
})
courseRouter.get("/preview", function(req , res) {
    res.json({
        message : "s"
    })
})

module.exports = {
    courseRouter : courseRouter
}