import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import { Link } from 'react-router-dom'

export default function Register() {

  let navigate= useNavigate(); //hoke
  const [errorList, seterrorList]= useState([]); 
  const [user,setUser] =useState({
    first_name:'',
    last_name:'',
    age:0,
    email:'',
    password:''
  })
  const [error , setError]= useState('')
  const [isLoading, setisLoading] =useState(false)

async function sendRegisterDataToApi(){
  let {data}= await axios.post(`https://sticky-note-fe.vercel.app/signup`,user); 
  if(data.message == 'success'){
    setisLoading(false)
    navigate('/login')

  }
  else{
    setisLoading(false)
    setError(data.message)
  }
}
function submitRegisterForm(e){
  e.preventDefault();
  setisLoading(true)
  let validation = validateRegisterForm();
  console.log(validation);
  if(validation.error){
    setisLoading(false)
    seterrorList(validation.error.details)

  }else{
    sendRegisterDataToApi();
  }

}

  function getUserData(e){
    let myUser={...user};
    myUser[e.target.name]= e.target.value;
    setUser(myUser);
    console.log(myUser);
  }

  function validateRegisterForm(){
    let scheme= Joi.object({
      first_name:Joi.string().min(3).max(10).required(),
      last_name:Joi.string().min(3).max(10).required(),
      age:Joi.number().min(12).max(80).required(),
      email:Joi.string().email({ tlds: { allow: ['com', 'net'] }}).required(),
      password:Joi.string().pattern(/^[a-z]{3,6}/)

    });
    return scheme.validate(user, {abortEarly:false});
  }
  return (
    <>
    <div className='sign-bg min-vh-100 d-flex justify-content-center align-items-center'>
      <div className='sign-layout w-75 my-5 p-5 '>
        <div className="caption text-center">
        <h1 className='h3'>Create My Account!</h1>
        </div>
    {errorList.map((err,index)=>{
      if(err.context.label ==='password'){
        return <div key={index} className="alert alert-danger my-2 w-75 m-auto">password invalid ,should begain with 3 characters at least and numbers</div>
      }
      
    })}
    {error.length >0 ?<div className='alert alert-danger my-2'>{error}</div>:''}
    <form onSubmit={submitRegisterForm} className='my-3 w-75 m-auto' action="">
      
      <input onChange={getUserData} type="text" className='my-input my-2 form-control' placeholder='First Name' name='first_name' id='first_name' />
      {errorList.filter((err)=> err.context.label == 'first_name')[0]?
      <div className="alert alert-danger my-2 nameinput">{errorList.filter((err)=> err.context.label =='first_name')[0]?.message}</div>:''
      }
      <input onChange={getUserData} type="text" className='my-input my-2 form-control  ' placeholder='Last Name' name='last_name' id='last_name' />
      {errorList.filter((err)=> err.context.label == 'last_name')[0]?
      <div className="alert alert-danger my-2 nameinput">{errorList.filter((err)=> err.context.label =='last_name')[0]?.message}</div>:''
      }
    
      <input onChange={getUserData} type="number" placeholder='Age' className='my-input my-2 form-control' name='age' id='age' />
      {errorList.filter((err)=> err.context.label == 'age')[0]?
      <div className="alert alert-danger my-2 ">{errorList.filter((err)=> err.context.label =='age')[0]?.message}</div>:''
      }
      <input onChange={getUserData} type="email" placeholder='Email' className='my-input my-2 form-control' name='email' id='email' />
      {errorList.filter((err)=> err.context.label == 'email')[0]?
      <div className="alert alert-danger my-2">{errorList.filter((err)=> err.context.label =='email')[0]?.message}</div>:''
      }
      <input onChange={getUserData} type="password" placeholder='Password' className='my-input my-2 form-control' name='password' id='password' />

      <button className='btn btn-primary'>
        {isLoading == true?<i class="fa-solid fa-spinner fa-spin"></i>:'register'}
      </button>
     </form>
     <div className='text-center sign-footer'>
      <p>Already a member? <Link className='sign-link' to='/login'>Log In<i className="fa-solid fa-chevron-right"></i></Link> </p>
     </div>
     </div>
     </div>
    </>
  )
}
