import ForgotPasswordForm from "@/components/auth/ForgotPassword"

const ForgotPassword = () => {
  return (
    <div className="flex justify-center items-center h-screen">
    <div className="w-[550px] bg-white rounded-xl px-10 shadow-md py-5">
        <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Clash
        </h1>
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <p>Don't worry, it happens. Just enter your email and we will send you the password reset link.</p>
        <ForgotPasswordForm/>
       
    </div>
</div>
  )
}

export default ForgotPassword
