export type ClashFormType = {
    title?: string
    description?: string
}

export type ClashFormErrorType = {
    title?: string
    description?: string
    expires_at?: string
    image?: string
}

export type ClashType = {
    id: number
    user_id: number
    title: string
    description: string
    image: string
    expires_at: string
    created_at: string
}