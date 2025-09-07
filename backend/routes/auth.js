const express=require("express");
const router=express.Router();
const cors=require('cors');
const User=require("../models/User");
const {body,validationResult}=require("express-validator");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchuser=require("../middleware/fetchuser");
const JWT_SECRET="IamMalayPandya";

router.use(
    cors({
        credentials: true,
        origin:'http://localhost:5173'
    })
)

// ROUTE 1: Create a user using: POST"/api/auth/register". No Login Required

router.post("/register",[
    body('name',"Enter a valid name").isLength({min:3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be atleast 8 characters").isLength({min:8})
],async(req,res)=>{
    // if there are errors return bad request and errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }  
    try{
    // Check whether the user with this email exists already
    let user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(500).json({error:"Sorry a user with this email already exists:("})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);

    // Create a new user
    user=await User.create({
        name: req.body.name,
        password: secPass,
        email:req.body.email,
    });

    const data={
        user:{
            id:user.id
        }
    }

    const authToken=jwt.sign(data,JWT_SECRET);
    
    res.json({authToken});

    // catch errors
    }catch(err){
        console.error(err.message);
        res.send("Internal Server Error");
    }
})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login".No login required
router.post("/login", [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success: true, authToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 3: Get loggedin user details using: POST "/api/auth/getuser".Login required
// router.post("/getuser",fetchuser,async(req,res)=>{
// try{
//     userId=req.user.id;
//     const user=await User.findById(userId).select("-password");
//     res.json(user);
// }catch(error){
//     console.error(err.message);
//     res.send("Internal Server Error");
// }
// })

// Protected dashboard route
router.get("/dashboard", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports=router;


