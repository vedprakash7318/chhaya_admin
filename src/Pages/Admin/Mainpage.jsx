import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Mainpage() {

    const navigate=useNavigate()
  useEffect(()=>{
    if(!localStorage.getItem("adminID")){
        navigate('/')
    }
  })
  return (
    <div>Mainpage</div>
  )
}

export default Mainpage