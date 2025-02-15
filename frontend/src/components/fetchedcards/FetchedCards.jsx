import React, { useState, useEffect } from "react";
import "./FetchedCards.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, 
  faThumbsDown, 
  faComment, 
  faTrash, 
  faEdit 
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FetchedCards = ({ posts, defaultExpandSingle }) => {
  const navigate = useNavigate();
  const [expandedPost, setExpandedPost] = useState(null);
  const [postLikes, setPostLikes] = useState({});
  const [postDislikes, setPostDislikes] = useState({});
  const [postComments, setPostComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeIcons, setActiveIcons] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // Auto-expand if defaultExpandSingle is true and there is exactly one post.
  useEffect(() => {
    if (defaultExpandSingle && posts.length === 1) {
      setExpandedPost(posts[0]._id);
    }
  }, [posts, defaultExpandSingle]);

  // Navigate to blog detail page when card is clicked
  const handleCardClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  // The following interactive events call e.stopPropagation() so that clicking them doesn’t trigger the card-level onClick.
  const toggleExpand = (e, postId) => {
    e.stopPropagation();
    setExpandedPost(prev => (prev === postId ? null : postId));
  };

  const handleLike = async (e, postId) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    if (activeIcons[postId] === 'like') return;
    setActiveIcons((prev) => ({ ...prev, [postId]: 'like' }));
    try {
      const response = await axios.post(
        `https://hub-cde3.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
        }
      );
      setPostLikes((prev) => ({ ...prev, [postId]: response.data.likes }));
      if (response.data.dislikes !== undefined) {
        setPostDislikes((prev) => ({ ...prev, [postId]: response.data.dislikes }));
      }
      triggerConfetti(postId);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleDislike = async (e, postId) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    if (activeIcons[postId] === 'dislike') return;
    setActiveIcons((prev) => ({ ...prev, [postId]: 'dislike' }));
    try {
      const response = await axios.post(
        `https://hub-cde3.onrender.com/api/posts/${postId}/dislike`,
        {},
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
        }
      );
      setPostDislikes((prev) => ({ ...prev, [postId]: response.data.dislikes }));
      if (response.data.likes !== undefined) {
        setPostLikes((prev) => ({ ...prev, [postId]: response.data.likes }));
      }
    } catch (error) {
      console.error("Error disliking post", error);
    }
  };

  const handleComment = async (e, postId, commentText) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    if (!commentText.trim()) return;
    try {
      const response = await axios.post(
        `https://hub-cde3.onrender.com/api/posts/${postId}/comment`,
        { text: commentText },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
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

  const toggleCommentsVisibility = (e, postId) => {
    e.stopPropagation();
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    setActiveIcons(prev => ({ ...prev, [postId]: prev[postId] === 'comment' ? null : 'comment' }));
  };

  const handleDelete = async (e, postId) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`https://hub-cde3.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      toast.success("Post deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post!");
    }
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

  const loggedInUsername = localStorage.getItem('username');

  return (
    <div className="post-cards-container-wrapper">
      <ToastContainer />
      <div className={`post-cards-container ${!isLoggedIn ? 'blurred' : ''}`}>
        {posts.length > 0 ? (
          posts.map((post) => {
            const isLiked = activeIcons[post._id] === 'like';
            const isDisliked = activeIcons[post._id] === 'dislike';
            const isCommentActive = activeIcons[post._id] === 'comment';
            return (
              <div
                key={post._id}
                className={`post-card ${expandedPost === post._id ? "expanded" : ""}`}
                id={post._id}
                onClick={() => handleCardClick(post._id)}
              >
                <div className="post-card-header" onClick={(e) => e.stopPropagation()}>
                  <div className="header-title-wrapper">
                    <h3 className="post-title">{post.title}</h3>
                    {post.author?.username === loggedInUsername && (
                      <div
                        className="edit-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/updateblog/${post._id}`);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </div>
                    )}
                  </div>
                  <p className="post-category">{post.category?.name}</p>
                  <p className="post-author">Posted by: {post.author?.username}</p>
                  <p className="post-date">Published on: {new Date(post.createdAt).toLocaleString()}</p>
                </div>

                <div className={`post-card-content ${expandedPost === post._id ? "full-content" : ""}`} onClick={(e) => e.stopPropagation()}>
                  <p>{post.content}</p>
                </div>

                <button className="read-more-btn" onClick={(e) => toggleExpand(e, post._id)}>
                  {expandedPost === post._id ? "Read Less" : "Read More"}
                </button>

                <div className="post-actions" onClick={(e) => e.stopPropagation()}>
                  <div
                    className={`action-icon ${isLiked ? 'active' : ''}`}
                    onClick={(e) => handleLike(e, post._id)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{postLikes[post._id] !== undefined ? postLikes[post._id] : post.likes.length}</span>
                  </div>
                  <div
                    className={`action-icon ${isDisliked ? 'active' : ''}`}
                    onClick={(e) => handleDislike(e, post._id)}
                  >
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span>{postDislikes[post._id] !== undefined ? postDislikes[post._id] : post.dislikes.length}</span>
                  </div>
                  <div
                    className={`action-icon ${isCommentActive ? 'active' : ''}`}
                    onClick={(e) => toggleCommentsVisibility(e, post._id)}
                  >
                    <FontAwesomeIcon icon={faComment} />
                    <span>Comment</span>
                  </div>
                  {post.author?.username === loggedInUsername && (
                    <div className="action-icon" onClick={(e) => handleDelete(e, post._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </div>
                  )}
                </div>

                {showComments[post._id] && (
                  <div className="comment-section" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      className="comment-input"
                      id={`comment-input-${post._id}`}
                      placeholder="Add a comment..."
                      rows="2"
                    ></textarea>
                    <span
                      className="comment-btn"
                      onClick={(e) =>
                        handleComment(
                          e,
                          post._id,
                          document.getElementById(`comment-input-${post._id}`).value
                        )
                      }
                    >
                      Comment
                    </span>
                    <ul className="comments-list">
                      {(postComments[post._id] || post.comments || []).map((comment, index) => (
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
    </div>
  );
};

export default FetchedCards;
