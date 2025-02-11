import React, { useState } from "react";
import "./FetchedCards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons'; // Import required icons

const FetchedCards = ({ posts }) => {
  const navigate = useNavigate();
  const [expandedPost, setExpandedPost] = useState(null);
  const [postLikes, setPostLikes] = useState({});
  const [postDislikes, setPostDislikes] = useState({});
  const [postComments, setPostComments] = useState({});
  const [showComments, setShowComments] = useState({}); // Track which posts have their comment section visible
  const [activeIcons, setActiveIcons] = useState({}); // Track active icons (clicked state)

  const toggleExpand = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const handleLike = async (postId) => {
    setActiveIcons((prev) => ({ ...prev, [postId]: 'like' })); // Highlight the Like icon
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      setPostLikes((prev) => ({ ...prev, [postId]: response.data.likes }));
      triggerConfetti(postId); // Trigger confetti on like
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleDislike = async (postId) => {
    setActiveIcons((prev) => ({ ...prev, [postId]: 'dislike' })); // Highlight the Dislike icon
    try {
      const response = await axios.post(`/api/posts/${postId}/dislike`);
      setPostDislikes((prev) => ({ ...prev, [postId]: response.data.dislikes }));
    } catch (error) {
      console.error("Error disliking post", error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comment`, { text: commentText });
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
    } catch (error) {
      console.error("Error commenting on post", error);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility
    }));
  };

  const triggerConfetti = (postId) => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    document.getElementById(postId).appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2000); // Remove confetti after 2 seconds
  };

  return (
    <div className="post-cards-container">
      {posts.length > 0 ? (
        posts.map((post) => {
          const isExpanded = expandedPost === post._id;
          const isLiked = activeIcons[post._id] === 'like';
          const isDisliked = activeIcons[post._id] === 'dislike';

          return (
            <div key={post._id} className={`post-card ${isExpanded ? "expanded" : ""}`} id={post._id}>
              <div className="post-card-header">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-category">{post.category?.name}</p>
                <p className="post-author">Posted by: {post.author?.username}</p>
                <p className="post-date">Published on: {new Date(post.createdAt).toLocaleString()}</p>
              </div>

              <div className={`post-card-content ${isExpanded ? "full-content" : "blurred-content"}`}>
                <p>{post.content}</p>
              </div>

              <button className="read-more-btn" onClick={() => toggleExpand(post._id)}>
                {isExpanded ? "Read Less" : "Read More"}
              </button>

              {/* Like/Dislike/Comment Icons */}
              <div className="post-actions">
                <div
                  className={`action-icon ${isLiked ? 'active' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span>{postLikes[post._id] || post.likes.length}</span>
                </div>
                <div
                  className={`action-icon ${isDisliked ? 'active' : ''}`}
                  onClick={() => handleDislike(post._id)}
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <span>{postDislikes[post._id] || post.dislikes.length}</span>
                </div>
                <div
                  className={`action-icon ${showComments[post._id] ? 'active' : ''}`}
                  onClick={() => toggleCommentsVisibility(post._id)}
                >
                  <FontAwesomeIcon icon={faComment} />
                  <span>Comment</span>
                </div>
              </div>

              {/* Comment Section */}
              {showComments[post._id] && (
                <div className="comment-section">
                  <textarea
                    className="comment-input"
                    placeholder="Add a comment..."
                    rows="2"
                    onBlur={(e) => handleComment(post._id, e.target.value)}
                  ></textarea>
                  <div className="comment-btn" onClick={(e) => handleComment(post._id, e.target.previousSibling.value)}>
                    Comment
                  </div>
                  <ul className="comments-list">
                    {postComments[post._id]?.map((comment, index) => (
                      <li key={index}>{comment.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="login-cardd">
          <h2>Access Denied</h2>
          <p>
            Please{" "}
            <span className="clickable" onClick={() => navigate("/login")}>
              login
            </span>{" "}
            or{" "}
            <span className="clickable" onClick={() => navigate("/register")}>
              register
            </span>{" "}
            to create a blog post.
          </p>
        </div>
      )}
    </div>
  );
};

export default FetchedCards;