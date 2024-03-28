import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FaUsersLine } from "react-icons/fa6";
import { FaLongArrowAltUp } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { HiDocumentText } from "react-icons/hi";
import { Button, Table, TableHead } from 'flowbite-react'
import {Link} from 'react-router-dom'


const DashboardComp = () => {

  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0)
  const [lastMonthComments, setLastMonthComments] = useState(0)
  const {currentUser} = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getusers?limit=5`, {
          withCredentials: true
        })
        if (res.status === 200) {
          setUsers(res.data.users)
          setTotalUsers(res.data.totalUsers)
          setLastMonthUsers(res.data.lastMonthUser)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/getposts?limit=5`)
        if (res.status === 200) {
          setPosts(res.data.posts)
          setTotalPosts(res.data.totalPost)
          setLastMonthPosts(res.data.lastMonthPosts)
        }

      } catch (error) {
        console.log(error)
      }
    }
    const fetchComment = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/getComments?limit=5`, {
          withCredentials: true
        })
        if (res.status === 200) {
          setComments(res.data.comments)
          setTotalComments(res.data.totalComments)
          setLastMonthComments(res.data.lastMonthComment)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.rest.isAdmin || currentUser.isAdmin) {
      fetchUser()
      fetchPost()
      fetchComment()
    }
  }, [currentUser])

  return (
    <div className=" p-3 md:mx-auto">
      <div className=" flex-wrap flex gap-4 justify-center">
        <div className=" flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className=" flex justify-between">
          <div className="">
            <h3 className=" text-gray-500 text-md uppercase">Total Users</h3>
            <p className=" text-2xl">{totalUsers}</p>
          </div>
          <FaUsersLine className=" text-white bg-teal-600 rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className=" flex gap-2 text-sm">
          <span className=" text-green-500 flex items-center">
            <FaLongArrowAltUp />
            { lastMonthUsers }
          </span>
          <div className=" text-gray-500">Last Month</div>
        </div>
      </div>
      <div className=" flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className=" flex justify-between">
          <div className="">
            <h3 className=" text-gray-500 text-md uppercase">Total Comments</h3>
            <p className=" text-2xl">{totalComments}</p>
          </div>
          <AiOutlineComment className=" text-white bg-indigo-600 rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className=" flex gap-2 text-sm">
          <span className=" text-green-500 flex items-center">
            <FaLongArrowAltUp />
            { lastMonthComments }
          </span>
          <div className=" text-gray-500">Last Month</div>
        </div>
      </div>
      <div className=" flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
        <div className=" flex justify-between">
          <div className="">
            <h3 className=" text-gray-500 text-md uppercase">Total Posts</h3>
            <p className=" text-2xl">{totalPosts}</p>
          </div>
          <HiDocumentText className=" text-white bg-lime-600 rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className=" flex gap-2 text-sm">
          <span className=" text-green-500 flex items-center">
            <FaLongArrowAltUp />
            { lastMonthPosts }
          </span>
          <div className=" text-gray-500">Last Month</div>
        </div>
      </div>
      </div>
      <div className=" flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className=" flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-5">
          <div className=" flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to='/dashboard?tab=users'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Full Name</Table.HeadCell>
            </TableHead>
            {users && users.map(user => (
              <Table.Body key={ user._id } className=" divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img src={user.photoUrl} alt="user" className=" w-10 h-10 rounded-full bg-gray-500" />
                  </Table.Cell>
                  <Table.Cell>
                    {user.firstname} {user.lastname}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div className=" flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-5">
          <div className=" flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to='/dashboard?tab=comments'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <Table.HeadCell>Comment Contents</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </TableHead>
            {comments && comments.map(comment => (
              <Table.Body key={ comment._id } className=" divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className=" w-80">
                    <p className=" line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>
                    {comment.numberOfLikes}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
        <div className=" flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-5">
          <div className=" flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to='/dashboard?tab=posts'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </TableHead>
            {posts && posts.map(post => (
              <Table.Body key={ post._id } className=" divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <img src={post.image} alt="post" className=" w-14 h-10 rounded-md bg-gray-500" />
                  </Table.Cell>
                  <Table.Cell className=" w-80">
                    {post.title}
                  </Table.Cell>
                  <Table.Cell className=" w-5">
                    {post.category}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DashboardComp