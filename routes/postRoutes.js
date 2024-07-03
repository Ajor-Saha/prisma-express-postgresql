import { Router } from "express";
import { createPost, deletePost, fetchPosts, searchPost, showPost } from "../controllers/postController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/addpost", verifyJWT, createPost);
router.get("/search",  searchPost);
router.get("/:id", showPost);
router.delete("/:id", verifyJWT, deletePost);
router.get("/", fetchPosts);

export default router;