import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios'
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { BsExclamationCircle } from "react-icons/bs";
import {Link} from 'react-router-dom'

const DashProfile = () => {

  const { currentUser, error, loader } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null)
  const [formData, setFormData] = useState({})
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const dispatch = useDispatch()



  // To enable us pick image when we click on the profile image
  const filePickerRef = useRef()

  const handleImageChange = (ev) => {

    const file = ev.target.files[0]

    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }

  }

  // anytime we have a new image, we have to upload it automatically by using useEffect()
  useEffect(() => {
    if (imageFile) {
      uploadImg()
    }
  }, [imageFile])

  const uploadImg = async () => {
    // If I need the code again
    //   service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 14 * 1024 * 1024 && 
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setImageFileUploadingProgress(null)
    const storage = getStorage(app)
    // to make the image name unique we add the new Date().getTime()
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)

    // uploadtask is a method we want to use to upload our image and get the information while it is uploading e.g: the amount of byte that is uploading
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadingProgress(progress.toFixed(0))
      },
      (error) => {
        setImageFileUploadingError("Could not Upload Image")
        setImageFileUploadingProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl)
          setFormData({ ...formData, googlePhotoUrl: downloadUrl })
          setImageFileUploading(false)
        })
      }
    )

  }

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setFormData({...formData, [name]: value})
  }
  console.log(formData)
  
  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setUpdateUserSuccess(null)
    setUpdateUserError(null)
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('Nothing to Update')
      return
    }
    if (imageFileUploading) {
      setUpdateUserError('Wait for image to upload')
      return
    }
    try {
      dispatch(updateStart())
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update/${currentUser._id || currentUser.rest._id}`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })
      if (res.status === 201) {
        dispatch(updateSuccess(res.data))
        setUpdateUserSuccess("User Profile updated successfully")
      } else {
        setUpdateUserError(res.data)
        dispatch(updateFailure(res.data))
      }
      console.log(res)
    } catch (error) {
      console.log(error)
      setUpdateUserError(error.response.data.message)
      return dispatch(updateFailure(error.response.data.message))
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete/${currentUser._id || currentUser.rest._id}`, {
        headers: { authorization: currentUser.token },
        withCredentials: true
      })
      console.log(res)
      if (res.status !== 202) {
        dispatch(deleteUserFailure(res.data))
      } else {
        dispatch(deleteUserSuccess())
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signout`)
      if (res.status !== 200) {
        console.log(res.data)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=' max-w-lg mx-auto p-3 w-full'>
      <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>

      <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className=" w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden relative" onClick={() => filePickerRef.current.click()}>
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`
                }
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.photoUrl || currentUser.rest.photoUrl} alt="profile img" className={` rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} />
        </div>
        {
          imageFileUploadingError && (
            <Alert color={'failure'}>{ imageFileUploadingError }</Alert>
          )
        }
        <TextInput type='text' name='firstname' placeholder='Firstname' defaultValue={ currentUser.firstname || currentUser.rest.firstname} onChange={handleChange} />
        <TextInput type='text' name='lastname' placeholder='Lastname' defaultValue={ currentUser.lastname || currentUser.rest.lastname } onChange={handleChange} />
        <TextInput type='email' name='email' placeholder='Email' defaultValue={ currentUser.email || currentUser.rest.email} onChange={handleChange}/>
        <TextInput type='password' name='password' placeholder='*********' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline disabled={loader || imageFileUploading}>{ loader? (<><Spinner /> Loading...</>) : 'Update' }</Button>
        {
          (currentUser.isAdmin || currentUser.rest.isAdmin) && (
            <Link to={'/create-post'}>
              <Button
                type='button'
                gradientDuoTone={'purpleToPink'}
                className=' w-full'
              >Create Post</Button>
            </Link>
          )
        }
      </form>
      <div className=" text-red-500 flex justify-between mt-3">
        <span onClick={() => setShowModal(true)} className=' cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className=' cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color={'success'} className=' mt-5'>{ updateUserSuccess }</Alert>
      )}
      {updateUserError && (
        <Alert color={'failure'} className=' mt-5'>{ updateUserError }</Alert>
      )}
      {error && (
        <Alert color={'failure'} className=' mt-5'>{ error }</Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <BsExclamationCircle className=' h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className=' text-lg text-gray-500 mb-5 dark:text-gray-400'>Are you sure you want to delete your Account?</h3>
            <div className=" flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm Sure</Button>
              <Button onClick={() => setShowModal(false)} color='gray'>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile