import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollowers(props) {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`);
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("Error or cancelled request.");
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link to={`/profile/${follower.username}`} key={index} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollowers;
