import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import {Button, Spinner} from 'flowbite-react'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

const PostPage = () => {

  const { postSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/getposts?slug=${postSlug}`)
        if (res.status !== 200) {
          setError(true)
          setLoading(false)
          return
        } else {
          setPost(res.data.posts[0])
          setError(false)
          setLoading(false)
        }
      } catch (error) {
        setError(true)
        setLoading(false)
        console.log(error)
      }
    }
    fetchPost()
  }, [postSlug])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await axios(`${import.meta.env.VITE_BACKEND_URL}/post/getposts?limit=3`)
        if (res.status === 200) {
          setRecentPosts(res.data.posts)
        }
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchRecentPosts()
  }, [])

  if (loading) return (
    <div className=' flex justify-center items-center min-h-screen'>
      <Spinner size={'xl'}/>
    </div>
  )
  return (
    <main className=' p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className=' text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link to={`/search?category=${post && post.category}`} className=' self-center mt-5'>
        <Button color='gray' pill size={'xs'}>{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className=' mt-10 p-3 max-h-[600px] w-full object-cover' />
      <div className=' flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className=' italic'>{ post && (post.content.length / 1000).toFixed(0) } min read</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post && post.content }} className=' p-3 max-w-2xl mx-auto w-full post-content'></div>
      <div className=" max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <div className="">
        <CommentSection postId={post._id} />
      </div>
      <div className=" flex flex-col justify-center items-center mb-5">
        <h1 className=' text-lg mt-5'>Recent Articles</h1>
        <div className=" flex flex-wrap gap-5 justify-center mt-5">
          {
            recentPosts && 
            recentPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))
          }
        </div>
      </div>
    </main>
  )
}

export default PostPage