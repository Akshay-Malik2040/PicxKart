import React from 'react'

const NavBar = ({onSearch}) => {
  return (
      <div className='flex justify-between items-center shadow-sm h-20'>
        <div className='mx-10 text-3xl font-bold font-mono'>PicxKart</div>
        <div>
            <ul className='flex gap-15 mx-13 font-mono font-semibold'>
                <li>Home</li>
                <li>Photos</li>
                <li>Videos</li>
                <li>About Us</li>
            </ul>
        </div>
      </div>
  )
}

export default NavBar