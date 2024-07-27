const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())

const PORT = 8080
// {"deva@gmail.com": "password", ...}
const users = {}
const posts = ['post1', 'post2', 'post3']
const SECRET = 'abc123'

// register user in the users db
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }

    // check for dup emails
    const isExist = users.hasOwnProperty(email)

    if(isExist) {
        return res.status(400).json({
            message: "User with this email already exists"
        })
    }

    const hashedPass = await bcrypt.hash(password, 10)

    // insert user in users object
    users[email] = hashedPass

    let verify = users[email]

    if(!verify) {
        return res.status(400).json({
            message: "Error in saving the user"
        })
    }

    res.status(200).json({
        message: "Successful"
    })
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }

    // check for dup emails
    const isExist = users.hasOwnProperty(email)

    if(!isExist) {
        return res.status(400).json({
            message: "Please register first"
        })
    }

    const isValidPass = await bcrypt.compare(password, users[email])

    console.log(isValidPass)

    if(!isValidPass) {
        return res.status(400).json({
            message: "Please check your password"
        })
    }

    const token = jwt.sign({ email, password }, SECRET)
    
    res.status(200).json({
        message: "Successful",
        token,
    })
})

app.get('/posts', async (req, res) => {
    const token = req.headers['authorization'].split(" ")[1]

    let decoded
    try {
        decoded = jwt.verify(token, SECRET)
    } catch(e) {
        res.status(400).json({
            message: "Unauthorized"
        })
    }

    console.log(decoded)

    const { email, password } = decoded
    
    if(!email || !password) {
        return res.status(400).json({
            message: "Unauthorized"
        })
    }

    const isExist = users.hasOwnProperty(email)

    const isValidPass = await bcrypt.compare(password, users[email])

    if(!isValidPass) {
        return res.status(400).json({
            message: "Unauthorized"
        })
    }

    if(!isExist) {
        return res.status(403).json({
            message: "Please register first"
        })
    }
    
    return res.status(200).json({
        posts
    })
})

app.listen(PORT, () => {
    console.log(`PORT ${PORT}`)
})