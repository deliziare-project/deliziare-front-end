
export const findOnlineUsers=(onlineUsers:string[],userid:string)=>{
return onlineUsers.filter((val)=>val!==userid)
}