const express = require("express");
const mongoose = require("mongoose")
const { userRouter } = require("./routes/user")
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin")
const app = express();

app.use(express.json())
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/admin", adminRouter)

const startServerDatabase = async() => {
    try {
        await mongoose.connect("")

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    });
    console.log("Database is connected successffully"); 
} catch (error) {
    console.error("DataBase not connected", error);
    process.exit(1)
}
}
startServerDatabase()




