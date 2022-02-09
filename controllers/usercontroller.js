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