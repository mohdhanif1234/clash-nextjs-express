import { Router } from "express"
import AuthRoutes from "./auth.routes.js"
import VerifyEmailRoutes from "./verify-email.routes.js"
import ClashRoutes from './clash.routes.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/api/auth", AuthRoutes)
router.use("/", VerifyEmailRoutes)
router.use('/api/clash', authMiddleware, ClashRoutes)

export default router