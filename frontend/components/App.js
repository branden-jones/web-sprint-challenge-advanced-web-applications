import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { ProtectedRoute } from './ProtectedRoute'

import axiosWithAuth from '../axios/index';

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()

  const redirectToLogin = () => { /* ✨ implement */ 
  }

  const redirectToArticles = () => { /* ✨ implement */
  }

// useEffect(() => {
//   const token = localStorage.getItem('token')
//   token !== null && token !== undefined && token !== false ? redirectToArticles() : redirectToLogin();
//   console.log(token)
// }, [spinnerOn])


  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage(`Goodbye!`)
    navigate('/')
  }

  const login = ({ username, password }) => {
    setSpinnerOn(true)
    setMessage('')
    axiosWithAuth()
        .post(loginUrl, { username: username, password: password })
        .then((res) => {
          setSpinnerOn(false)
          localStorage.setItem('token', res.data.token);
          setMessage(res.data.message)
          navigate('articles');
        })
        .catch((err) => {
        setSpinnerOn(false)
        setMessage(err.response.data)
        })
  }

  const getArticles = () => {
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setSpinnerOn(false);
        setMessage(res.data.message);
        setArticles(res.data.articles)
      })
      .catch((err) => {
        setSpinnerOn(false);
        setMessage(`${err.response.data.message}, ${err.response.statusText}`)
      })
  }

  const postArticle = article => {
    setSpinnerOn(true)
    setMessage('')
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        setSpinnerOn(false);
        setMessage(res.data.message)
        setArticles(res.data.article)
      })
      .catch(err => {
        setSpinnerOn(false);
        setMessage(`${err.response.data.message}, ${err.response.statusText}`)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        setSpinnerOn(false);
        setMessage(res.data.message)
      })
      .catch(err => {
        setSpinnerOn(false);
        setMessage(`${err.response.data.message}, ${err.response.statusText}`)
      })
  }


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={() => logout()}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/" onClick={() => redirectToLogin()}>Login</NavLink>
          <NavLink id="articlesScreen" to="/articles" >Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} setSpinnerOn={setSpinnerOn} />} />
          <Route path="articles"  element={
            <ProtectedRoute>
              <ArticleForm postArticle={postArticle}  />
              <Articles getArticles={getArticles} updateArticle={updateArticle} deleteArticle={deleteArticle} articles={articles} />
            </ProtectedRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
