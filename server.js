const express = require("express");
const cors = require("cors");
const userRouter = require('./routes/user_routes');
const {connectMongoDb} = require('./views/connection.js');
const {logReqRes, isTokenValid} = require('./middlewares/middlewares.js');
const app = express();

connectMongoDb("mongodb://localhost:27017/rawan").then(() => {console.log("Connected to MongoDB")});
app.use(cors());
const port = 8000;
app.use(express.json());


app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"),isTokenValid);

//routers
app.use("/user",userRouter); 


app.listen(port, "192.168.1.32", () =>
  console.log(`Server started at port ${port}`)
);
