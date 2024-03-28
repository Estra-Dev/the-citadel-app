import axios from 'axios'
import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'
import { BsExclamationCircle } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
const CommentSection = ({ postId }) => {
  
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [comments, setComments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (comment.length > 200) {
      return
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/comment/create`, {
        content: comment,
        postId,
        userId: currentUser.rest._id || currentUser._id
      }, {
        withCredentials: true
      })
      if (res.status === 200) {
        setComment('')
        setCommentError(null)
        setComments([res.data, ...comments])
      }
    } catch (error) {
      setCommentError(error.response.data.message)
      console.log(error)
    }
  }

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/getPostComments/${postId}`)
        if (res.status === 200) {
          setComments(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getComments()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/login');
        return
      }
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/comment/likeComment/${commentId}`, {}, {
        withCredentials: true
      })

      if ((res.status === 200)) {
        setComments(comments.map(comment => {
          comment._id === commentId ? {
            ...comment,
            likes: res.data.likes,
            numberOfLikes: res.data.likes.length
          } : comment
        }))
        
      }
      console.log(comments)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map(c => {
        c._id === comment._id ? {...c, content: editedComment} : c
      })
    )
  }

  const handleDelete = async (commentId) => {
    setShowModal(false)
    try {
      if (!currentUser) {
        navigate('/login')
      }
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comment/deleteComment/${commentId}`, {
        withCredentials: true
      })
      if (res.status === 200) {
        
        setComments(
          comments.filter(comment => comment._id !== comment)
        )
         
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=' max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
          <div className=" flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <img className=' h-5 w-5 object-cover rounded-full' src={currentUser.rest.photoUrl || currentUser.photoUrl} alt={currentUser.rest.email || currentUser.email} />
            <Link to={'/dashboard?tab=profile'} className=' text-xs text-cyan-600 hover:underline'>@{ currentUser.rest.email || currentUser.email }</Link>
          </div>
        ) : (<div className=' text-sm text-teal-500 my-5 flex gap-1'>
              You must Log in to Comment. 
              <Link to={'/login'} className=' text-blue-500 hover:underline'>Log In</Link>
            </div>)
      }
      {currentUser && (
        <form className=' border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
          <Textarea
            placeholder='Add a comment...'
            rows={'3'}
            maxLength={'200'}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          {commentError && (
            <Alert color={'failure'} className=' mt-5'>{ commentError }</Alert>
          )}
          <div className=" flex justify-between items-center mt-5">
            <p className=' text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
            <Button type='submit' outline gradientDuoTone={'purpleToBlue'}>Submit</Button>
          </div>
        </form>
      )}
      {comments === 0 ? (
        <p className=' text-sm my-5'>No Comments yet!</p>
      ) : (
          <>
            <div className=" text-sm my-5 flex item-center gap-1">
              <p>Comments</p>
              <div className=" border border-gray-400 py-1 px-2 rounded-sm">
                <p>{ comments.length }</p>
              </div>
            </div>
            {comments.map(comment => (
              <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {
                setShowModal(true)
                setCommentToDelete(commentId)
              } } />
            ))}
          </>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <BsExclamationCircle className=' h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className=' text-lg text-gray-500 mb-5 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
            <div className=" flex justify-center gap-4">
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Yes, I'm Sure</Button>
              <Button onClick={() => setShowModal(false)} color='gray'>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection