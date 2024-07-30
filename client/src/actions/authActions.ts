"use server"
import { CHECK_CREDENTIALS_URL, LOGIN_URL, REGISTER_URL } from "@/lib/apiEndPoints"
import axios, { AxiosError } from "axios"

export const registerAction = async (prevState: any, formData: FormData) => {
    // console.log('Form data---', formData)
    try {
        const { data } = await axios.post(REGISTER_URL, {
            name: formData.get('name') === '' ? null : formData.get('name'),
            email: formData.get('email') === '' ? null : formData.get('email'),
            password: formData.get('password') === '' ? null : formData.get('password'),
            confirmPassword: formData.get('confirmPassword') === '' ? null : formData.get('confirmPassword'),
        });

        return {
            status: 200,
            message: data?.message ?? "Account created successfully. Please check and verify your email.",
            errors: {}
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 422) {
                return {
                    status: 422,
                    message: error.response?.data?.message,
                    errors: error.response?.data?.errors,
                }
            }
        }

        return {
            status: 500,
            message: 'Something went wrong. Please try again',
            errors: {}
        }
    }
}

export const loginAction = async (prevState: any, formData: FormData) => {
    try {
        const { data } = await axios.post(CHECK_CREDENTIALS_URL, {
            email: formData.get('email') === '' ? null : formData.get('email'),
            password: formData.get('password') === '' ? null : formData.get('password'),
        });

        return {
            status: 200,
            message: data?.message ?? "Logging you.",
            errors: {},
            data: {
                email: formData.get('email'),
                password: formData.get('password')
            }
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 422) {
                return {
                    status: 422,
                    message: error.response?.data?.message,
                    errors: error.response?.data?.errors,
                    data: {}
                }
            }
        }

        return {
            status: 500,
            message: 'Something went wrong. Please try again',
            errors: {},
            data: {}
        }
    }
}