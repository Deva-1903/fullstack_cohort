// Four main operation (CRUD)
// 1. read - find, findById, findOne - db.users.find({})
// 2. write - create, insert(db query)
// 3. update - update, updateOne
// 4. delete - delete, deleteMany
const mongoose = require("mongoose");
const express = require("express")
const app = express()
app.use(express.json())
const PORT = 3000
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = 'avc133'

const connectDB = require('./config/db')

connectDB();

const userSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String }
});

const postSchema = mongoose.Schema({
    name: { type: String },
    caption: { type: String }
});

const Users = mongoose.model("users", userSchema);
const Posts = mongoose.model("posts", postSchema);

const authMiddleware = async(req, res, next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1]
    
    let decoded = jwt.verify(token, SECRET)

    const { email, password } = decoded
    
    if(!email || !password) {
        return res.status(400).json({
            message: "Unauthorized"
        })
    }

    const isExist = await Users.findOne({ email })


    if(!isExist) {
        return res.status(400).json({
            message: "User with this email already exists"
        })
    }

    const isValidPass = await bcrypt.compare(password, isExist.password)

    if(!isValidPass) {
        return res.status(400).json({
            message: "Please check your password"
        })
    }

    req.user = decoded
    next();
  }catch(e) {
      res.status(400).json({
          message: "Unauthorized"
      })
  }
}

// to create user
app.post('/register', async (req, res) => {
  try {
    const { email: inputEmail, password: inputPassword } = req.body;

   

    if(!inputEmail || !inputPassword) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }

    

    // check for dup emails
    const isExist = await Users.findOne({ email: inputEmail })


    if(isExist) {
        return res.status(400).json({
            message: "User with this email already exists"
        })
    }


    const hashedPass = await bcrypt.hash(inputPassword, 10)


    // insert user in users object
    let verify = await Users.create({ email: inputEmail, password: hashedPass })

    if(!verify) {
        return res.status(400).json({
            message: "Error in saving the user"
        })
    }

    res.status(200).json({
        message: "Successful"
    })
  } catch (e) {
      res.status(400).json({
        message: e
    })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email: inputEmail, password: inputPassword } = req.body;

    if(!inputEmail || !inputPassword) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }

    // check for dup emails
    const isExist = await Users.findOne({ email: inputEmail })

    if(!isExist) {
        return res.status(400).json({
            message: "User with this email already exists"
        })
    }

    const isValidPass = await bcrypt.compare(inputPassword, isExist.password)

    if(!isValidPass) {
        return res.status(400).json({
            message: "Please check your password"
        })
    }

    const token = jwt.sign({ email: inputEmail, password: inputPassword }, SECRET)

    console.log(inputEmail)
    
    res.status(200).json({
        message: "Successful",
        token,
    })
  } catch (e) {
      res.status(400).json({
        message: e
    })
  }
})

app.get('/posts', authMiddleware,  async (req, res) => {

  const userEmail = req.user.email;

  const posts = await Posts.find({})
   
    return res.status(200).json({
      email: userEmail,
      posts: posts
    })
})

app.post('/posts', authMiddleware,  async (req, res) => {

  const { name, caption } = req.body

  const userEmail = req.user.email;

  const posts = await Posts.create({ name, caption })
   
  return res.status(200).json({
    posts
  })
})

app.listen(PORT, () => {
    console.log(`PORT ${PORT}`)
})