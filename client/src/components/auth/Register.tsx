'use client'
import { registerAction } from "@/actions/authActions";
import { SubmitButton } from "@/components/common/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from 'react-dom'
import { useEffect } from "react";
import { toast } from "sonner";

const Register = () => {
    const initialState = {
        status: 0,
        message: "",
        errors: {
        }
    }

    const [state, formAction] = useFormState(registerAction, initialState);

    useEffect(() => {
        if (state.status === 422) {
            toast.error(state.message)
        }
        else if (state.status === 200) {
            toast.success(state.message)
        }
    }, [state])

    return (
        <>
            <form action={formAction}>
                <div className="mt-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name..."
                    />

                    <span className="text-red-500">{state?.errors.name}</span>
                </div>

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
                    <span className="text-red-500">{state?.errors.password}</span>
                </div>

                <div className="mt-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password..."
                    />
                    <span className="text-red-500">{state?.errors.confirmPassword}</span>
                </div>

                <div className="mt-4">
                    <SubmitButton />
                </div>
            </form>
        </>
    )
}

export default Register
