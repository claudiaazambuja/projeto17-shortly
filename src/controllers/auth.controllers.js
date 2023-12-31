import { v4 as uuid } from "uuid"
import bcrypt from "bcrypt"
import { loginSucess, queryEmail, users } from "../repositories/auth.repositories.js"

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match")
  }
    try {
        const hash = bcrypt.hashSync(password, 10)
        await users(name, email, hash)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
            const user = await queryEmail(email)
            const token = uuid();
            const userID = user.rows[0].user_id
        
            await loginSucess(userID, token)
            res.status(200).send({ token })

    } catch (err) {
        res.status(500).send(err.message)
    }
    }