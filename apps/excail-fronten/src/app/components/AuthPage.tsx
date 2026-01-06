"use client";
export function AuthPage({isSignIn} : {isSignIn:boolean}) {
    return (
        <div className="w-screen h-screen flex justify-center  items-center">
            <input type="text" name="" id="" placeholder="Email"/>
            <input type="password" name="" id="" placeholder="Password"/>
            <button className="cursor-pointer bg-red-400">{isSignIn ? "Sign In" : "Sign Up"}</button>
        </div>
    )
}