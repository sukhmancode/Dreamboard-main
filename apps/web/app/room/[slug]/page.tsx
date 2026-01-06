import axios from 'axios';
import React from 'react'
import { BACKEND_URL } from '../../config';
import { ChatRoom } from '../../../components/ChatRoom';

async function GetRoomId(slug:string) {
   const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
   return response.data.room.id
}

export default async function RoomWithId ({params}:
   {params: {
    slug:string
}})  {
  const slug = params.slug;
  const roomId = await GetRoomId(slug)

  return <ChatRoom id={roomId}></ChatRoom>
}
