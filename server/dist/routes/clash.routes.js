import { Router } from "express";
import { ZodError } from "zod";
import { formatError, imageValidator, removeImage, uploadFile } from "../helper.js";
import { clashSchema } from "../validations/clash.validation.js";
import prisma from "../config/database.js";
const router = Router();
// Create user clash
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        body.title = body.title === '' ? null : body.title;
        body.description = body.description === '' ? null : body.description;
        body.expires_at = body.expires_at === '' ? null : body.expires_at;
        const payload = clashSchema.parse(body);
        // Check if files exist
        if (req.files?.image) {
            const image = req.files?.image;
            const validMsg = imageValidator(image.size, image.mimetype);
            if (validMsg) {
                return res.status(422).json({ errors: { image: validMsg } });
            }
            payload.image = await uploadFile(image);
        }
        else {
            return res.status(422).json({ errors: { message: "Image field is required" } });
        }
        const response = await prisma.clash.create({
            data: {
                ...payload,
                user_id: req.user?.id,
                image: payload.image,
                expires_at: new Date(payload.expires_at)
            }
        });
        return res.json({ message: "Clash created successfully" });
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errors = formatError(error);
            return res.status(422).json({ message: "Invalid Data", errors });
        }
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again." });
    }
});
// Get user clashes
router.get("/", async (req, res) => {
    try {
        const clash = await prisma.clash.findMany({
            where: {
                user_id: req.user?.id
            },
            orderBy: {
                id: "desc"
            }
        });
        return res.json({ message: "Clashes fetched successfully", data: clash });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
});
// Get user clashes by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const clash = await prisma.clash.findUnique({
            where: {
                id: Number(id)
            },
        });
        return res.json({ message: "Clashes fetched successfully", data: clash });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
});
// Update clash meta data
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const payload = clashSchema.parse(body);
        // Check if files exist
        if (req.files?.image) {
            const image = req.files?.image;
            const validMsg = imageValidator(image.size, image.mimetype);
            if (validMsg) {
                return res.status(422).json({ errors: { image: validMsg } });
            }
            // Get old image name
            const clash = await prisma.clash.findUnique({
                select: {
                    image: true,
                    id: true
                },
                where: {
                    id: Number(id)
                }
            });
            if (clash) {
                removeImage(clash?.image);
            }
            payload.image = await uploadFile(image);
        }
        const response = await prisma.clash.update({
            where: {
                id: Number(id)
            },
            data: {
                ...payload,
                expires_at: new Date(payload.expires_at)
            }
        });
        return res.json({ message: "Clash updated successfully" });
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errors = formatError(error);
            return res.status(422).json({ message: "Invalid Data", errors });
        }
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again." });
    }
});
// Delete a clash
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Get old image name
        const clash = await prisma.clash.findUnique({
            select: {
                image: true,
                id: true
            },
            where: {
                id: Number(id)
            }
        });
        if (clash) {
            removeImage(clash?.image);
        }
        await prisma.clash.delete({
            where: {
                id: Number(id)
            },
        });
        return res.json({ message: "Clash deleted successfully", data: {} });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
});
export default router;
