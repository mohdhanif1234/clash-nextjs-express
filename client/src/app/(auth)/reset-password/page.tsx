import ResetPasswordForm from "@/components/auth/ResetPassword"

const ResetPassword = () => {
  return (
    <div className="flex justify-center items-center h-screen">
    <div className="w-[550px] bg-white rounded-xl px-10 shadow-md py-5">
        <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Clash
        </h1>
        <h1 className="text-3xl font-bold">Reset Password</h1>
        
        <ResetPasswordForm/>
       
    </div>
</div>
  )
}

export default ResetPassword
