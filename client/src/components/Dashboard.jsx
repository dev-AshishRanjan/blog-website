import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
const Backend_URL = process.env.REACT_APP_BACKEND_URL;
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createPost, setCreatePost] = useState(false);
  const [updatePost, setUpdatePost] = useState(false);
  const [postId, setPostId] = useState();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${Backend_URL}/api/posts`, {
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post(
        `${Backend_URL}/api/posts`,
        { title, content },
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );
      setPosts([...posts, res.data]);
      setTitle('');
      setContent('');
      setCreatePost(false);
      toast.success("Post Created");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message?.message || err?.response?.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Backend_URL}/api/posts/${id}`, {
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      setPosts(posts.filter((post) => post._id !== id));
      toast.success("Post Deleted");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message?.message || err?.response?.data);
    }
  };
  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${Backend_URL}/api/posts/${id}`,
        { title, content },
        {
          headers: { 'auth-token': localStorage.getItem('token') },
        });
      fetchPosts();
      toast.success("Post Updated");
      setUpdatePost(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message?.message || err?.response?.data);
    }
  };

  const handleDownload = async (type) => {
    try {
      const response = await axios.get(`${Backend_URL}/api/files/${type}`,
        {
          headers: { 'auth-token': localStorage.getItem('token') },
          responseType: 'blob',
        });
      console.log({ response });
      toast.success("Download started");

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `posts.${type === 'excel' ? 'csv' : 'docx'}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message?.message || err?.response?.data?.error || err?.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Dashboard</h1> */}
      <Navbar route={"r/blogger > Dashboard"} />
      <div className='absolute right-6 z-20 m-2 flex gap-2'>
        <button onClick={() => setCreatePost(!createPost)} className="bg-blue-500 text-white py-2 px-4 rounded z-20">
          {
            createPost ? "Check Posts" : "Create Post"
          }
        </button>
        <button onClick={() => handleDownload("excel")} className="bg-blue-500 text-white py-2 px-4 rounded">
          Download (excel)
        </button>
        <button onClick={() => handleDownload("word")} className="bg-blue-500 text-white py-2 px-4 rounded">
          Download (word)
        </button>
      </div>
      <div className="min-h-screen bg-gray-100 p-8 flex flex-wrap w-full items-center justify-center">
        {createPost ? <div className="min-h-screen bg-gray-100 p-8 flex flex-wrap w-full items-center justify-center absolute  z-50"><div className="w-[20rem] bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Content"
            ></textarea>
          </div>
          <div className='flex gap-2 w-full items-center justify-center'>
            <button onClick={handleCreate} className="bg-blue-500 text-white py-2 px-4 rounded">
              Create Post
            </button>
            <button onClick={() => setCreatePost(false)} className="bg-blue-500 text-white py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </div></div> : null}
        {updatePost ? <div className="min-h-screen bg-gray-100 p-8 flex flex-wrap w-full items-center justify-center absolute z-50"><div className="w-[20rem] bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Content"
            ></textarea>
          </div>
          <div className='flex gap-2 w-full items-center justify-center'>
            <button onClick={() => handleUpdate(postId)} className="bg-blue-500 text-white py-2 px-4 rounded">
              Update Post
            </button>
            <button onClick={() => setUpdatePost(false)} className="bg-blue-500 text-white py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </div></div> : null}
        <div className='flex flex-wrap w-full items-center justify-center gap-4'>
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded shadow-md mb-4 w-[20rem] overflow-hidden max-h-[20rem] min-h-[15rem] h-[17rem] relative z-10">
              <div className='flex gap-2 w-full'><img src="/newspaper.gif" alt="" className='h-8' />
                <h2 className="text-2xl text-wrap text-ellipsis font-bold text-gray-700">{post.title}</h2></div>
              <p className="text-gray-700 text-left">{post.content}</p>
              <div className='absolute bottom-0 left-0 p-2 flex gap-2 justify-center w-full items-center bg-white'>
                <button
                  onClick={() => {
                    navigate(`/post/${post._id}`);
                  }}
                  className="bg-blue-500 text-white py-1 px-3 rounded"
                >
                  Read More
                </button>
                <button
                  onClick={() => {
                    setUpdatePost(true);
                    setTitle(post?.title);
                    setContent(post?.content);
                    setPostId(post._id);
                  }}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
