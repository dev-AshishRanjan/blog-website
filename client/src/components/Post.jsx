import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const Backend_URL = process.env.REACT_APP_BACKEND_URL;
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [updatePost, setUpdatePost] = useState(false);
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${Backend_URL}/api/posts/${id}`, {
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Backend_URL}/api/posts/${id}`, {
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      toast.success("Post Deleted");
      navigate(`/dashboard`);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <Navbar route={`r/blogger > Post > ${post?.title}`} /> */}
      <Navbar route={`r/blogger > Post`} />
      <div className='py-2 px-4 rounded m-2 absolute right-6 z-10 gap-4 flex'>
        <button
          onClick={() => {
            setUpdatePost(true);
            setTitle(post?.title);
            setContent(post?.content);
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Update
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
      <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
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
            <button onClick={() => handleUpdate(id)} className="bg-blue-500 text-white py-2 px-4 rounded">
              Update Post
            </button>
            <button onClick={() => setUpdatePost(false)} className="bg-blue-500 text-white py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </div></div> : null}

        <div className='w-full flex justify-evenly items-center '>
          <div className='w-[50%] flex flex-col gap-4 justify-center items-center min-h-screen bg-gray-100'>
            <div className='flex gap-2 w-full'>
              <img src="/newspaper.gif" alt="" className='h-8' />
              <h2 className="text-2xl text-wrap text-ellipsis font-bold text-gray-700">{post.title}</h2>
            </div>
            <p className="text-gray-700 text-left">{post.content}</p>
          </div>
          <img src="/newspaper.gif" alt="" className='w-[30%]' />
        </div>
      </div>
    </div>
  );
}

export default Post;
