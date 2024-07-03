import { Router } from "express";
import {
    createUser,
    deleteUser,
    fetchUsers,
    loginUser,
    logoutUser,
    showUser,
    updateUser
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/adduser", createUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/", fetchUsers);
router.get("/:id", showUser);
router.put("/update", verifyJWT,updateUser);
router.delete("/delete", verifyJWT,  deleteUser);

export default router;