import { Tool } from "@/app/components/Canvas";
import { getExistingShapes } from "./existingShapes";

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
    points:{ x:number ; y:number } [];
    }
    
export class Game {
    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private roomId:string;
    socket:WebSocket;
    private clicked:boolean
    private startX = 0;
    private startY = 0;
    private selectedTool:Tool = "circle";
    private currentPencilPoints : {x:number;y:number}[] = [];


    private existingShapes:Shape[]
    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes =[];
        this.roomId = roomId;
        this.init();
        this.clicked = false;
        this.socket = socket
        this.initHandlers();
        this.initMouseHandlers();

    }

    destroy() {
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup",this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler)
    }

    setTool(tool:"circle"| "pencil" | "rect" | "eraser") {
        this.selectedTool = tool;
    }

   async init() {
        this.existingShapes = await getExistingShapes(this.roomId)
        this.clearCanvas()
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.type === "chat") {
                const parshedShape = JSON.parse(message.message);
                this.existingShapes.push(parshedShape.shapes);
                this.clearCanvas();
                
            }
        }
    }
    clearCanvas() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)"
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    
        this.existingShapes.map((shape) => {
            if(shape.type == "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)"
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
            }else if (shape.type === "circle") {
    
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
            }
            else if(shape.type === "pencil") {
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx.lineWidth = 2;
                this.ctx.lineCap = "round";

                this.ctx.beginPath();
                shape.points.forEach((point,idx) => {
                    if (idx === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.stroke();
            }
        })
    }

    mouseDownHandler =(e:MouseEvent) =>{
        this.clicked = true;
        this.startX = (e.clientX);
        this.startY = (e.clientY);

        if(this.selectedTool === "pencil") {
            this.currentPencilPoints = [{x:e.clientX,y:e.clientY}];
            this.ctx.beginPath();
            this.ctx.moveTo(e.clientX,e.clientY);
        }
    }
    mouseUpHandler =(e:MouseEvent) => {
        this.clicked = false;    
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const selectedTool = this.selectedTool;
        
        let shapes: Shape | null = null;
        if(selectedTool === "rect") {
            shapes = {
                type:"rect",
                x:this.startX,
                y:this.startY,
                height,
                width
            }
        }
        else if(selectedTool === "circle") {
            const radius = Math.max(width,height) / 2;

            shapes = {
                type:"circle",
                radius:radius,
                centerX:this.startX + radius,
                centerY:this.startY
            }
        }
        else if(selectedTool === "pencil") {
          shapes = {
                type:"pencil",
                points:this.currentPencilPoints
            }
            this.ctx.closePath();
        }
        if(!shapes) {
            return;
        }
        this.existingShapes.push(shapes)

   
        this.socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({
                shapes

            }),
            roomId:this.roomId
        }))
    }
    mouseMoveHandler = (e:MouseEvent) => {
        if(this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
             if(this.selectedTool === "pencil") {
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx.lineWidth = 2;
                this.ctx.lineCap = "round";
                this.ctx.lineTo(e.clientX,e.clientY);
                this.ctx.stroke();

                this.currentPencilPoints.push({
                    x:e.clientX,
                    y:e.clientY
                });
                return;
            }
            this.clearCanvas()
            this.ctx.strokeStyle = "rgba(255,255,255)"
            //@ts-ignore
            const selectedTool = this.selectedTool;

            if(selectedTool === "rect") {
                this.ctx.strokeRect(this.startX,this.startY,width,height)
            }
            else if(selectedTool === "circle") {
                const radius = Math.max(width,height) / 2;
                const centerX = this.startX+ radius ;
                const centerY = this.startY +radius ;
                this.ctx.beginPath();
                this.ctx.arc(centerX,centerY,Math.abs(radius),0,Math.PI * 2);
                this.ctx.stroke()
                this.ctx.closePath()
            }

            
        }
    }
    initMouseHandlers() {
        this.canvas.addEventListener("mousedown",this.mouseDownHandler)
        this.canvas.addEventListener("mouseup",this.mouseUpHandler)
        this.canvas.addEventListener("mousemove",this.mouseMoveHandler)
    }
}