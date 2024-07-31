'use client'
import { resetPasswordAction } from "@/actions/authActions";
import { SubmitButton } from "@/components/common/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from 'react-dom'
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";

const ResetPassword = () => {
    const initialState = {
        status: 0,
        message: "",
        errors: {
        }
    }

    const [state, formAction] = useFormState(resetPasswordAction, initialState);

    const searchParams = useSearchParams()

    const router = useRouter()

    useEffect(() => {
        if (state.status === 422) {
            toast.error(state.message)
        }
        else if (state.status === 200) {
            toast.success(state.message)
            router.replace("/login")
        }
    }, [state])

    return (
        <>
            <form action={formAction}>

                <input
                    type="hidden"
                    name="token"
                    value={searchParams.get("token") ?? ""}
                />
                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email..."
                        readOnly
                        value={searchParams.get("email") ?? ""}
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

export default ResetPassword
