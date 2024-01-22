import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
 
    const q = "SELECT * FROM Users WHERE User_name = ?";
     const na_me = req.body.username;
//     console.log("req.params =>",req.params);
//     console.log("req.query =>"+req.query);
//  console.log("req.query =>"+JSON.stringfy(req.query));
 console.log("req.body =>"+req.body.username);
 console.log("req.na_me =>"+req);

    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User already exists!");
        const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password,salt);
   
    const q = "INSERT INTO Users (`User_name`, `Email`, `Password`, `Name`) VALUE (?)"

    const values = [req.body.username, req.body.email,hashedPassword, req.body.name];


    db.query(q,[values],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("User has been Created!")
    }) 
    });

   
}
export const login = (req, res) => {
    const q = "SELECT * FROM Users WHERE User_name = ?";

    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
    if(data.length === 0) return res.status(404).json("User not found");

    
    const checkPassword = bcrypt.compareSync(
        req.body.password,
        data[0].Password
      );
    if(!checkPassword)
    return res.status(400).json("Wrong password or username!");

     const token = jwt.sign({id: data[0].id}, "secretkey");

    const { Password, ...others} = data[0];
console.log(Password, others)

    res
    .cookie("accessToken", token , {httpOnly: true,})
    .status(200).json(others);
})

}
export const logout = (req, res) => {
res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none"
}).status(200).json("User has been logged out.")
}