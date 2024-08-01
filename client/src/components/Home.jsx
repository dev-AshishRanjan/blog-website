import React from 'react'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar route={"r/blogger"} />
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className='text-[7rem] w-[70%] text-wrap font-bold overflow-hidden text-ellipsis text-yellow-700'>
          Privacy focused <span className='text-[8rem] text-gray-900 text-ellipsis'>Blogging</span>
        </div>
        <img src="/article.gif" alt="" className='w-[30%]' />
      </div>
    </div>
  )
}

export default Home