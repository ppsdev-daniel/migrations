"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
const API_PORT = 3232;
app_1.default.get("/", async (req, res) => {
    try {
        const result = await db_1.db.select("*").from("random_table");
        console.log(result);
        return res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("internal server error");
    }
});
app_1.default.listen(API_PORT, (err) => {
    if (err)
        console.error(err);
    console.log("listening at", API_PORT);
});
