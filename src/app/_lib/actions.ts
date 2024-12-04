"use server"

import { redirect } from "next/navigation"
import { createSession, getSessionByToken, getUserByLogin, getUserByToken, insertUser, setLoginAttempts, updateLoginAttempts, updateSessionExpiration, updateTime } from "./model"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import { cookies } from "next/headers"
import { IUser } from "./types"

interface IState{
    message:string
}

export const handleSignup = async (prevState:IState,form:FormData) => {
    const name = form.get("name") as string
    const surname = form.get("surname") as string
    const login = form.get("login") as string
    let password = form.get("password") as string

    if(!name.trim() || !surname.trim() || !login.trim() || !password.trim()){
        return {message:"Please fill all the fields"}
    }

    if(password.length < 6){
        return {message:"Password is too short!!!"}
    }

    const found = getUserByLogin(login)
    if(found){
        return {message:"Login is busy!"}
    }

    password = await bcrypt.hash(password,10)

    const result = insertUser({login, password, name, surname})
    if(result.changes){
        return redirect("/")
    }else{
        return {message:"Internal server error!"}
    }
}

export const handleLogin = async(state:IState, form:FormData) => {
    const login = form.get("login") as string
    const password = form.get("password") as string
    const found = getUserByLogin(login)
    const blockDuration = 1 * 60 * 1000
    const currentTime = Date.now()

    if (found?.time && currentTime < found.time + blockDuration) {
        const remainingTime = Math.ceil((found.time + blockDuration - currentTime) / 1000)
        return {
            message: `Account is locked. Please try again after ${remainingTime} seconds.`
        }
    }
    if(!found) {
        return {message:"Wrong credentials"}
    }
    const result = await bcrypt.compare(password, found.password)


    let attemps = found.attemps || 0

    if(!result) {
        attemps++
        console.log(attemps)
        updateLoginAttempts(found.login, attemps)
        if(attemps >= 3){
            const lockTime = Date.now()
            updateTime(found.login,lockTime)      
            setLoginAttempts(found.login, 0)   
            return { message: "Account locked, please wait 1 minutes" }
        } 
    }
    

    

    if(!result) {
        return {message:"wrong credentials"}
    }
    const token = nanoid()
    createSession(found.id,token);
    (await cookies()).set("token",token)
    return redirect("/profile")
}

export const verifyUser = async () => {
        const token = (await cookies()).get("token")?.value
        if (!token) {
            return null
        }
        const user = getUserByToken(token);
        if (!user) {
            return null
        }
        const session = getSessionByToken(token)
        if (!session || session.expires < Date.now()) {
            return null
        }
        const newExpiration = Date.now() + 50_000
        updateSessionExpiration(token, newExpiration)
        return user as IUser
    } 

    export const logOut = async() => {
        (await cookies()).delete("token")
        return redirect("/login")
    }

    

