import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import OverlayEdit from './Feed/EditOverlay/OverlayEdit';
import Feed from './Feed/Feed';
import Form from './Form';
import Home from './Home/Home';
import Navbar from './Navbar/Navbar';
import Post from './Post/Post';
import Profile from './Profile/Profile';
import Login from './SingUp/Login';
import SignUp from './SingUp/SignUp';

function App() {

  return (
    <>
      <Router  basename="/SharePost">
        <Navbar/>
        <Routes>
          <Route exact path='/'  element={<Login/>}/>
          <Route path='home' element={<Home/>}/>
          <Route path='signUp' element={<SignUp/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='form' element={<Form/>}/>
          <Route path='o' element={<OverlayEdit/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
