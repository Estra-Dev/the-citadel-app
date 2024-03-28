import axios from 'axios'
import { Button, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

const Search = () => {

  const [sideBarData, setSideBarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

console.log(sideBarData)
  useEffect(() => {

    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const sortFromUrl = urlParams.get('sort')
    const categoryFromUrl = urlParams.get('category')

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData({
        ...sideBarData, 
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl
      })
    }

    const fetchPosts = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/getposts?${searchQuery}`)

        if (res.status === 200) {
          setPosts(res.data.posts)
          setLoading(false)
          if (res.data.posts.length === 9) {
            setShowMore(true)
          } else {
            setShowMore(false)
          }
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    fetchPosts()
  }, [location.search])

  const handleChange = (ev) => {
    const { name, value } = ev.target
    if (name === 'searchTerm') {
      setSideBarData({...sideBarData, searchTerm: value})
    }

    if (name === 'sort') {
      const order = value || 'desc'
      setSideBarData({...sideBarData, sort: order})
    }
    if (name === 'category') {
      const category = value || 'uncategorized'
      setSideBarData({...sideBarData, category})
    }
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sideBarData.searchTerm)
    urlParams.set('sort', sideBarData.sort)
    urlParams.set('category', sideBarData.category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
    // try {
      
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleShowMore = async () => {
    const numberOfPost = posts.length
    const startIndex = numberOfPost
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/getposts?${searchQuery}`)
      if (res.status === 200) {
        setPosts([...posts, ...res.data.posts])
        if (res.data.posts.length === 9) {
          setShowMore(true)
        } else {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=' flex flex-col md:flex-row'>
      <div className=" p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className=' flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className=" flex items-center gap-2">
            <label htmlFor="searchterm" className=' whitespace-nowrap font-bold'>Search Term:</label>
            <TextInput placeholder='Search...' name='searchTerm' type='text' value={sideBarData.searchTerm} onChange={handleChange}/>
          </div>
          <div className=" flex items-center gap-2">
            <label htmlFor="sort">Sort:</label>
            <Select onChange={handleChange} value={sideBarData.sort} name='sort'>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className=" flex items-center gap-2">
            <label htmlFor="category">Category:</label>
            <Select onChange={handleChange} value={sideBarData.category} name='category'>
              <option value="uncategorized">uncategorized</option>
              <option value="words">Words of Wisdom</option>
              <option value="announcement">Announcement</option>
              <option value="activities">Activities</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone={'purpleToPink'}>Search</Button>
        </form>
      </div>
      <div className=" w-full">
        <h1 className=' text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts Result</h1>
        <div className=" p-7 flex flex-wrap gap-4">
          {
            !loading && posts.length === 0 && <p className=' text-xl text-gray-500'>No Post Found...</p>
          }
          {
            loading && <>
              <Spinner />
              <p className=' text-xl text-gray-500'>Loading...</p>
            </>
          }
          {
            !loading && posts && posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          }

          {
            showMore && <button className=' text-teal-500 text-lg hover:underline p-7 w-full' onClick={handleShowMore}>
              Show More
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default Search