import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center shadow-sm h-20'>
        <div className='mx-10'>PicxKart</div>
        <div>
            <ul className='flex gap-6 mx-6'>
                <li>Home</li>
                <li>Photos</li>
                <li>Videos</li>
                <li>About Us</li>
            </ul>
        </div>
    </div>
  )
}

export default Header