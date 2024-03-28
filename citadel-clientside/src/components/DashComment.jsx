import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { BsExclamationCircle } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const DashComment = () => {

  const { currentUser } = useSelector(state => state.user)
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentsIdToDelete] = useState('')

  console.log(comments)
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/getComments`, {
        withCredentials: true
      })
      if (res.status === 200) {
        setComments(res.data.comments)
        if (res.data.comments.length < 9) {
          setShowMore(false)
        }
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser.isAdmin || currentUser.rest.isAdmin) {
      fetchComments()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = comments.length

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/getPostComments?startIndex=${startIndex}`)
      if (res.status === 200) {
        setComments((prev) => [...prev, ...res.data.comments])
        if (res.data.comments.length < 2) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comment/deleteComment/${commentIdToDelete}`, {
        withCredentials: true
      })
      if (res.status === 202) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
      } else {
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=' table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {(currentUser.isAdmin || currentUser.rest.isAdmin) && (comments.length || comments) > 0 ? (
        <>
          <Table hoverable className=' shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment contents</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell >Delete</Table.HeadCell>
            </Table.Head>
            {
              comments.map((comment) => (
                <Table.Body key={comment._id} className=' divide-y'>
                  <Table.Row className=' bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>
                      { comment.numberOfLikes }
                    </Table.Cell>
                    <Table.Cell>
                      { comment.postId } 
                    </Table.Cell>
                    <Table.Cell>
                      {comment.userId}
                    </Table.Cell>
                    <Table.Cell>
                      <span className=' font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                        setShowModal(true)
                        setCommentsIdToDelete(comment._id)
                      }}>Delete</span>
                    </Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
              ))
            }
          </Table>
          {
            showMore && (
              <Button className=' w-full text-teal-500 self-center text-sm' color='white' onClick={handleShowMore}>Show More</Button>
            )
          }
        </>
      ) : (
        <div className="">
          <p>You have no comments yet</p>
        </div>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <BsExclamationCircle className=' h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className=' text-lg text-gray-500 mb-5 dark:text-gray-400'>Are you sure you want to delete this Comment?</h3>
            <div className=" flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteComment}>Yes, I'm Sure</Button>
              <Button onClick={() => setShowModal(false)} color='gray'>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComment