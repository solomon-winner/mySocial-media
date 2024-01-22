import jwt from "jsonwebtoken"
import { db } from "../connect.js"
import momment from "moment"

export const getComments = (req,res) => {

    const q = `SELECT c.*, u,id AS UserId, Name, ProfilePic FROM Comments AS c JOIN Users AS u ON (u.id = c.UserId)
    WHERE c.PostId = ? ORDER BY c.createdAt DESC`;

    db.query(q, [req.query.postId],(err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
}
export const addComment = (req,res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO Comments (`Description`, `CreatedAt`, `UserId`, `PostId`) VALUES (?)";

        const values = [
            req.body.desc,
            momment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ]

        db.query(q, [values],(err,data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been Created.");
        })
    })
}
export const deleteComment = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Authenticated!");

    jwt.verify(token, "jwtkey",(err, userInfo) => {
        if (err) return res.status(403).json("Token is not Valid!");

        const commentId = req.params.id;
        console.log("the req.params is : ",req.params);
        const q = "DELETE FROM Comments WHERE `id` = ? AND `UserId` = ?"

        db.query(q, [commentId, userInfo.id], (err,data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Comment Deleted Successfully!")

            return res.status(403).json("You can Delete Only Your Comments!");
        })
    })
}