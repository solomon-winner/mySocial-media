import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req,res) => {
    const q = "SELECT UserId FROM Likes WHERE PostId = ?";

    db.query(q,[req.query.PostId],(err,data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.UserId));
    })
}
export const addLike = (req,res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Loged in!");

    jwt.verify(token,"secretkey",(err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO Likes (`UserId`,`PostId`) VALUES = (?)";

        const values = [
            userInfo.id,
            req.body.postId
        ]
console.log("this is post id from like  ===> "+req.body.postId)
        db.query(q,[values],(err,data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("This Post has been Liked Successfully!");
        });
    });
}
export const deleteLike = (req,res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Loged in!")

    jwt.verify(token,"secretkey",(err,userInfo) => {
        if (err) return res.status(403).json("Not Valid Token!");

        const q ="DELETE FROM Likes WHERE `UserId = ? AND PostId = ?`"
        console.log("this is post id from deleteLike  ===> "+req.params.postId)

        db.query(q,[userInfo.id,req.params.postId],(err,data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("This Post has been Disliked!")
        })

    })
}