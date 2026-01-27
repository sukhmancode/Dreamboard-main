import axios from "axios";
import { HTTP_BACKEND } from "../../config";

export async function getExistingShapes(roomId:string) {
    const token = localStorage.getItem("token");
    const res = await  axios.get(`${HTTP_BACKEND}/chats/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    const messages = res.data.messages;
    const shapes = messages.map((x: {message:string}) => {
    const messageData = JSON.parse(x.message)
    return messageData.shapes; 
})
    return shapes;
 }