// const express = require("express")
// const fs = require("fs");
// let users = require("./mock_tasks.json")

// const app = express();
// const port = 8000;
// //middleware = plugin 
// app.use(express.urlencoded({extended: false }));

// app
//   .route("/api/users/:id")
//   .get((req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
//   })
//   .patch( (req, res) => {
//     // any opration we can perform
//     // patch req is only used for update
//     return res.json({users });
//   })
//   .delete((req, res) => {
//     const id = Number(req.params.id);
//     users = users.filter((data, index)=>{
//         return data.id !== id;
      
//     })
//     return res.status(200).json(users);
//   })


// app.get('/api/users', (req , res)=>{
//   res.setHeader('Myname',"ved pate") 
//   return res.json(users);})

// app.get('/users',(req,res)=>{
//     const html = `<ul>${users.map((users)=>`<li>${users.user_name}</li >`).join('')}</ul>`
// res.send(html)
// })

// // app.get("/api/users/:id", (req ,res)=>{
// //     const id = Number(req.params.id);
// //     const user = users.find((user)=> user.id === id);
// //     return res.json(user);
// // })

// app.post("/api/users",(req,res)=>{
//   const body = req.body;
//   users.push({...body, id: users.length + 1});
//   fs.writeFile('./mock_tasks.json', JSON.stringify(users),(err,data)=>{
//    return res.json({status:"success",id:users.length})
//   })
//   console.log("body",body);
//     return res.json({ status:"pending" })
// })

// // app.patch("/api/users/:id", (req, res) => {
// //   return res.json({});
// // });

// // app.delete("/api/users/:id", (req, res) => {
// //   return res.json({});
// // });





// app.listen(port,()=>console.log(`server started at port ${port}`))

const express = require("express");
const fs = require("fs");
let users = require("./mock_tasks.json");

const app = express();
const port = 8000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req,res,next)=>{
  fs.appendFile("log.txt",`\n${Date.now}:${req.ip} ${req.method}:${req.path}\n`,(err,data)=>{
    next();
  });
});
//Routes
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    // Perform update operation
    return res.json({ users });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    users = users.filter((data) => data.id !== id);
    return res.status(200).json(users);
  });

app.get("/api/users", (req, res) => {
  res.setHeader("Myname", "ved patel");
  return res.json(users);
});

app.get("/users", (req, res) => {
  const html = `<ul>${users
    .map((user) => `<li>${user.user_name}</li>`)
    .join("")}</ul>`;
  res.send(html);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  if(!body || !body.user_name || !body.address){
    return res.status(400).json({msg:"all fields are requirerd"})
  }
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./mock_tasks.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
    return res.status(201).json({ status: "success", id: users.length });
  });
});

app.listen(port, () => console.log(`Server started at port ${port}`));
