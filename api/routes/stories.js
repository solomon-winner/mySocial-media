import express from "express";
import {getStory,addStory,deleteStory} from "../controllers/story.js"

const router = express.Router();

router.get("/",getStory);
router.post("/",addStory);
router.delete("/:id",deleteStory);

export default router;
