import User from "./models/User.js"
import bcrypt from 'bcrypt'
import connectToDatabase from "./db/db.js"

const userRegister = async () => {
    connectToDatabase()

    try{

        const hashPassword = await bcrypt.hash("admin" , 10)
        const newUser = new User({
            id:1212343456,
            name : "Damo",
            email:"projectdamo1@gmail.com",
            password:hashPassword,
            role:"admin"
        })

    }catch(error){
        console.log(error)
    }

}

userRegister();