import React from 'react'
import './Navigation.css'
import { Link } from 'react-router-dom';


export const Navigation = () => {
  return (
    <div >
        <div className="navbar">

            <h2>Chat-App</h2>
            <ul className="nav-items">
                <Link to ='/home'> <li className='nav-item'>Home</li></Link>
                <Link to = '/login'> <li className='nav-item'>Login</li></Link>
                <Link to= '/register'><li className='nav-item'>Register</li></Link>
            </ul>

        </div>
    </div>
  )
}
