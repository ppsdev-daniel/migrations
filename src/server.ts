import app from './app'
import { db } from "./db";

const API_PORT = 3232

app.get("/", async (req, res): Promise<any> => {
    try {

        const result = await db.select("*").from("random_table")
        console.log(result)
        return res.status(200).json(result)
    }catch (err) {
        console.log(err)
        return res.status(500).send("internal server error")
    }
})

app.listen(API_PORT, (err) => {
    if (err)
        console.error(err)
    console.log("listening at", API_PORT)
})
