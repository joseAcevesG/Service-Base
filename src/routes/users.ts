import usersControllers from "../controllers/users.controllers";

import { Router } from "express";
const router = Router();

router.get("/", usersControllers.getAll);
router.get("/:id", usersControllers.get);
router.post("/", usersControllers.create);
router.put("/:id", usersControllers.update);
router.delete("/:id", usersControllers.delete);
router.get("/call/:id", usersControllers.callUser);

export default router;
