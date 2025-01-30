const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
let mocktest = require("../mock_tasks.json");

const {
  handleGetAllUsersFromDB,
  handlegetUserById,
  handlePatchUpdateId,
  handleDeleteId,
  handleCreateNewUser,
} = require("../controllers/user");

router.route("/")
.get(handleGetAllUsersFromDB)
.post(handleCreateNewUser);


router
  .route("/:id")
  .get(handlegetUserById)
  .patch(handlePatchUpdateId)
  .delete(handleDeleteId);

  router.post("/login", async (req, res) => {
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

  router.get("/posts", async (req, res) => {
    User.validate(req.body)
      .then((v) => {
        return res.json(v);
      })
      .catch((er) => {
        return res.send({ v: er });
      });
    // var filepath = path.join(__dirname, "ved_dhanani_CV.pdf")
    // return res.status(200).sendFile(filepath);
  });

  router.get("/", (req, res) => {
    res.setHeader("Myname", "ved patel");
    return res.json(mocktest);
  });

  router.get("/users", async (req, res) => {
    const allDbUser = await User.find({});
    return res.json(allDbUser);
   
  });
 
  router.route("/").post(handleCreateNewUser)

  module.exports = router;
