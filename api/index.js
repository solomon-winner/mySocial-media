import  express  from "express";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import relationRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import cookieParsor from "cookie-parser";
import cors from "cors";
import multer from "multer";

const app = express();

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true);
    next();
})

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(cookieParsor());
// app.use(express.urlencoded({ extended: true }));
///////////////////////////////////
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, Date.now() + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })


  app.post("/api/upload",upload.single("file"),(req,res) => {
    const file = req.file;
    res.status(200).json(file.filename);
  })
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/auth", authRoutes)
app.use("api/relationships",relationRoutes)
app.use("api/stories",storyRoutes)

app.listen(8800, ()=>{
    console.log("I am Comming!")
})