import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const Register = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] bg-white rounded-xl px-10 shadow-md py-5">
        <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <h1 className="text-3xl font-bold">Register</h1>
        <p>Welcome Back</p>

        <form>
          <div className="mt-4">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name..."
            ></Input>
          </div>

          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email..."
            ></Input>
          </div>

          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password..."
            ></Input>
          </div>

          <div className="mt-4">
            <Label htmlFor="cpassword">Confirm Password</Label>
            <Input
              type="password"
              id="cpassword"
              name="cpassword"
              placeholder="Confirm your password..."
            ></Input>
          </div>

          <div className="mt-4">
            <Button className="w-full">Submit</Button>
          </div>
        </form>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <strong>
            <Link href={"/login"}>Login</Link>
          </strong>
        </p>
      </div>
    </div>
  );
};

export default Register;
