import {Link} from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'

const Feed = () => {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/getposts?limit=9`)
        if (res.status === 200) {
          setPosts(res.data.posts)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div>
      <div className=" flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto">
        <h1 className=" text-3xl font-bold lg:text-6xl">No Failure, No Defeat...</h1>
        <p className=" text-gray-500 text-xs sm:text-sm">Unearthening Hidden Treasures, Redefining Destiny and Rebuilding Broken Marriages</p>
        <Link to='/search' className=" text-xs sm:text-sm text-teal-500 font-bold hover:underline">View all Posts</Link>
      </div>
      <div className="p-3 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 py-7 flex flex-col gap-8">
        {
          posts && posts.length > 0 && (
            <div className=" flex flex-col gap-6">
              <h1 className=' text-2xl font-semibold'>Recent Post</h1>
              <div className=" flex flex-wrap gap-6">
                {
                  posts.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))
                }
              </div>
              <Link to={'/search'} className=' text-lg text-teal-500 hover:underline text-center'>View all Posts</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Feed