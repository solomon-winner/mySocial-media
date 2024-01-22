import jwt from "jsonwebtoken";
import { db } from "../connect.js"
import moment from "moment";

export const getStory = (req,res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token,"secretkey",(err,userInfo) => {
        if (err) return res.status(403).json("This is not valid token!");
        
        const q = `SELECT s.*, Name FROM Stories AS s JOIN Users AS u ON (u.id = s.UserId)
        LEFT JOIN RelationShips AS r ON (s.UserId = r.FollowedUserId AND r.FollowerId = ?) LIMIT 4 `;

        db.query(token,[userInfo.id],(err,data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        })

    })
    

}
export const addStory = (req,res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token,"secretkey",(err,userInfo) => {
        if (err) return res.status(403).json("This is not valid Token!");

        const q = " INSERT INTO TABLE Stories (`img`,`UserId`,`CreatedAt`) VALUES (?)"

        const values = [req.body.img,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
            db.query(q,[values],(err,data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("you upload your story success fully!")
            })
    })
}
export const deleteStory = (req,res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token,"secretkey",(err,userInfo) => {
        if (err) return res.status(403).json("This is not valid Token!");

        const q = " DELETE IFROM Stories WHERE id = ? AND UserId = ?"

        const values = [req.params.id,
            userInfo.id]
            db.query(q,[values],(err,data) => {
                if (err) return res.status(500).json(err);
                if (data.affectedRows > 0) return res.status(200).json("you deleted your story success fully!")
                return res.status(403).json("you can only delete your story!")

            })
    })

}