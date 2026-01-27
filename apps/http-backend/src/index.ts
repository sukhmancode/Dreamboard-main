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

app.get("/room/:id/access",middleware,async(req,res) => {
    const roomId = Number(req.params.id);
    //@ts-ignore
     const userId = req.userId;

     if(isNaN(roomId)) {
        return res.status(400).json({
            message:"Invalid room id"
        })
     }

     const room  = await prisma.room.findFirst({
        where: {
            id:roomId,
            OR: [
               { adminId:userId },
               {
                members: {
                    some: {userId}
                }
               }
            ]
        }   
     })
     if(!room) {
        return res.status(403).json({
            message:"You do not have access to this channel"
        })
     }

     res.json({
        allowed:true
     })
})

app.get("/chats/:roomId",middleware,async(req,res) => {
    const roomId = Number(req.params.roomId);
      //@ts-ignore
  const userId = req.userId;

  
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      OR: [
        { adminId: userId },
        { members: { some: { userId } } },
      ],
    },
  });

  if (!room) {
    return res.status(403).json({ message: "Access denied" });
  }
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
app.post("/room/request-join",middleware,async(req,res) => {
    const {roomId} = req.body;
    //@ts-ignore
    const userId = req.userId;
    
    const room = await prisma.room.findUnique({
        where: {id:Number(roomId)}
    })
    if(!room) {
        return res.status(404).json({ message: "Room not found" });
    }

    if(room.adminId === userId) {
        return res.status(400).json({ message: "You own this room" });
    }

    const joinRequest = await prisma.roomJoinRequest.upsert({
        where: {
            roomId_userId: {
                roomId:Number(roomId),
                userId
            }
        },
        update: {status:"pending"},
        create: {
            roomId:Number(roomId),
            userId,
            status:"pending"
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
          },
      
    })

    res.json({success:true})
})

app.get("/room/:id/requests",middleware,async(req,res) => {
    const roomId = Number(req.params.id);
    //@ts-ignore
    const userId = req.userId

    const room = await prisma.room.findFirst({
        where: { id: roomId, adminId: userId },
      })
    
    if (!room) {
         return res.status(403).json({ message: "Not allowed" });
    }
    const requests = await prisma.roomJoinRequest.findMany({
        where:{roomId,status:"pending"},
        include: {
            user: {select:{
                id:true,
                name:true,
                email:true
            }}
        }
    })
    res.json({requests})
})

app.post("/room/handle-request",middleware,async(req,res) => {
    const {requestId,action} = req.body;
    //@ts-ignore
    const userId = req.userId
    
    const request = await prisma.roomJoinRequest.findUnique({
        where:{id:requestId},
        include:{room:true}

        
    })
    if (!request || request.room.adminId !== userId) {
        return res.status(403).json({ message: "Not allowed" });
      }

    if(action === "accept") {
        await prisma.roomMember.create({
            data: {
                roomId:request.roomId,
                userId:request.userId,
                role:"editor"
            }
        })
        await prisma.roomJoinRequest.update({
            where: { id: requestId },
            data: { status: "accepted" },
          });   
    }
    if (action === "reject") {
        await prisma.roomJoinRequest.update({
          where: { id: requestId },
          data: { status: "rejected" },
        });
    }
    res.json({success:true})
})
app.get("/allRooms",middleware,async(req,res) => {
    //@ts-ignore
    const userId = req.userId;

    const allrooms = await prisma.room.findMany({
        where:{adminId:userId}
    });
    res.json({allrooms})
})

app.get("/room/:id/role",middleware,async(req,res) => {
    const roomId = Number(req.params.id);
    //@ts-ignore
    const userId = req.userId;

    const room = await prisma.room.findUnique({
        where:{
            id:roomId
        }
    })
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
    
      if (room.adminId === userId) {
        return res.json({ role: "admin" });
      }

      const member = await prisma.roomMember.findUnique({
        where:{
            roomId_userId: {
                roomId,
                userId
            }
        }
      })
      if(member) {
        return res.json({
            role:member.role
        })
      }
      return res.status(403).json({ message: "No access" });
})

app.get("/room/:id/members",middleware,async(req,res) => {
    const roomId = Number(req.params.id);
    //@ts-ignore
    const userId = req.userId;

    const room = await prisma.room.findFirst({
        where: {
            id:roomId,
            OR: [
                {adminId:userId},
                {members:{some:userId}}
            ]
        }
    })
    if (!room) {
        return res.status(403).json({ message: "Access denied" });
      }

      const members = await prisma.roomMember.findMany({
        where: { roomId },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });
    
      res.json({ members });
})

app.get("/rooms/joined",middleware,async(req,res) => {
    //@ts-ignore
    const userId = req.userId;

    const rooms = await prisma.roomMember.findMany({
        where: {
            userId
        },include: {room:true}
    });

    res.json({
        rooms:rooms.map(r => r.room)
    })
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