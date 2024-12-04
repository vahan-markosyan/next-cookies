export interface IUser{
    id:number
    name:string
    surname:string;
    login:string
    password:string
    attemps:number
    time:number
}

export type InputUser = Omit<IUser, 'id'| 'attemps'| 'time'>

export interface ISession{
    id:string
    user_id:number
    expires:number
}