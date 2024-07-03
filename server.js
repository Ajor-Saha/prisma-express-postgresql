import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";


const app = express();
const PORT = process.env.PORT || 4000;

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    return res.send("Hi Everyone.");
});
  
// * routes file
import userRouter from "./routes/userRoutes.js"
import postRouter from "./routes/postRoutes.js"
import commentRouter from "./routes/commentRoutes.js"

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));


/*
npx prisma migrate dev --name create_user_schema
 */