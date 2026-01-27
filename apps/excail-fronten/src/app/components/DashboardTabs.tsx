"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect,useState } from 'react';
import { Activity, JwtPayload, OverviewStats } from "@/types/type";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { HTTP_BACKEND } from "../../../config";
import { ProfileLogoutButton } from "../hooks/handleLogout";
import RoomJoinRequests from "./RoomJoinRequests";

type Room = {
  id:number,
  slug:string
}

export function DashboardTabs() {
  const [name, setName] = useState("Unknown");
  const [email,setEmail] = useState("");
  const [allRooms,setAllRooms] = useState<Room[]>([]);
  const [recent, setRecent] = useState<Activity[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [overviewLoading, setoverviewLoading] = useState(false);
  const [overviewStats,setOverviewStats] = useState<OverviewStats>({
    activeToday:0,
    totalRooms:0,
    messagesSent:0
  })
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setName(decoded.name);
      setEmail(decoded.email);
      getAllRoomsInfo();
      fetchRecent();
      fetchOverviewStats();

    } catch {
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [router]);

  const getAllRoomsInfo = async() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/");
        return;
      }
      const res = await axios.get(`${HTTP_BACKEND}/allRooms`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      const data = await res.data.allrooms;
      setAllRooms(data);
    }
    catch(err) {
      console.log(err);
    }
  }

  const fetchRecent = async() => {
    try {
      setRecentLoading(true)
      const token = localStorage.getItem("token");
      if (!token) {
        setRecentLoading(false);
        return;
      }

      const res = await axios.get(`${HTTP_BACKEND}/recent`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      
    setRecent(res.data.recent);
    }
    catch(err) {
      console.error("Failed to fetch recent activity", err);
    }
    finally {
      setRecentLoading(false);
    }
  }

  const fetchOverviewStats = async() => {
    try {
      setoverviewLoading(true);
      const token = localStorage.getItem("token");
      if(!token) {
        return;
      }
      const res = await axios.get(`${HTTP_BACKEND}/overview`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
    setOverviewStats(res.data);
    }
    catch(err) {
      console.log(err);
    }
    finally {
      setRecentLoading(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6">
      <Tabs defaultValue="overview" className="w-full" >
        <TabsList className="grid w-full grid-cols-4"  >
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="rooms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Rooms</TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recent</TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Profile</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Quick snapshot of your activity.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold">{overviewStats.totalRooms}</p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{overviewStats.activeToday}</p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-2xl font-bold">{overviewStats.messagesSent}</p>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALL ROOMS */}
        <TabsContent value="rooms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Rooms</CardTitle>
              <CardDescription>
                Rooms you created or joined.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* ROOM ITEM */}
              {
                allRooms.map((room) => (
                  <div className="flex items-center justify-between border rounded-lg p-3">
                  <div key={room.id}>
                    <p className="font-medium">{room.slug}</p>
                    <p className="text-sm text-muted-foreground">
                      Room ID: {room.id}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => router.push(`/canvas/${room.id}`)}>Open</Button>
                  <RoomJoinRequests roomId={room.id}/>
                </div>
                ))
              }
            </CardContent>

        
          </Card>
        </TabsContent>

        {/* RECENT */}
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {recentLoading && (
                <p className="text-sm text-muted-foreground">
                  Loading recent activity…
                </p>
              )}

              {!recentLoading && recent.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent activity yet.
                </p>
              )}

              {recent.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.time).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROFILE */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account information.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{email}</p>
              </div>
            </CardContent>

            <CardFooter>
                <ProfileLogoutButton/>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
