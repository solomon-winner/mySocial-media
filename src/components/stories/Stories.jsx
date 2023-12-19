import { useContext } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {

  const {currentUser} = useContext(AuthContext)

  const {isLoading, error, data} = useQuery(["stories"], () =>
  
    makeRequest.get("/stories").then((res) =>
  {
    return res.data;
  }  )
  )

  return (
    <div className="stories">
      <div className="story">
          <img src={"/upload/"+currentUser.ProfilePic} alt="" />
          <span>{currentUser.User_name}</span>
          <button>+</button>
        </div>
        {
          error
          ? "Something went wrong!"
          :isLoading
          ?"loading"
          :data.map((story)=>(
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))
          }
      
    </div>
  )
}
//URL
export default Stories