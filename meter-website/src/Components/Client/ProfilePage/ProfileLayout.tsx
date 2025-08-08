import React from 'react'
import { Outlet } from 'react-router-dom'

function ProfileLayout() {
  return (
    <>
      
         <main className='w-full md:w-3/4 p-4 bg-white rounded-lg shadow-md'>
                    <Outlet />
                </main>
      
    </>
  )
}

export default ProfileLayout
