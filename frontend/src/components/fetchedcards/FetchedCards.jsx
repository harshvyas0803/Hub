import React, { useState, useEffect } from "react";
import "./FetchedCards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
// import RightSidebar from "../rightsidebar/RightSidebar";

const FetchedCards = ({ posts }) => {
  const navigate = useNavigate();
  const [expandedPost, setExpandedPost] = useState(null);
  const [postLikes, setPostLikes] = useState({});
  const [postDislikes, setPostDislikes] = useState({});
  const [postComments, setPostComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeIcons, setActiveIcons] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Determine login status based on authToken in localStorage.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPost(prev => (prev === postId ? null : postId));
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("authToken");
    if (activeIcons[postId] === 'like') return;
    setActiveIcons((prev) => ({ ...prev, [postId]: 'like' }));
    try {
      const response = await axios.post(
        `http://localhost:2005/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        }
      );
      setPostLikes((prev) => ({ ...prev, [postId]: response.data.likes }));
      if(response.data.dislikes !== undefined) {
        setPostDislikes((prev) => ({ ...prev, [postId]: response.data.dislikes }));
      }
      triggerConfetti(postId);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleDislike = async (postId) => {
    const token = localStorage.getItem("authToken");
    if (activeIcons[postId] === 'dislike') return;
    setActiveIcons((prev) => ({ ...prev, [postId]: 'dislike' }));
    try {
      const response = await axios.post(
        `http://localhost:2005/api/posts/${postId}/dislike`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        }
      );
      setPostDislikes((prev) => ({ ...prev, [postId]: response.data.dislikes }));
      if(response.data.likes !== undefined) {
        setPostLikes((prev) => ({ ...prev, [postId]: response.data.likes }));
      }
    } catch (error) {
      console.error("Error disliking post", error);
    }
  };

  const handleComment = async (postId, commentText) => {
    const token = localStorage.getItem("authToken");
    if (!commentText.trim()) return;
    
    try {
      const response = await axios.post(
        `http://localhost:2005/api/posts/${postId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        }
      );
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
    } catch (error) {
      console.error("Error commenting on post", error);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    setActiveIcons(prev => ({ ...prev, [postId]: prev[postId] === 'comment' ? null : 'comment' }));
  };

  const triggerConfetti = (postId) => {
    const container = document.getElementById(postId);
    if (!container) return;
    const confettiCount = 80;

    for (let i = 0; i < confettiCount; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.className = 'confetti-piece';
      confettiPiece.style.position = 'absolute';
      confettiPiece.style.width = '8px';
      confettiPiece.style.height = '8px';
      confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confettiPiece.style.top = '-20px';
      confettiPiece.style.left = Math.random() * 100 + '%';
      confettiPiece.style.opacity = Math.random();

      container.appendChild(confettiPiece);

      const delay = Math.random() * 500;
      const duration = 1500 + Math.random() * 1000;

      setTimeout(() => {
        confettiPiece.style.transition = `transform ${duration}ms linear, opacity ${duration}ms linear`;
        const drift = (Math.random() - 0.5) * 100;
        confettiPiece.style.transform = `translate(${drift}px, ${container.clientHeight + 100}px) rotate(${Math.random() * 360}deg)`;
        confettiPiece.style.opacity = 0;
      }, delay);

      setTimeout(() => {
        confettiPiece.remove();
      }, delay + duration);
    }
  };

  return (
    <div className="post-cards-container-wrapper">
      {/* Optionally show the right sidebar if the user is logged in */}
      {/* {isLoggedIn && (
        <div className="right-sidebar">
          <RightSidebar />
        </div>
      )} */}

      <div className={`post-cards-container ${!isLoggedIn ? 'blurred' : ''}`}>
        {posts.length > 0 ? (
          posts.map((post) => {
            const isExpanded = expandedPost === post._id;
            const isLiked = activeIcons[post._id] === 'like';
            const isDisliked = activeIcons[post._id] === 'dislike';
            const isCommentActive = activeIcons[post._id] === 'comment';

            return (
              <div key={post._id} className={`post-card ${isExpanded ? "expanded" : ""}`} id={post._id}>
                <div className="post-card-header">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-category">{post.category?.name}</p>
                  <p className="post-author">Posted by: {post.author?.username}</p>
                  <p className="post-date">Published on: {new Date(post.createdAt).toLocaleString()}</p>
                </div>

                <div className={`post-card-content ${isExpanded ? "full-content" : ""}`}>
                  <p>{post.content}</p>
                </div>

                <button className="read-more-btn" onClick={() => toggleExpand(post._id)}>
                  {isExpanded ? "Read Less" : "Read More"}
                </button>

                <div className="post-actions">
                  <div
                    className={`action-icon ${isLiked ? 'active' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{postLikes[post._id] !== undefined ? postLikes[post._id] : post.likes.length}</span>
                  </div>
                  <div
                    className={`action-icon ${isDisliked ? 'active' : ''}`}
                    onClick={() => handleDislike(post._id)}
                  >
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span>{postDislikes[post._id] !== undefined ? postDislikes[post._id] : post.dislikes.length}</span>
                  </div>
                  <div
                    className={`action-icon ${isCommentActive ? 'active' : ''}`}
                    onClick={() => toggleCommentsVisibility(post._id)}
                  >
                    <FontAwesomeIcon icon={faComment} />
                    <span>Comment</span>
                  </div>
                </div>

                {showComments[post._id] && (
                  <div className="comment-section">
                    <textarea
                      className="comment-input"
                      id={`comment-input-${post._id}`}
                      placeholder="Add a comment..."
                      rows="2"
                    ></textarea>
                    <span
                      className="comment-btn"
                      onClick={() => handleComment(
                        post._id,
                        document.getElementById(`comment-input-${post._id}`).value
                      )}
                    >
                      Comment
                    </span>
                    <ul className="comments-list">
                      {postComments[post._id]?.map((comment, index) => (
                        <li key={index}>
                          <strong>{comment.username} -</strong> {comment.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-posts">
            <p>No posts available.</p>
          </div>
        )}
      </div>

      {/* Overlay with access message when not logged in */}
      {!isLoggedIn && (
        <div className="access-denied-overlay">
          <div className="access-denied-card">
            <h2 className="access-denied-title">Access Denied</h2>
            <p className="access-denied-message">
              Please <span className="clickable" onClick={() => navigate("/login")}>login</span> or <span className="clickable" onClick={() => navigate("/register")}>register</span> to see content clearly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchedCards;
