import React, { useState, useEffect } from 'react';
import api from '../api/api'; // adjust the path if needed

function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState(null);
  const [replies, setReplies] = useState({});
  const [voteCounts, setVoteCounts] = useState({});
  const [userHasUpvoted, setUserHasUpvoted] = useState({});
  const [replyVoteCounts, setReplyVoteCounts] = useState({});
  const [replyUserHasUpvoted, setReplyUserHasUpvoted] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.id || null;
    } catch {
      return null;
    }
  };

  const isUserOwner = (postUser, currentUserId) => {
    if (!postUser || !currentUserId) return false;
    return postUser.id === currentUserId;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/support-posts/');
        setPosts(response.data);

        // Initialize votes and upvotes for posts
        const initialVotes = {};
        const initialUpvoted = {};
        // Initialize votes and upvotes for replies
        const initialReplyVotes = {};
        const initialReplyUpvoted = {};
        const initialReplies = {};

        response.data.forEach(post => {
          initialVotes[post.id] = post.votes || 0;
          initialUpvoted[post.id] = post.user_has_upvoted || false;
          initialReplies[post.id] = '';

          post.replies.forEach(reply => {
            initialReplyVotes[reply.id] = reply.votes || 0;
            initialReplyUpvoted[reply.id] = reply.user_has_upvoted || false;
          });
        });

        setVoteCounts(initialVotes);
        setUserHasUpvoted(initialUpvoted);
        setReplies(initialReplies);
        setReplyVoteCounts(initialReplyVotes);
        setReplyUserHasUpvoted(initialReplyUpvoted);
        setError(null);

        const userId = getUserIdFromToken();
        setCurrentUserId(userId);
      } catch {
        setError('Failed to load posts');
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support-posts/', { content: newPost });
      setNewPost('');
      const response = await api.get('/support-posts/');
      setPosts(response.data);
      setError(null);
    } catch {
      setError('Failed to submit post');
    }
  };

  const handleReply = async (postId) => {
    const content = replies[postId];
    if (!content.trim()) return;
    try {
      await api.post(`/support-posts/${postId}/reply/`, { content });
      const response = await api.get('/support-posts/');
      setPosts(response.data);
      setReplies(prev => ({ ...prev, [postId]: '' }));
      setError(null);
    } catch {
      setError('Failed to submit reply');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const response = await api.post(`/support-posts/${postId}/upvote/`, {});
      const { votes, user_has_upvoted } = response.data;

      setVoteCounts(prev => ({ ...prev, [postId]: votes }));
      setUserHasUpvoted(prev => ({ ...prev, [postId]: user_has_upvoted }));
      setError(null);
    } catch {
      setError('Failed to upvote post');
    }
  };

  const handleReplyUpvote = async (postId, replyId) => {
    try {
      const response = await api.post(`/support-posts/${postId}/reply/${replyId}/upvote/`, {});
      const { votes, user_has_upvoted } = response.data;

      setReplyVoteCounts(prev => ({ ...prev, [replyId]: votes }));
      setReplyUserHasUpvoted(prev => ({ ...prev, [replyId]: user_has_upvoted }));
      setError(null);
    } catch {
      setError('Failed to upvote reply');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/support-posts/${postId}/`);
      const response = await api.get('/support-posts/');
      setPosts(response.data);
      setError(null);
    } catch {
      setError('Failed to delete post');
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    try {
      await api.delete(`/support-posts/${postId}/reply/${replyId}/`);
      const response = await api.get('/support-posts/');
      setPosts(response.data);
      setError(null);
    } catch {
      setError('Failed to delete reply');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Poppins, sans-serif',
        padding: '40px 20px',
      }}
    >
      <h2 style={{ color: 'black', marginBottom: '20px' }}>Community Forum</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#f0fafa',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}
      >
        <textarea
          placeholder="Share your thoughts or ask for support..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          required
          rows={4}
          style={{
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            resize: 'vertical',
            marginBottom: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#299191',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(41, 145, 145, 0.3)',
          }}
        >
          Post
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>

      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ color: '#299191', marginBottom: '16px' }}>All Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                borderBottom: '1px solid #ddd',
                marginBottom: '20px',
                paddingBottom: '16px',
              }}
            >
              <p style={{ fontSize: '1rem', marginBottom: '6px' }}>{post.content}</p>
              <small style={{ display: 'block', marginBottom: '10px', color: '#555' }}>
                Posted on: {new Date(post.created_at).toLocaleString()}
              </small>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                  onClick={() => handleUpvote(post.id)}
                  style={{
                    backgroundColor: userHasUpvoted[post.id] ? '#299191' : '#999',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {userHasUpvoted[post.id] ? 'Remove Upvote' : 'Upvote'} ({voteCounts[post.id] || 0})
                </button>

                {isUserOwner(post.user, currentUserId) && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                    title="Delete your post"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '12px', paddingLeft: '12px' }}>
                {post.replies && post.replies.length > 0 ? (
                  post.replies.map((reply) => (
                    <div
                      key={reply.id}
                      style={{
                        borderLeft: '3px solid #299191',
                        paddingLeft: '12px',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        color: '#444',
                        backgroundColor: '#f9fdfd',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <p style={{ margin: 0 }}>{reply.content}</p>
                        <small style={{ color: '#666' }}>
                          Replied on: {new Date(reply.created_at).toLocaleString()}
                        </small>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          onClick={() => handleReplyUpvote(post.id, reply.id)}
                          style={{
                            backgroundColor: replyUserHasUpvoted[reply.id] ? '#299191' : '#999',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                          title="Upvote reply"
                        >
                          {replyUserHasUpvoted[reply.id] ? 'Remove Upvote' : 'Upvote'} ({replyVoteCounts[reply.id] || 0})
                        </button>

                        {isUserOwner(reply.user, currentUserId) && (
                          <button
                            onClick={() => handleDeleteReply(post.id, reply.id)}
                            style={{
                              backgroundColor: '#e74c3c',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}
                            title="Delete your reply"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>No replies yet</p>
                )}
              </div>

              <textarea
                placeholder="Write a reply..."
                value={replies[post.id]}
                onChange={(e) =>
                  setReplies((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  marginBottom: '8px',
                }}
              />
              <button
                onClick={() => handleReply(post.id)}
                style={{
                  backgroundColor: '#299191',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                Reply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Forum;
