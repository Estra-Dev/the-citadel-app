import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import axios from "axios"
import {Link, useNavigate} from 'react-router-dom'

const Register = () => {

  const [details, setDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  })

  const [loader, setLoader] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()


  const handleChange = (ev) => {
    const { name, value } = ev.target
    setDetails({ ...details, [name]: value.trim() })
    
  }
  console.log(details)

  const handleSubmit = async(ev) => {
    ev.preventDefault()
    setErrorMsg(null)
    setLoader(true)

    if (details.firstname === '' || details.lastname === '' || details.email === '' || details.password === '') {
      setLoader(false)
      return setErrorMsg("Please fill out all Field")
      
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, details, {
        headers: {"Content-Type": "application/json"}
      })
      if (res.status === 201) {
        navigate('/login')
      } else {
        setErrorMsg(res.response.data.message)
      }
      console.log(res)
    } catch (error) {
      setErrorMsg(error.response.data.message)
      console.log(error)
    }
    setLoader(false)
  }

  return (
    <div className=' min-h-screen mt-20'>
      <div className=" flex flex-col md:flex-row justify-center items-center gap-4 max-w-5xl mx-auto p-3">
        {/* left-side */}
        <div className=" flex flex-1 flex-col-reverse lg:flex-row justify-center items-center gap-3">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP9AonzRpCljbE5zQq1CCKFm-lKlMlvDkZjBlvA74cEA&s" alt="logo" className=' w-[60%] lg:w-[30%] rounded-full self-center' />
          <div className="">
            <h1 className=' text-2xl font-bold mb-6 text-center'>Create a membership account</h1>
            <p className=' text-sm font-semibold mb-2'>Welcome, this is an Official Web App for all Members of Citadel of Treasure Ministry, Kindly register your membership</p>
            <i className=' text-[12px]'>A HOME OF NO FAILURE, NO DEFEAT</i>
          </div>
        </div>

        {/* right side */}
        <div className=" flex-1">
          <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstname">Firstname</label>
              <TextInput type='text' placeholder='Firstname' name='firstname' value={details.firstname} onChange={handleChange} className=' mt-3' />
            </div>
            <div>
              <label htmlFor="lastname">lastname</label>
              <TextInput type='text' placeholder='Lastname' name='lastname' value={details.lastname} onChange={handleChange} className=' mt-3' />
            </div>
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
            </>) : "Register"}</Button>
          </form>
          {
            errorMsg && <Alert className=' mt-3' color='failure'>{ errorMsg }</Alert>
          }
          <div className=" flex gap-3 mt-2">
            <p>Already have an account?</p>
            <Link to='/login' className=' text-blue-600 font-semibold'>
              Log In
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register