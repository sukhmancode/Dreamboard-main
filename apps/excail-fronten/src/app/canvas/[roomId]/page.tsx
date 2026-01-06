import { CanvasCompo } from "@/app/components/RoomCanvas";

export default async function Canvas( {params}: {params:{roomId:string}}) {
    const roomId = (await params).roomId 
    //@ts-ignore
   return <CanvasCompo roomId ={roomId} />
}