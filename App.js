import React, { useState, useEffect } from 'react';
import './App.css';
import { db, auth } from './firebase';
import Post from './Post';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input,  } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Login (signin and signup)...
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username for signin
        } else {
          // created new one for signup
          return authUser.updateProfile({
            displayName: username 
          })
        }
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // performing cleanup actions   
      unsubscribe();
    }
  }, [user, username]);
  
  useEffect (() => {
    db.collection('posts').onSnapshot(snapshot => {
      // this code runs, every time new post is uploaded...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []); 

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      // .this((authUser) => {
      //   return authUser.updateProfile({
      //     displayName: username 
      //   })
      // })
      .catch((error) => alert(error.message)) // provide backend validation

      setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
     
    setOpenSignIn(false);
  }

  return (
    <div className="App">
      {/* Modal for User Authentication */}
      {/* Sign up */}
      <Modal
        open={open}
        onClose={() => { setOpen(false) }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(event) => {setUsername(event.target.value)}}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(event) => {setEmail(event.target.value)}}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => {setPassword(event.target.value)}}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

       {/* Sign In */}
      <Modal
        open={openSignIn}
        onClose={() => { setOpenSignIn(false) }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signin">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(event) => {setEmail(event.target.value)}}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => {setPassword(event.target.value)}}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        {/* SignIn, SignUp and LogOut functionality */}
        { user ? (
          <Button onClick={() => {auth.signOut()}}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => {setOpenSignIn(true)}}>SignIn</Button>
            <Button onClick={() => {setOpen(true)}}>SignUp</Button>
          </div>
        )}
      </div> 

      <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
      </div>

      
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to update a post</h3>
      )}

    </div>
  );
}

export default App;
