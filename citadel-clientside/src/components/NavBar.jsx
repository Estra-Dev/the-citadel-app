import React, { useEffect, useState } from 'react'
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react"
import { FaSearch } from "react-icons/fa";
import { LuMoonStar, LuSun } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toogleTheme } from '../redux/theme/themeSlice';
import axios from 'axios';
import { signOutSuccess } from '../redux/user/userSlice';

const NavBar = () => {

  const path = useLocation().pathname
  const location = useLocation()
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.theme)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  console.log(searchTerm)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
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

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  return (
    <Navbar className=' border-b-2'>
      <div className=" flex gap-4 items-center">
        <Link to={'/'} className=" flex flex-col">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP9AonzRpCljbE5zQq1CCKFm-lKlMlvDkZjBlvA74cEA&s" alt="logo" className=' w-9 h-9 rounded-full self-center' />
          <p className=' text-[10px] font-bold mt-1'>CITADEL</p>
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search...' rightIcon={FaSearch} className=' hidden md:inline'/>
        </form>
        <Button className=' md:hidden w-12 h-10' color='gray' pill>
          <FaSearch />
        </Button>
      </div>


      <div className=" flex gap-2 md:order-2">
        <Button className=' w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toogleTheme())}>
          {theme === 'light' ? (<LuMoonStar />) : (<LuSun />) }
          
        </Button>
        {
          currentUser ? (
            <Dropdown arrowIcon={false} inline label={
              <Avatar alt='user' img={currentUser.photoUrl || currentUser.rest.photoUrl} rounded />
            }>
              <Dropdown.Header>
                <span className=' block text-sm'>{ currentUser.firstname || currentUser.rest.firstname} { currentUser.lastname || currentUser.rest.lastname}</span>
                <span className=' block text-sm font-medium truncate'>{ currentUser.email || currentUser.rest.email  }</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          ): (
            <Link to={"/login"}>
              <Button gradientDuoTone={"purpleToBlue"} outline>
                Login
              </Button>
            </Link>
            
          )
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={'div'} active={path === '/'}>
          <Link to={'/'}>
            Feed
          </Link>
        </Navbar.Link>
        <Navbar.Link as={'div'} active={path === '/activities'}>
          <Link to={'/activities'}>
            Activities
          </Link>
        </Navbar.Link>
        <Navbar.Link as={'div'} active={path === '/about'}>
          <Link to={'/about'}>
            About
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar