import { Router } from "express"
import AuthRoutes from "./auth.routes.js"

const router = Router();

router.use("/api/auth", AuthRoutes)

export default router