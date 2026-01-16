
export type JwtPayload = {
    userId: string;
    name: string;
    email:string
  };
  
export type Activity = {
  label:string,
  time:string
}

export type OverviewStats = {
  totalRooms: number;
  activeToday: number;
  messagesSent: number;
};