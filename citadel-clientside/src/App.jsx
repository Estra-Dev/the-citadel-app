import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import NavBar from "./components/NavBar"
import Feed from "./pages/Feed"
import Activities from "./pages/Activities"
import About from "./pages/About"
import Register from "./pages/Register"
import Login from "./pages/Login"
import FooterComponent from "./components/FooterComponent"
import Dashboard from "./pages/Dashboard"
import { useSelector } from "react-redux"
import PrivateRoute from "./components/PrivateRoute"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollTop from "./components/ScrollTop"
import Search from "./pages/Search"

function App() {

  const {currentUser} = useSelector(state => state.user)

  return (
    <>
      <Router>
        <ScrollTop />
        <NavBar />
        <Routes>
          <Route path="/" element={currentUser ? <Feed /> : <Login />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>
        <FooterComponent />
      </Router>
    </>
  )
}

export default App
