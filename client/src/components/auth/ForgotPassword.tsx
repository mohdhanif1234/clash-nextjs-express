'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitButton";
import { useFormState } from 'react-dom'
import { forgotPasswordAction } from "@/actions/authActions";
import { useEffect } from "react";
import { toast } from "sonner";

const ForgotPassword = () => {
    const initialState = {
        status: 0,
        message: "",
        errors: {},
    }

    const [state, formAction] = useFormState(forgotPasswordAction, initialState);

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
                    <SubmitButton />
                </div>

            </form>
        </>
    )
}

export default ForgotPassword
