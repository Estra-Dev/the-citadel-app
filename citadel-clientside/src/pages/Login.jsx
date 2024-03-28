import axios from 'axios'
import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import Oauth from '../components/Oauth'

const Login = () => {

  const [details, setDetails] = useState({
    email: "",
    password: ""
  })

  const dispatch = useDispatch()
  const {loader, error: errorMsg} = useSelector(state => state.user)
  const navigate = useNavigate()


  const handleChange = (ev) => {
    const { name, value } = ev.target
    setDetails({ ...details, [name]: value.trim() })
    
  }
  console.log(details)
  
  const handleSubmit = async (ev) => {
    ev.preventDefault()
    dispatch(signInStart())
    if (details.email === '' || details.password === '') {
      return dispatch(signInFailure("Please fill out all Field"))
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, details, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })
      console.log(res)
      if (res.status === 201) {
        dispatch(signInSuccess(res.data))
        navigate('/')
      } else {
        dispatch(signInFailure(res.response.data.message))
      }
    } catch (error) {
      console.log(error)
      dispatch(signInFailure(error.response.data.message))
    }
  }

  return (
    <div className=' min-h-screen mt-20'>
      <div className=" flex flex-col lg:flex-row justify-center items-center gap-4">
        {/* left-side */}
        <div className=" w-[90%] md:w-[50%] lg:w-[35%] flex flex-col-reverse lg:flex-row justify-center items-center gap-3">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP9AonzRpCljbE5zQq1CCKFm-lKlMlvDkZjBlvA74cEA&s" alt="logo" className=' w-[70%] lg:w-[30%] rounded-full' />
          <div className="">
            <h1 className=' text-4xl font-bold mb-6 text-center'>Log In</h1>
            <p className=' text-sm font-semibold mb-2'>Welcome, this is an Official Web App for all Members of Citadel of Treasure Ministry, Kindly Log in to access your membership account</p>
            <i className=' text-[12px]'>A HOME OF NO FAILURE, NO DEFEAT</i>
          </div>
        </div>

        {/* right side */}
        <div className=" w-[90%] md:w-[60%] lg:w-[30%]">
          <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <TextInput type='email' placeholder='Email' name='email' value={details.email} onChange={handleChange} className=' mt-3' />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <TextInput type='password' placeholder='*******' name='password' value={details.password} onChange={handleChange} className=' mt-3' />
            </div>
            <Button type='submit' outline disabled={loader}>{loader ? (<>
              <Spinner /> 
              <span className=' pl-3'>Loading...</span>
            </>) : "Log In"}</Button>
            <Oauth />
          </form>
          {
            errorMsg && <Alert className=' mt-3' color='failure'>{ errorMsg }</Alert>
          }
          <div className=" flex gap-3 mt-2">
            <p>{"Don't"} have an account?</p>
            <Link to='/register' className=' text-blue-600 font-semibold'>
              Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login