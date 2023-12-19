import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res)=>{
const userId = req.body.userId;
console.log(` this is from user profile => ${req.params.userId}`)
const q = "SELECT * FROM Users WHERE id =?"

db.query(q,[userId],(err,res) => {
    if (err) return res.status(500).json(err);
        console.log("gggggshdfgvshgdfvshgdvf   =>>>>>>>>>>>>>>>>   " ,data[0])
        const { password , ...info} = data[0];
         return res.json(info); 
});
}
export const updateUser = (req, res)=>{
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token, "secretkey",(err,userInfo) => {
        if (err)return res.status(403).json("Not valid Token!")

        const q = "UPDATE Users  SET `Name` = ?, `City` = ?, `Website` = ?, `ProfilePic` = ?, `CoverPic` = ? WHERE id = ?";
        db.query(q, [
            req.body.Name,
        req.body.City,
    req.body.Website,
req.body.ProfilePic,
req.body.CoverPic,
userInfo.id],(err,data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows > 0) return res.json("Updated!");
    return res.status(403).json(" You can update only your post!") 
        })
    })
}
