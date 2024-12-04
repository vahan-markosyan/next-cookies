import db from 'better-sqlite3'
import { InputUser, ISession, IUser } from './types'
const sql = new db('auth.db')

export const getUserByLogin = (login:string):(IUser|null) => {
    const user = sql.prepare("SELECT * FROM users where login = ?").get(login)
    if(user){
        return user as IUser
    }
    return null
}

export const getAllUsers = () => {
    return sql.prepare("SELECT * FROM users").all()
}

export const insertUser = (user:InputUser):db.RunResult => {
    return sql.prepare(`INSERT INTO users(name, surname, login, password)
                        VALUES(@name, @surname, @login, @password)                    
    `).run(user)
}

export const createSession = (user:number, token:string) => {
    return sql.prepare(`INSERT INTO session(id,user_id,expires)
        VALUES(?,?,?)`).run(token,user,Date.now()+50_000)
}

export const getUserByToken = (token: string) => {
    const selected = sql.prepare(`
        SELECT users.* 
        FROM session 
        JOIN users ON session.user_id = users.id
        WHERE session.id = ?
    `).get(token)
    if(selected) {
        return selected as IUser
    }
    return null
}

export const getSessionByToken = (token: string) => {
    const session = sql.prepare("SELECT * FROM session WHERE id = ?").get(token)
    if(session) {
        return session as ISession
    }
    return null
}

export const updateSessionExpiration = (token: string, newExpiration: number) => {
    sql.prepare(`
        UPDATE session 
        SET expires = ? 
        WHERE id = ?
    `).run(newExpiration, token)
}

export const updateLoginAttempts = (login: string, attemps: number) => {
    sql.prepare(`
        UPDATE users
        SET attemps = attemps + 1
        WHERE login = ?
    `).run(login)
}

export const setLoginAttempts = (login:string, attemps:number) => {
    sql.prepare(`
        UPDATE users
        SET attemps = ?
        WHERE login = ?
        `).run(attemps,login)
}

export const updateTime = (login:string, time:number) => {
    sql.prepare(`
        UPDATE users
        SET time = ?
        WHERE login= ?
        `).run(time, login)
}

