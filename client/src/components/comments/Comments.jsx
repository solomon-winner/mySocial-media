import { useContext, useState} from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
//URL
const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("")

  const {isLoading,error, data} = useQuery(["comments"],() =>
  makeRequest.get("/comments?postId="+postId).then((res) =>{
    return res.data;
  }))

  const queryClient = useQueryClient();

  const mutation = useMutation((newComment) =>{
    return makeRequest.post("/comments",newComment);
  },
  {
    onSuccess: () =>{
      queryClient.invalidateQueries(["comments"])
    }
  })

  const handleClick = async(e) =>{
    e.preventDefault();
    mutation.mutate({desc, postId});
    setDesc("");
  }

  //Temporary
  // const comments = [
  //   {
  //     id: 1,
  //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
  //     name: "John Doe",
  //     userId: 1,
  //     profilePicture:
  //       "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 2,
  //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
  //     name: "Jane Doe",
  //     userId: 2,
  //     profilePicture:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   },
  // ];
  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/"+currentUser.ProfilePic} alt="" />
        <input 
        type="text"
         placeholder="write a comment" 
         value = {desc}
         onChange = {(e) => setDesc(e.target.value)}/>
        <button onClick = {handleClick}>Send</button>
      </div>

      {error
      ?"Something went Wrong!"
      :isLoading
      ?"loading"
      :data.map((comment) =>(<div className="comment">
        <img src= {"/upload/" + comment.ProfilePic} alt=""  />
        <div className="info">
            <span>{comment.Name}</span>
            <p>{comment.Description}</p>
          </div>
          <span className="date">
            {moment(comment.CreatedAt).fromNow()}
          </span>
      </div>))
      }
      
    </div>
  );
};

export default Comments;
