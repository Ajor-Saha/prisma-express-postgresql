import { Router } from "express";
import { createComment, deleteComment, fetchComments, showComment } from "../controllers/commentController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();


router.post("/addcomment", verifyJWT, createComment);
router.get("/:postId", fetchComments);
router.get("/:id", showComment);
router.delete("/:id", verifyJWT, deleteComment);

export default router;