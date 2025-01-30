const User = require("../models/user");



async function handleGetAllUsersFromDB(req,res){
       const allDbUser = await User.find({});
       return res.json(allDbUser);
   
}

async function handlegetUserById(req, res) {
 const user = await User.findById(req.params.id);
 if (!user) return res.status(404).json({ error: "user not found" });
 return res.json(user);
}

async function handlePatchUpdateId(req, res) {
   await User.findByIdAndUpdate(req.params.id, { user_name: "changed" });
   return res.json({ status: "Success" });
}


async function handleDeleteId(req, res) {
 await User.findByIdAndDelete(req.params.id);
 return res.json({ status: "Success" });
}

async function handleCreateNewUser(req, res) {
 const body = req.body;
 if (!body || !body.user_name || !body.address) {
   return res.status(400).json({ msg: "All fields are required" });
 }
 try {
   const result = await User.create({
     user_name: body.user_name,
     address: body.address,
   });
   return res.status(201).json(result,id(result.id));//here changes in id
 } catch (err) {
   return res.status(500).json({ msg: "Server Error", error: err.message });
 }
}

module.exports = {
  handleGetAllUsersFromDB,
  handlegetUserById,
  handlePatchUpdateId,
  handleDeleteId,
  handleCreateNewUser,
};