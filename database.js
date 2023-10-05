import mysql from 'mysql2'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
}).promise()


export async function showAllUser(){
    const result = await pool.query("SELECT * FROM user")
    return(result[0])
}

export async function emailExisted(email){
    const result = await pool.query("select * from user where email = ?", [email])
    if(result[0].length > 0){
        return(true)
    }else{
        return(false)
    }
}

export async function createUser(name, email, password){
    const userAmount = await pool.query("select count(*) from user")
    const userId = userAmount[0][0]['count(*)'] + 1
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const result = await pool.query("insert into user (id, name, email, password) values (?, ?, ?, ?)", [userId, name, email, hashedPassword])
    
    return [userId, name, email]
    

}

export async function searchUser(id){
    const result = await pool.query("select * from user where id = ?", [id])
    return result[0]
}
