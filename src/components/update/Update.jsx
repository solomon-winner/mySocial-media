import { useState } from "react"
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const Update = ({setOpenUpdate,user}) =>{

    console.log(`THIS IS THE USER ${user}`);
    const [cover,setCover] = useState(null);
    const [profile,setProfile] = useState(null);
    const [texts,setTexts] = useState({
        email: user.email,
        password:user.Password,
        name:user.Name,
        city:user.City,
        website:user.Website,
    });

    const upload = async (file) =>{
        console.log(file);
        try {
            const formData = new FormData();
            formData.append("file",file);
            const res = makeRequest.post("/upload", formData);
            return res.data;
        }catch (err){
            console.log(err);
        }
    }

    const handleChange =(e) => {
        setTexts((prev =>({ ...prev, [e.target.name]: [e.target.value]})))
    }

    const queryClient = useQueryClient();

    const mutation  = useMutation(
        (user) => {
            return makeRequest.put("/users", user);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["user"]);
            }
        }
    )

    const handleClick = async (e) =>{
        e.preventDefault();

        let coverUrl;
        let profileUrl;

        coverUrl = cover ? await upload(cover):user.coverPic;
        profileUrl = profile ? await upload(profile): user.profilePic;

        mutation.mutate({ ...texts, coverPic: coverUrl, profilePic:profileUrl});
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
        
    }
    
    return(
            <div className="update">
                <div className="wrapper">
                    <h1>update Your Profile </h1>

                    <form>
                        <div className="files">
                            <label htmlFor="cover" >
                            <span>Cover Picture</span>

                            <div className="imgContainer">
                                <img
                                 src= {
                                    cover
                                    ? URL.createObjectURL(cover)
                                    :"/upload/" +user.CoverPic
                                 }
                                  alt=""  
                                  />
                                  <CloudUploadIcon className = "icon"/>
                            </div>
                            </label>
                            <input
                            type = "file"
                            id = "cover"
                            style = {{display: "none"}}
                            onChange={
                                (e) => setCover(e.target.files[0])
                            }
                            />



                            <label htmlFor="profile" >
                            <span>Profile Picture</span>

                            <div className="imgContainer">
                                <img
                                 src= {
                                    profile
                                    ? URL.createObjectURL(profile)
                                    :"/upload/" +user.ProfilePic
                                 }
                                  alt=""  
                                  />
                                  <CloudUploadIcon className = "icon"/>
                            </div>
                            </label>
                            <input
                            type = "file"
                            id = "profile"
                            style = {{display: "none"}}
                            onChange={
                                (e) => setProfile(e.target.files[0])
                            }
                            />

                        </div>
                        <label>Email</label>
                        <input
                        type = "text"
                        value = {texts.email}
                        name= "email"
                        onChange={handleChange}/>

                        <label >password</label>
                        <input
                        type="text"
                        value={texts.password}
                        name="password"
                        onChange={handleChange}
                        />

                        <label>Name</label>
                        <input
                            type="text"
                            value={texts.name}
                            name="name"
                            onChange={handleChange}
                        />

                        <label>Country / City</label>
                        <input
                            type="text"
                            name="city"
                            value={texts.city}
                            onChange={handleChange}
                        />

                        <label>Website</label>
                        <input
                            type="text"
                            name="website"
                            value={texts.website}
                            onChange={handleChange}
                        />
                        <button onClick={handleClick}>Update</button>
                                    </form>
                                    <button className="close"onClick={() => setOpenUpdate(false)}>
                                        Close
                                        </button>
                </div>
            </div>
        );
};

export default Update;