import './login.css'
import React, { useState, useContext, useEffect, useRef } from 'react'
import Form from './Form'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../Components/ContexApi/Contex';
import { addUser } from '../REDUX/features';
import { clearUser } from '../REDUX/features';
import { useDispatch,useSelector } from 'react-redux';
import { HiHome } from "react-icons/hi";
export default function Login({ }) {
  const dispach = useDispatch()
  const [view, setView] = useState(false)
  const [verifyAlert, setverifyAlert] = useState(false)
  const inputRef = useRef('')
  const { changeTheme, display } = useContext(ThemeContext)
  const user = useSelector((state) => state.Commerce.user)
  const Navigate = useNavigate()
  const [value, setValue] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    setverifyAlert(true)
    setTimeout(() => {
      setverifyAlert(false)
    }, 5000);
  }, [])

  const logOut = async () => {
    const res = await axios.post(`https://safehomefurniture.onrender.com/api/logout/:${user[0]?.data.data._id}`)
    console.log(res.data)
    res.status === 200 ? dispach(clearUser()) : null
    res.status === 200 ? Navigate('/login') : null
    setverifyAlert(true)
    setTimeout(() => {
      setverifyAlert(false)
    }, 5000);
  }

  const userSign = async () => {
    await axios.post("https://safehomefurniture.onrender.com/api/Login", value)
      .then(function (res) {
        console.log(res.data)
        res.data.data.email === value.email ? dispach(addUser(res)) : null
        if (res.data.data.verify === true) {
          res.data.data.email === value.email ? Navigate('/') : null
        } else {
          logOut()
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  const input = [
    {
      id: 1,
      placeholder: "Email",
      type: "email",
      name: "email",
      err: "not a valid email",
      required: true
    },
    {
      id: 2,
      placeholder: "Password",
      type: view ? "text" : "password",
      name: "password",
      err: "forget password",
    }
  ]

  const [focus, setFocus] = useState(false)

  const handleFocus = (e) => {
    setFocus(true)
  }

  const onChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    !display && changeTheme()
  }, [])

  return (

    <div className='login_in'>
      {verifyAlert && <div className='verifyAlert'>
        <p>please check your Email for a verification link</p>
        {/* <a href='mailto:nwachukwuoparah@gmail.com'>Verify</a> */}
      </div>}
      <HiHome onClick={() => { Navigate('/') }} className='login_Home pointer' />
      <div className='login_in_Wrap'>
        <div className='login_in_Wrap_head'>
          <img className='pointer' onClick={() => { Navigate('/') }} style={{ width: 200 }} src='/Union.svg' />
          <h1> Log into account</h1>
        </div>

        <form className='form_wrap' onSubmit={() => { event.preventDefault(); }}>
          {input.map((i) => (
            <Form key={i.id} {...i} view={view} setView={setView} onChange={onChange} />
          ))}

          <div className='login_action'>
            <button onClick={() => { userSign() }} className='login_button pointer'>Sign in</button>
            {/* <div className='login_button pointer'>
             
            </div> */}
            <span className='login_label'><p>Don’t have an account?</p> <p className='pointer' style={{ color: "#0056FC" }} onClick={() => Navigate('/signUp')}>Sign up</p></span>
          </div>
        </form>
      </div>
    </div>

  )

}