import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { FaUserTie } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { HiDocumentText } from "react-icons/hi";
import { HiMiniUsers } from "react-icons/hi2";
import { AiOutlineComment } from "react-icons/ai";
import { RiDashboard2Fill } from "react-icons/ri";

const DashSidebar = () => {

  const dispatch = useDispatch()
  const location = useLocation()
  const [tab, setTab] = useState("")
  const {currentUser} = useSelector(state => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    console.log(tabFromUrl)
    
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

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
    <Sidebar className=' w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className=' flex flex-col gap-1'>
          {
            (currentUser.isAdmin || currentUser.rest.isAdmin) && (
              <Link to={'/dashboard?tab=dash'}>
                <Sidebar.Item active={tab==="dash" || !tab} icon={RiDashboard2Fill} as='div'>Dashboard</Sidebar.Item>
              </Link>
            )
          }
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item active={tab === 'profile'} icon={FaUserTie} label={(currentUser.isAdmin || currentUser.rest.isAdmin) ? "Admin" : "User"} labelColor="dark" as='p'>
              Profile
            </Sidebar.Item>
          </Link>
          
          {
            (currentUser.isAdmin || currentUser.rest.isAdmin) && (
              <Link to={'/dashboard?tab=posts'}>
                <Sidebar.Item active={tab==="posts"} icon={HiDocumentText} as='div'>Posts</Sidebar.Item>
              </Link>
            )
          }
          {
            (currentUser.isAdmin || currentUser.rest.isAdmin) && (
              <Link to={'/dashboard?tab=users'}>
                <Sidebar.Item active={tab==="users"} icon={HiMiniUsers} as='div'>Users</Sidebar.Item>
              </Link>
            )
          }
          {
            (currentUser.isAdmin || currentUser.rest.isAdmin) && (
              <Link to={'/dashboard?tab=comments'}>
                <Sidebar.Item active={tab==="comments"} icon={AiOutlineComment} as='div'>Comments</Sidebar.Item>
              </Link>
            )
          }
          
          <Sidebar.Item icon={FaSignOutAlt} className=' cursor-pointer' as='p' onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar