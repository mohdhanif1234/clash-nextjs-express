import { Request, Response, Router } from "express";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validations/auth.validation.js";
import { ZodError } from "zod";
import { checkDateHourDiff, formatError, renderEmailEjs } from "../helper.js";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/EmailJob.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../config/rateLimit.js";

const router = Router();

// Register route
router.post("/register", authLimiter, async (req: Request, res: Response) => {
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
router.post("/login", authLimiter, async (req: Request, res: Response) => {
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
router.post("/check/credentials", authLimiter, async (req: Request, res: Response) => {
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

// Get User route
router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user;

  return res.json({
    data: user,
  });
});

// Forgot password route
router.post("/forgot-password", authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = forgotPasswordSchema.parse(body);

    // Check user
    let user = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    })

    if (!user || user === null) {
      return res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "No user found with this email."
        }
      })
    }

    const salt = await bcrypt.genSalt(10);
    const token = await bcrypt.hash(uuid4(), salt);
    await prisma.user.update({
      data: {
        password_reset_token: token,
        token_send_at: new Date().toISOString()
      },
      where: {
        email: payload.email
      }
    })

    const url = `${process.env.CLIENT_APP_URL}/reset-password?email=${payload.email}&token=${token}`;

    const html = await renderEmailEjs("forgot-password", { url });

    await emailQueue.add(emailQueueName, {
      to: payload.email,
      subject: "Reset your password",
      body: html
    });

    return res.json({ message: "Password reset link sent successfully. Please check your email." });

  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return res.status(422).json({ message: "Invalid Data", errors });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
})

// Reset password route
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = resetPasswordSchema.parse(body);

    // Check user
    let user = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    })

    if (!user || user === null) {
      return res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "Link is not correct. Make sure you copied the correct link."
        }
      })
    }

    // Check token
    if (user.password_reset_token !== payload.token) {
      return res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "Link is not correct. Make sure you copied the correct link."
        }
      })
    }

    // Check 2 hours time frame
    const hoursDiff = checkDateHourDiff(user.token_send_at!);

    if (hoursDiff > 2) {
      return res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "Password reset token got expired. Please send a new token."
        }
      })
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(payload.password, salt);

    await prisma.user.update({
      data: {
        password: newPass,
        password_reset_token: null,
        token_send_at: null
      },
      where: {
        email: payload.email
      }
    })

    return res.json({
      message:'Password reset is successful. Please try to login now.'
    })

  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return res.status(422).json({ message: "Invalid Data", errors });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
})

export default router;
