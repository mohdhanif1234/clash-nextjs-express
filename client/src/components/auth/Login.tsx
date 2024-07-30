'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SubmitButton } from "../common/SubmitButton";
import { useFormState } from 'react-dom'
import { loginAction } from "@/actions/authActions";
import { useEffect } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react"

const Login = () => {
    const initialState = {
        status: 0,
        message: "",
        errors: {},
        data: {}
    }

    const [state, formAction] = useFormState(loginAction, initialState);

    useEffect(() => {
        if (state.status === 422) {
            toast.error(state.message)
        }
        else if (state.status === 200) {
            toast.success(state.message)
            signIn("credentials", {
                email: state?.data?.email,
                password: state?.data?.password,
                redirect: true,
                callbackUrl: "/dashboard"
            })
        }
    }, [state])

    return (
        <>
            <form action={formAction}>
                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email..."
                    />
                    <span className="text-red-500">{state?.errors.email}</span>
                </div>

                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password..."
                    />
                    <span className="text-red-500">{state?.errors?.password}</span>

                    <div className="text-right font-bold">
                        <Link href={"/forgot-password"}>Forgot Password?</Link>
                    </div>
                </div>

                <div className="mt-4">
                    <SubmitButton />
                </div>

            </form>
        </>
    )
}

export default Login
