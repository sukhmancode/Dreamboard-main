"use client";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { log } from "console";
import axios from "axios";
import { JwtPayload } from "@/types/type";

export function AuthTabs() {
  const router = useRouter();
 

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [tab,setTab] = useState<"register" | "login"> ("login");

  const [name, setName] = useState(""); 
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async() => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`http://localhost:3001/signin`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username:email,
          password:password
        })
      }) 
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      
    const data = await res.json();
    localStorage.setItem("token", data.token);

    router.push("/dashboard");
    }
    catch(err:any) {
      console.log(err.message);
      setError("Login failed");
      
    }
    finally{
      setLoading(false)
    }
  }


  const handleRegister = async() => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("http://localhost:3001/signup",{
      username:registerEmail,password:registerPassword,name:name})

      setName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setTab("login");
    }
    catch(err:any) {
      console.log(err.message);
      setError("Registration failed");
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "login" | "register");
          setError(null);
        }}
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* LOGIN TAB */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>

            <CardFooter>
            <Button disabled={loading}
            onClick={handleLogin}>
              {loading ? "Please wait..." : "Login"}
            </Button>
                {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* REGISTER TAB */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Create a new account to get started.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="register-name">Name</Label>
                <Input
                  id="register-name"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" disabled={loading  } onClick={handleRegister}>Create Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}