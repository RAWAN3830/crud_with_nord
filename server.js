const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
let users = require("./mock_tasks.json");
const { type } = require("os");
const { timeStamp } = require("console");
const cors = require("cors");
const jwt  = require("jsonwebtoken")
const path = require("path")


const app = express();
app.use(cors());
const port = 8000;

//Connection
mongoose
  .connect("mongodb://localhost:27017/rawan")
  .then(() => console.log("mongodb connected to rawan"))
  .catch((err) => console.log("mongo error at rawan"));

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      validate: {
        validator: () => Promise.resolve(false),
        message: "Username is required",
        
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);


const User = mongoose.model("user", userSchema);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now}:${req.ip} ${req.method}:${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});
//Routes
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "user not found" });
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { user_name: "changed" });
    return res.json({ status: "Success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
    // const id = Number(req.params.id);
    // users = users.filter((data) => data.id !== id);
    // return res.status(200).json(users);
  });

app.post("/login", async (req, res) => {
    const body = req.body;
    console.log("req body ", body)

    const token = jwt.sign(
        body,
        "sampel-secret",
        { expiresIn: "3d" }
      );
    
    res.status(200).json({
      success: true,
      msg: "Logged in Successfully.",
      data: { "body" : req.body, token },
    });
});


const isTokenValid = (req, res, next) => {

  var authToken = req.headers.authorization;
  
  jwt.verify(authToken, "sampel-secret", (err, user) => {
    if (err) {
      res.status(401).json({ success: false, data: "Token is not Valid!" });
    }
    else{
      next()
    }
  });

}

app.get("/posts",  async (req, res) => {
  User.validate(req.body).then((v)=>{
    return res.json(v)
  }).catch(er => {
    return res.send({"v" : er})
  })
  // var filepath = path.join(__dirname, "ved_dhanani_CV.pdf")
  // return res.status(200).sendFile(filepath);
});

app.get("/api/users", (req, res) => {
res.setHeader("Myname", "ved patel");
return res.json(users);
});

app.get("/users", async (req, res) => {
  const allDbUser = await User.find({});
  return res.json(allDbUser);
  // const html = `<ul>${allDbUser
  //   .map((user) => `<li>${user.user_name}</li>`)
  //   .join("")}</ul>`;
  // res.send(html);
  // const html = `<ul>${users
  //   .map((user) => `<li>${user.user_name}</li>`)
  //   .join("")}</ul>`;
  // res.send(html);
});
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (!body || !body.user_name || !body.address) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  try {
    const result = await User.create({
      user_name: body.user_name,
      address: body.address,
    });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
});


// app.listen(port, () => console.log(`Server started at port ${port}`));
app.listen(port, "192.168.42.67", () =>
  console.log(`Server started at port ${port}`)
);
