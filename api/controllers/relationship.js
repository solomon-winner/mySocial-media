import { db } from  "../connect.js"
import jwt from "jsonwebtoken";

export const getRelation = (req,res) => {
    const q = "SELECT FollowerId FROM RelationShips WHERE FollowedUserId = ? "

db.query(q,[req.query.FollowedUserId], (err,data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(relationship => relationship.followerId))
})
}

export const addRelation = (req,res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token,"secretkey",(err,userInfo) =>{
        if (err) return res.status(403).json("The token is not valid!");

        const q = "INSERT INTO TABLE RelationShips (`FollowerId`,`FollowedUserId`) VALUES (?)";

        db.query(q,[userInfo.id,req.query.userId],(err,data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("you are following what you want!");
        })
    })
}

export const deleteRelation = (req,res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Authenticated!");

    jwt.verify(token,"secretkey",(err,userInfo) => {
        if (err) return res.status(403).json("This is not valid Token!");

        const q = "DELETE FROM RelationShips WHERE `FollowerId` = ? AND `FollowedUserId` = ?"

        db.query(q,[userInfo.id,req.query.userId],(err,data) => {

            if (err) return res.status(500).json(err);
            if(data.affectedRows > 0) return res.status(200).json("you Deleted Successfully");

            // return res.status(403).json("you can delete only the users you followed!")

        })
    })
}