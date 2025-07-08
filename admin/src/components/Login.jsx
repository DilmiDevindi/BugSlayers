import React from 'react'

const Login = () => {
  return (
    <div>
      <div>
        <h1>Admin Panel</h1>
        <form>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                <input className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@gmail.com' required/>

            </div>
            <div>
                <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                <input className='rounded-md w-full px-3 py-2 border border-gray-300' type="password" placeholder='Enter your Password' required/>

            </div>
            <button type="Submit">Login</button>
        </form>

        </div>

    </div>
  )
}

export default Login
