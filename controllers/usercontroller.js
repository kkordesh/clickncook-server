const router = require("express").Router()
const { UserModel } = require("../model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/login", async (req, res) => {
    
    let { email, password } = req.body
    try {
        const loginUser = await UserModel.findOne({
            where: { email }
        })

        if (loginUser) {
            let pwdCompare = await bcrypt.compare(password, loginUser.password)

            if (pwdCompare) {
                let token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: 60 * 60 * 24}
                )

                res.status(200).json({
                    message: `User logged in`,
                    user: loginUser,
                    token: token
                })
            }
        } else {
            res.status(401).json({
                messsage: `Incorrect Email or Password`
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err
        })
    }
})

module.exports = router
router.post("/register", async (req, res) => {

    const { firstName, lastName, email, password } = req.body

    try {
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 10),
        })
        
        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: 60 * 60 * 24 }
        )

        res.status(201).json({
            message: "User created",
            user: newUser,
            token
        })

    } catch(err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            res.status(409).json({
                message: `Email already in use.`
            })
        } else {
            res.status(500).json({
                message: `You don' messed up and I don't know where.`,
                error: err
            })
        }
    }
})

module.exports=router;
