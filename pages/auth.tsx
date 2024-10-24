import { useCallback, useState } from "react";
import axios from "axios";
import Input from "@/components/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";


const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [variant, setVariant] = useState("login");

  const toggleVariant = useCallback(() => {
    setVariant((currVariant) =>
      currVariant === "login" ? "register" : "login"
    );
  }, []);

  // login function
  const login = useCallback(async () => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if(result?.error){
        console.log(result.error);
      }else{
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }, [email, password, router]);

  // register function
  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        password,
        username,
      });
      login();  // call login after registration
    } catch (err) {
      console.log(err);
    }
  }, [email, username, password , login]);

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="logo" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-bold">
              {variant === "login" ? "Sign in" : "Sign up"}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === "register" && (
                <Input
                  label="Username"
                  onChange={(e: any) => {
                    setUsername(e.target.value);
                  }}
                  id="username"
                  type="text"
                  value={username}
                />
              )}
              <Input
                label="Email"
                onChange={(e: any) => {
                  setEmail(e.target.value);
                }}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Password"
                onChange={(e: any) => {
                  setPassword(e.target.value);
                }}
                id="password"
                type="password"
                value={password}
              />
            </div>
            <button
              onClick={variant === "login" ? login : register}
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
            >
              {variant === "login" ? "Login" : "Get Started"}
            </button>
            <p className="text-neutral-500 mt-12">
              {variant === "login"
                ? "New to Netflix?"
                : "Already have an account ?"}
              <span
                onClick={toggleVariant}
                className="text-white ml-1 hover:underline cursor-pointer"
              >
                {variant === "login" ? "Sign up now." : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
