import axios from 'axios'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux'
import {Button, Textarea} from 'flowbite-react'

// eslint-disable-next-line react/prop-types
const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const { currentUser } = useSelector(state => state.user)
  console.log(user)
  
  useEffect(() => {
    const getUser = async () => {
      try {
        // eslint-disable-next-line react/prop-types
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${comment.userId}`, {
          withCredentials: true
        })
        if (res.status === 200) {
          setUser(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [comment])
  
  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(comment.content)
  }

  const handleSave = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/comment/editComment/${comment._id}`, { content: editedContent}, {
        withCredentials: true
      })
      if (res.status === 200) {
        setIsEditing(false)
        onEdit(comment, editedContent)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=' flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className=" flex-shrink-0 mr-3">
        <img src={user.photoUrl} alt={user.firstname} className=' w-10 h-10 rounded-full bg-gray-200' />
      </div>
      <div className=" flex-1">
        <div className=" flex items-center mb-1 gap-1">
          <span className=' font-bold mr-1 text-sm truncate'>{user ? `@${user.firstname}_${user.lastname}` : "Anonymous user"}</span>
          <span className=' text-gray-500 text-xs'>
            {
              // eslint-disable-next-line react/prop-types
              moment(comment.createdAt).fromNow()
            }
          </span>
        </div>
        {
          isEditing ? (
            <>
              <Textarea className=' mb-2' value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
              <div className=" flex justify-end gap-2 text-xs">
                <Button type='button' size={'sm'} gradientDuoTone={'purpleToBlue'} onClick={handleSave}>Save</Button>
                <Button onClick={() => setIsEditing(false)} type='button' size={'sm'} gradientDuoTone={'purpleToBlue'} outline>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <p className=' text-gray-500 pb-2'>
                {
                  // eslint-disable-next-line react/prop-types
                  comment.content
                }
              </p>
              <div className=" flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button type='button' onClick={() => onLike(comment._id)} className={` text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser.rest._id || currentUser._id) && '!text-blue-500'}`}>
                  <FaThumbsUp className=' text-sm' />
                </button>
                <p className=' text-gray-400'>
                  {
                    // eslint-disable-next-line react/prop-types
                    comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'Like' : "Likes")
                  }
                </p>
                {
                  // eslint-disable-next-line react/prop-types
                  currentUser && ((currentUser.rest._id === comment.userId || currentUser._id === comment.userId) || (currentUser.rest.isAdmin || currentUser.isAdmin)) && (
                    <>
                      <button type='button' className=' text-gray-400 hover:text-blue-500' onClick={handleEdit}>
                        Edit
                      </button>
                      <button type='button' className=' text-gray-400 hover:text-red-500' onClick={() => onDelete(comment._id)}>
                        Delete
                      </button>
                    
                    </>
                  )
                }
              </div>
            
            </>
              
          )
        }
      </div>
    </div>
  )
}

export default Comment