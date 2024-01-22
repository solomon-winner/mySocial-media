import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import {makeRequest } from "../../axios";

const Posts = ({userId}) => {
console.log("The user id is :",userId);
 //URL
  const {isLoading, error, data} = useQuery(["posts"], 
  ()=> makeRequest.get("/posts")
  .then((res)=>{return res.data}))
  console.log(`THIS IS THE POST => ${data}`)
  return <div className="posts">
    {error
    ? "something went wrong!"
    :isLoading
    ? "loading"
    :data.map((post)=> <Post post={post} key={post.id}/> )  

    }
    
      
    </div>
  
};

export default Posts;
