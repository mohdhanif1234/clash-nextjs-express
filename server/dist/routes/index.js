import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import VerifyEmailRoutes from "./verify-email.routes.js";
const router = Router();
router.use("/api/auth", AuthRoutes);
router.use("/", VerifyEmailRoutes);
export default router;
