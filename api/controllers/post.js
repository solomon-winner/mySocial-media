import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req,res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
//  console.log("the user id is (from Posts): ", req)
    if(!token)return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err,userInfo) => {
        if(err) return res.status(403).json("Token is not Valid!");
     
        // const q = `SELECT p.*, u.id AS UserId, Name, ProfilePic FROM Posts AS p JOIN Users AS u ON (u.id = p.UserId)
        // LEFT JOIN Relationships AS r ON (p.UserId = r.FollowedUserId) WHERE r.FollowerUserId= ? OR p.UserId =?
        // ORDER BY p.CreatedAt DESC`;

        const q = `SELECT p.*, u.id AS UserId, Name, ProfilePic FROM Posts AS p JOIN Users AS u ON (u.id = p.UserId) WHERE p.UserId = ? ORDER BY p.CreatedAt DESC`
    // const q = userId !== "undefined"
    // ?`SELECT p.*, u.id AS UserId, Name, ProfilePic FROM Posts AS p JOIN Users AS u ON (u.id = p.UserId) WHERE p.UserId = ? ORDER BY p.CreatedAt DESC`
    // :`SELECT p.*,u.id AS UserId ,Name, ProfilePic FROM Posts AS p JOIN Users AS u ON (u.id = p.userId)
    // LEFT JOIN RelationShips AS r ON (p.UserId = r.FollowedUserId) WHERE r.FollowerId = ? OR p.UserId = ?
    // ORDER BY p.CreatedAt DESC`;
console.log(userInfo);
    const values = userId !== "undefined" ? [userId]: [userInfo.id, userInfo.id];
    db.query(q,[userInfo.id],(err,data) =>{
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);

   })  
    })

}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) =>{
        if (err) return res.status(403).json("Token is not valid");

        const q = "INSERT INTO Posts(`Description`,`img`, `UserId`, `createdAt`) VALUES (?)"

        const values = [
        req.body.desc,
        req.body.img,
        userInfo.id,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
];

db.query(q,[values],(err,data) => {
if (err) return res.status(500).json(err);
return res.status(200).json("Post has been created!")
        })
    })
}

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged in!")

    jwt.verify(token, "secretkey", (err,userInfo) =>{
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM Posts WHERE `id` = ? AND `UserId` = ?";

        db.query(q,[req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");

            return res.status(403).json("You can delete only your post!")
        })
    })
}