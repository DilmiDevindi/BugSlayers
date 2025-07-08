import React from 'react'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import {Routes, Route} from 'react-router-dom'
import Add from './pages/Add'
import List from '/pages/List'
const App = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <>
      <NavBar />
      <hr/>
      <div className= 'flex w-full'>
        <Sidebar/>
        <div className='w-[70%]mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
        <Routes>
          <Route path='/add'melement={<Add/>}/>
          <Route path='/list'melement={<List/>}/>
          <Route path='/orders'melement={<Orders/>}/>
        </Routes>
        </div>

      </div>
    </>
    </div>
  )
}

export default App
