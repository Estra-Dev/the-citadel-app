import { Button } from 'flowbite-react'
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import {GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth"
import { app } from '../firebase';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom';

const Oauth = () => {

  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" })
    
    try {
      const resultFroomGoogle = await signInWithPopup(auth, provider)
      console.log(resultFroomGoogle)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
        firstname: resultFroomGoogle._tokenResponse.firstName,
        lastname: resultFroomGoogle._tokenResponse.lastName,
        email: resultFroomGoogle._tokenResponse.email,
        googlePhotoUrl: resultFroomGoogle._tokenResponse.photoUrl
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })

      console.log(res)
      if (res.status === 201) {
        dispatch(signInSuccess(res.data))
        navigate('/')

      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button type='button' gradientDuoTone={'pinkToOrange'} outline onClick={handleGoogleClick}>
      <FcGoogle className=' w-6 h-6' />
      <span className=' pl-2'>Continue with Google</span>
    </Button>
  )
}

export default Oauth