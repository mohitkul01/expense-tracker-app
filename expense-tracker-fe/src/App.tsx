import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import OCRUploaderWithForm from "./components/OCRUploaderWithForm"


const App: React.FC = () => {
  return (
    <>
    <Router>
    <Navbar />
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/" Component={Home}></Route>
        <Route path="/ocr" Component={OCRUploaderWithForm}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
