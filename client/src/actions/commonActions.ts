'use server'
import { revalidateTag } from "next/cache"

export const clearCache = async (tag: string) => {
    revalidateTag(tag)
}