import React from 'react'

const Navbar = ({ route }) => {
  const isAuth = !!localStorage.getItem('token');
  return (
    <div className='w-full flex justify-between mt-2 border-2 border-gray-700 sticky top-2 backdrop-blur-md rounded-xl z-20'>
      <div className='w-[30%] text-xl text-gray-700 p-4'>{route}</div>
      <div className='w-[30%] text-xl text-gray-700 flex items-center justify-center p-2 gap-4'>
        <a href="/" className='text-gray-700'>Home</a>
        <a href="/dashboard" className='text-gray-700'>Dashboard</a>
        {
          isAuth ?
            <>
              <a href="" onClick={() => {
                localStorage.removeItem('token')
              }} className='text-gray-700'>Logout</a>
            </>
            :
            <>
              <a href="/login" className='text-gray-700'>Login</a>
              <a href="/signup" className='text-gray-700'>Signup</a>
            </>
        }
      </div>
    </div>
  )
}

export default Navbar;