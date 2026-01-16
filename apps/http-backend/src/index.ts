import express from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET } from '@repo/backend-common/config'
import { middleware } from './middleware.js';
import { CreateUserSchema,SignInSchema,CreateRoomSchema  } from '@repo/common/types';
import { prisma } from '@repo/db/client'
import bcrypt from 'bcrypt'
import cors from "cors"

const saltRounds = 10;
const app = express();
app.use(express.json())
app.use(cors())

app.post("/signup",async(req,res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message:"incorrect inputs"
        })
        return;
    }
    try {
    const hashedPassword = await bcrypt.hash(data.data.password,saltRounds);
      const user =  await prisma.user.create({
            data: { 
                email:data.data.username,
                password:hashedPassword as unknown as string,
                name:data.data.name
            }
        })
        res.json({
            userId:user.id
        })
    }
    catch(er) {
        res.status(411).json({
            message:"user already exists"
        })
    }
})


app.post("/signin",async(req,res) => {
    const data = SignInSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    const user = await prisma.user.findFirst({
        
        where: {
            email:data.data.username,
        }
    })
    if(!user) {
        res.status(411).json({
            message:"not authorized"
        })
        return;
    }
    const isPasswordValid = await bcrypt.compare(data.data.password,user?.password)

    if (!isPasswordValid) {
        return res.status(411).json({ message: "Not authorized" });
    }

    const token = jwt.sign({
        userId:user?.id,
        name:user.name,
        email:user.email
    },JWT_SECRET)
    res.json({
        token
    })
})


app.post("/room",middleware,async(req,res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message:"incorrect inputs"
        })
    return
    }
    //@ts-ignore
    const userId = req.userId;

    try {
        const room = await prisma.room.create({
            data: {
                slug:data.data.name,
                adminId:userId
            }
        })
        res.json({
            roomId:room.id
        })
    }
    catch(e) {
        res.status(411).json({
            message:"room already exists"
        })
    }
})

app.get("/chats/:roomId",async(req,res) => {
    const roomId = Number(req.params.roomId);
  const messages =  await prisma.chat.findMany({
        where: {
            roomId:roomId
        },
        orderBy: {
            id:"desc"
        },
        take:50
    })
    res.json({messages})
})


app.get("/room/:slug",async(req,res) => {
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where: {
            slug
        }
    })
    res.json({
        room
    })
})
app.get("/allRooms",middleware,async(req,res) => {
    //@ts-ignore
    const userId = req.userId;

    const allrooms = await prisma.room.findMany({
        where:{adminId:userId}
    });
    res.json({allrooms})
})

app.get("/recent",middleware,async(req,res) => {
    //@ts-ignore
    const userId = req.userId;

    const rooms =  await prisma.room.findMany({
        where:{adminId:userId},
        orderBy : {createdAt:"desc"},
        take:5
    })

    const chats = await prisma.chat.findMany({
        where: { userId },
        
        take: 5,
        include: {
          room: true,
        },
    })

    const recent = [
        ...rooms.map(r => ({
          label: `Created room “${r.slug}”`,
          time: r.createdAt,
        })),
        ...chats.map(c => ({
          label: `Sent a message in “${c.room.slug}”`,
          //@ts-ignore
          time: c.createdAt,
        })),
      ]
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 10);
    
      res.json({ recent });
})

app.get("/overview",middleware,async(req,res) => {
    //@ts-ignore
    const userId = req.userId;  
    const today = new Date();
    today.setHours(0,0,0,0);
    const totalRooms = await prisma.room.count({
        where: { adminId: userId },
      });

    const activeToday = await prisma.chat.count({
        where:{
            userId,
            createdAt: {
                gte:today
            }
        }
    })
    const messagesSent = await prisma.chat.count({
        where: { userId },
      });

      res.json({
        activeToday,messagesSent,totalRooms
      })
})
app.listen(3001,() => {
    console.log("app is listening at 3001");
})