import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import gameimg from './logo (1).png'
import { Link } from 'react-router-dom'


export default function Login({saveUserData}) {

  let navigate= useNavigate(); //hoke
  const [errorList, seterrorList]= useState([]); 
  const [user,setUser] =useState({
    email:'',
    password:''
  })
  const [error , setError]= useState('')
  const [isLoading, setisLoading] =useState(false)

async function sendLoginDataToApi(){
  let {data}= await axios.post(`https://sticky-note-fe.vercel.app/signin`,user);
  if(data.message == 'success'){
    setisLoading(false)
    localStorage.setItem('userToken', data.token);
    saveUserData();
    navigate('/');

  }
  else{
    setisLoading(false)
    setError(data.message)
  }
}
function submitLoginForm(e){
  e.preventDefault();
  setisLoading(true)
  let validation = validateLoginForm();
  console.log(validation);
  if(validation.error){
    setisLoading(false)
    seterrorList(validation.error.details)

  }else{
    sendLoginDataToApi();
  }

}

  function getUserData(e){
    let myUser={...user};
    myUser[e.target.name]= e.target.value;
    setUser(myUser);
    console.log(myUser);
  }

  function validateLoginForm(){
    let scheme= Joi.object({
      email:Joi.string().email({ tlds: { allow: ['com', 'net'] }}).required(),
      password:Joi.string().pattern(/^[a-z]{3,6}/)

    });
    return scheme.validate(user, {abortEarly:false});
  }
  return (
    <>
    <div className='sign-bg min-vh-100 d-flex justify-content-center align-items-center'>
      <div className='sign-layout w-75 m-auto p-2 '>
        <div className="caption text-center">
        <img src={gameimg} className='gameimg w-25' alt="" />
        <h1 className='h3'>Log in to GameOver</h1>
        </div>
    {errorList.map((err,index)=>{
      if(err.context.label ==='password'){
        return <div key={index} className="alert alert-danger my-2 w-75 m-auto">password invalid ,should begain with 3 characters at least and numbers</div>
      }
   
    })}
    {error.length >0 ?<div className='alert alert-danger my-2'>{error}</div>:''}
    <form onSubmit={submitLoginForm} className='my-3 w-75 m-auto' action="">
      <label htmlFor="email">Email :</label>
      <input onChange={getUserData} type="email" className='my-input my-2 form-control' name='email' id='email' />
      {errorList.filter((err)=> err.context.label == 'email')[0]?
      <div className="alert alert-danger my-2">{errorList.filter((err)=> err.context.label =='email')[0]?.message}</div>:''
      }
      <label htmlFor="password">Password :</label>
      <input onChange={getUserData} type="password" className='my-input my-2 form-control' name='password' id='password' />

      <button className='btn btn-primary'>
        {isLoading == true?<i class="fa-solid fa-spinner fa-spin"></i>:'login'}
      </button>
     </form>
     <div className='text-center sign-footer'>
      <p>Not a member yet? <Link className='sign-link' to='/register'>Create Account<i className="fa-solid fa-chevron-right"></i></Link> </p>
     </div>
     </div>
     </div>
    </>
  )
}
