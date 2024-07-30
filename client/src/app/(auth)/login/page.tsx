import LoginForm from "@/components/auth/Login";
import Link from "next/link";

const Login = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-[550px] bg-white rounded-xl px-10 shadow-md py-5">
                <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
                    Clash
                </h1>
                <h1 className="text-3xl font-bold">Login</h1>
                <p>Welcome Back</p>
                <LoginForm/>
                <p className="text-center mt-2">Don't have an account? <strong><Link href={"/register"}>Register</Link></strong></p>
            </div>
        </div>
    );
};

export default Login;
