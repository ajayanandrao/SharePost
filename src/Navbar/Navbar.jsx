import "./Navbar.scss";
// import aj from "./../../img/203.png";
import { RiHomeFill, RiSearchFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { auth, db } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { BsFillHeartFill, BsMessenger } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContaxt";
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { Avatar } from "@mui/material";

const openNav = () => {
  document.getElementById("mySidenav").style.width = "300px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

const Navbar = () => {

  const nav = useNavigate();
  const { currentuser } = useContext(AuthContext);

  const dataRef = collection(db, "users");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(dataRef, (snapshot) => {
      setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        document.getElementById("navId").style.display = "flex";
      } else {
        document.getElementById("navId").style.display = "none";
      }
    });
    return unsub;
  }, []);

  const SignOut = async () => {

    const PresenceRef = doc(db, "userPresece", currentuser.uid);

    await updateDoc(PresenceRef, {
      status: "Offline",
    });

    const PresenceRefOnline = doc(db, "OnlyOnline", currentuser.uid);
    await deleteDoc(PresenceRefOnline);

    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });

    nav("/");
  };

  const [search, setSearch] = useState("");

  // =========

  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {

    const colRef = collection(db, 'friendRequests')
    const userlist = () => {
      onSnapshot(colRef, (snapshot) => {
        let newbooks = []
        snapshot.docs.forEach((doc) => {
          newbooks.push({ ...doc.data(), id: doc.id })
        });
        setFriendRequests(newbooks);
      })
    };
    return userlist();
  }, []);


  return (
    <>
      <div className="navbartop" style={{ display: "none" }} id="navId" >
        <div className="container-fluid al-center">
          <RxHamburgerMenu className="navbar-lines" onClick={openNav} />
          <div className="navbar-name">
            <Link to="/" className="link ajay">
              Ajay
            </Link>
          </div>

          <div id="mySidenav" className="sidenav">
            <span className="closebtn" onClick={closeNav}>
              &times;
            </span>

            <Link to="/profile">
              <div className="nav-profile-c" onClick={closeNav} id="profile-c">
                <img
                  src={currentuser && currentuser.photoURL}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  alt=""
                />
                <span style={{ textTransform: "capitalize" }}>
                  {currentuser && currentuser.displayName}
                </span>
              </div>
            </Link>

            <hr />
            <div className="nav-link">
              <Link to="/" onClick={closeNav} className="a">
                <span className="icon-c">

                  <div className="sidenave-icon">
                    <img src="https://www.elevenforum.com/data/attachments/33/33648-91edd6d3b7604f5686529b4a2a4aa43c.jpg" style={{ width: "25px" }} className="nav-icon" alt="" />
                  </div>

                  <div className="sidenav-text">
                    Home
                  </div>
                </span>
              </Link>

              <a href="#" onClick={closeNav} className="a">
                <span className="icon-c">
                  <div className="sidenave-icon">
                    <span className="nav-icon notifiaction" >🔔</span>
                  </div>

                  <div className="sidenav-text">
                    Notification <div className="noti-count">{friendRequests.length}</div> 
                  </div>
                </span>
              </a>

              <a href="#" onClick={closeNav} className="a">
                <span className="icon-c">
                  <div className="sidenave-icon">
                    {/* <span className="nav-icon notifiaction" >🔔</span> */}
                    <i class="bi bi-person-heart nav-icon"></i>
                  </div>

                  <div className="sidenav-text">
                    Request
                  </div>
                </span>
              </a>

              <a href="#" onClick={closeNav} className="a">
                <span className="icon-c">
                  <div className="sidenave-icon">
                    <img src="https://scontent.fpnq13-2.fna.fbcdn.net/v/t39.8562-6/120009688_325579128711709_1736249742330805861_n.png?_nc_cat=1&ccb=1-7&_nc_sid=6825c5&_nc_ohc=HNZTijLo3_IAX_GfPt4&_nc_ht=scontent.fpnq13-2.fna&oh=00_AfAqeNnJJrP6Gl3KrHrM4cekb1vHmDLVIru8mdSnJwsVXg&oe=6481A8FD" className="nav-icon" style={{ width: "24px" }} alt="" />
                  </div>
                  <div className="sidenav-text">
                    Message
                  </div>
                </span>
              </a>

              <a href="#" className="a" onClick={SignOut} type="button">
                <span onClick={closeNav} className="icon-c">
                  <div className="sidenave-icon">
                    <IoLogOut
                      className="nav-icon duar"

                    />
                  </div>
                  <div className="sidenav-text">
                    Log out
                  </div>
                </span>
              </a>
            </div>
          </div>

          <div className="navbar-items">
            <div className="navbar-search-c">
              <input
                type="text"
                placeholder="Search friends..."
                className="navbar-search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <RiSearchFill className="nav-icon" />
            </div>
          </div>

          <div className="navbar-profile">
            <div className="navbar-inner-profile">
              <div className="n-icons">
                <BsMessenger
                  className="nav-icon"
                  style={{ fontSize: "21px" }}
                />
                <BsFillHeartFill
                  className="nav-icon"
                  style={{ fontSize: "21px" }}
                />
              </div>
              <div className="ms-5 dropdown">
                <img
                  src={currentuser && currentuser.photoURL}
                  className="navbar-profile-img dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  alt=""
                />
                <ul className="dropdown-menu ">
                  <li>
                    <Link to="/profile" className="link">
                      <button className="dropdown-item" type="button">
                        Profile
                      </button>
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" type="button">
                      Setting
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={SignOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Navbar;
