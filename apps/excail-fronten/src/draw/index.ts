import axios from "axios";
import { HTTP_BACKEND } from "../../config";

type Shape =  {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} | {
    type:"circle",
    centerX:number,
    centerY:number,
    radius:number
} | {
    type:"pencil",
    startX:number,
    startY:number,
    endX:number,
    endY:number,

    }
export async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
    const ctx = canvas.getContext("2d")

    //@ts-ignore
    let existingShapes: Shape[] = await getExistingShapes(roomId);
    if(!ctx) {
        return;
    }
    


    clearCanvas(existingShapes,canvas,ctx)
    let clicked = false;
    let startX = 0;
    let startY  = 0;


}

function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D) {

}

