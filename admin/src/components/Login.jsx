import React from 'react'

const Login = () => {
  return (
    <div>
      <div>
        <h1>Admin Panel</h1>
        <form>
            <div>
                <p>Email Address</p>
                <input type="email" placeholder='your@gmail.com' required/>
                
            </div>
            <div>
                <p>Email Address</p>
                <input type="password" placeholder='Enter your Password' required/>
                
            </div>
            <button type="Submit">Login</button>
        </form>

        </div>

    </div>
  )
}

export default Login
