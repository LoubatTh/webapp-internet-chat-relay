import { Request, Response, response } from "express";

const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use("/hello", (req: Request, res: Response) => {
    res.send({message: "Hello World!"});
});

app.listen(5000, () => console.log('Server running on port 5000'));