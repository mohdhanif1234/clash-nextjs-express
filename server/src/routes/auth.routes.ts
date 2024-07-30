import { Request, Response, Router } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { ZodError } from "zod";
import { formatError, renderEmailEjs } from "../helper.js";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/EmailJob.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Register route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const payload = registerSchema.parse(body);

    let user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (user) {
      return res.status(422).json({
        errors: {
          email: "Email already taken. Please use another one.",
        },
      });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    const token = await bcrypt.hash(uuid4(), salt);
    const url = `${process.env.APP_URL}/verify-email?email=${payload.email}&token=${token}`;
    const emailBody = await renderEmailEjs("email-verify", {
      name: payload.name,
      url: url,
    });

    // Send email
    await emailQueue.add(emailQueueName, {
      to: payload.email,
      subject: "Clash email verification",
      body: emailBody,
    });

    await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        email_verify_token: token,
      },
    });

    return res.json({
      message: "Please check your email. We have sent you a verfication email.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return res.status(422).json({ message: "Invalid Data", errors });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = loginSchema.parse(body);

    // Check email
    let user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user || user === null) {
      return res.status(422).json({
        errors: {
          email: "No user found with this email.",
        },
      });
    }

    // Check Password
    const passwordsMatch = await bcrypt.compare(
      payload.password,
      user.password
    );

    if (!passwordsMatch) {
      return res.status(422).json({
        errors: {
          email: "Invalid credentials.",
        },
      });
    }

    // JWT payload
    let jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "365d",
    });

    return res.json({
      message: "Logged in successfully",
      data: {
        ...jwtPayload,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return res.status(422).json({ message: "Invalid Data", errors });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// Login check route
router.post("/check/credentials", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = loginSchema.parse(body);

    // Check email
    let user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user || user === null) {
      return res.status(422).json({
        errors: {
          email: "No user found with this email.",
        },
      });
    }

    // Check Password
    const passwordsMatch = await bcrypt.compare(
      payload.password,
      user.password
    );

    if (!passwordsMatch) {
      return res.status(422).json({
        errors: {
          email: "Invalid credentials.",
        },
      });
    }

    return res.json({
      message: "Logged in successfully",
      data: {
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return res.status(422).json({ message: "Invalid Data", errors });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});

// Get User
router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user;

  return res.json({
    data: user,
  });
});

export default router;
