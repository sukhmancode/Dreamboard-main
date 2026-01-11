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

export function DashboardTabs() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6">
      <Tabs defaultValue="overview" className="w-full" >
        {/* TABS HEADER */}
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
                <p className="text-2xl font-bold">12</p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">3</p>
              </Card>

              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-2xl font-bold">248</p>
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
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium">Design Discussion</p>
                  <p className="text-sm text-muted-foreground">
                    Room ID: 12
                  </p>
                </div>
                <Button size="sm">Open</Button>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium">Frontend Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Room ID: 8
                  </p>
                </div>
                <Button size="sm">Open</Button>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full">Create New Room</Button>
            </CardFooter>
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
              <div className="border rounded-lg p-3">
                <p className="font-medium">Joined “Design Discussion”</p>
                <p className="text-sm text-muted-foreground">
                  10 minutes ago
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">Sent a message</p>
                <p className="text-sm text-muted-foreground">
                  1 hour ago
                </p>
              </div>
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
                <p className="font-medium">Sukhman</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">sukh@gmail.com</p>
              </div>
            </CardContent>

            <CardFooter>
              <Button variant="destructive" className="w-full">
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
