import express from 'express'
import { emailExisted, createUser, showAllUser, searchUser } from './database.js'

const app = express()
const PORT = 3000

//Regular expressions
const nameRegex = /^[a-zA-Z0-9]+$/
//Regex password
const uppercaseRegex = /[A-Z]/
const lowercaseRegex = /[a-z]/
const numberRegex = /[0-9]/
const symbolRegex = /[~`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/|]/
//Regex email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
//Regex request date
const dateRegex = /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{1,2})\s(\d{2}:\d{2}:\d{2})\s(\d{4})$/




app.use(express.json())

//Request headers middleware
const requestHeaders = (req, res, next) => {

    //驗證Request-Date格式
    if (req.headers['content-type'] == 'application/json') {
        if (dateRegex.test(req.headers['request-date'])) {
            next()
        } else {
            res.status(400).json({ message: "Invalid request date format." })
        }
    } else {
        res.status(400).json({ message: "Invalid content type." })
    }
}
app.use(requestHeaders)


app.get('/healthcheck', (req, res) => {
    res.send("OK")
})

app.get('/users/:id', async (req, res) => {
    const { id } = req.params
    const userData = await searchUser(id)
    if(userData.length > 0){
        res.status(200).json({
            "data":{
                "user":{
                    "id": userData[0].id,
                    "name": userData[0].name,
                    "email": userData[0].email
                },
                "request-date": req.headers['request-date']
            }
        })
    }else{
        res.status(403).json({"error":"User not existing."})
    }
    //console.log(await showAllUser())
    res.end()
})

app.post('/users', async (req, res) => {
    const { name, password, email } = req.body

    let userNameValidStatus = false
    let pwdValidStatus = false
    let emailValidStatus = false

    //驗證username格式
    userNameValidStatus = nameRegex.test(name)

    //驗證password格式
    let pwdValidCount = 0
    if (uppercaseRegex.test(password)) {
        pwdValidCount++
    }
    if (lowercaseRegex.test(password)) {
        pwdValidCount++
    }
    if (numberRegex.test(password)) {
        pwdValidCount++
    }
    if (symbolRegex.test(password)) {
        pwdValidCount++
    }
    if (pwdValidCount >= 3) {
        pwdValidStatus = true
    }

    //驗證email格式以及是否已經存在
    if (emailRegex.test(email)) {
        if (await emailExisted(email)) {
            console.log("Email already exists")
        } else {
            emailValidStatus = true
        }
    }

    if (userNameValidStatus && pwdValidStatus && emailValidStatus) {
        //執行database createUser
        const [ createdId, createdName, createdEmail ] = await createUser(name, email, password)
        res.status(200).json({
            "data": {
                "user": {
                    "id": createdId,
                    "name": createdName,
                    "email": createdEmail
                },
                "request-date": req.headers['request-date']
            }
        })

    } else {
        res.send("create failed")
    }
})



//測試用
app.post('/test', async (req, res) => {
    const { email } = req.body
    if (await emailExisted(email) > 0) {
        res.status(409).json({"error":"Email already exists."})
    } else {
        res.send("create success")
    }
})

app.listen(PORT, (err, res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})