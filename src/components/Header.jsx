import React from 'react'

export default function Header() {
  return (
    <header className='flex justify-between items-center gap-4 p-4 '>
      <a href='/'>
      <h1 className='font-medium'>Free<span className='text-blue-400 bold'>Chronicle</span></h1></a>
      <a href='/' className='flex specialBtn items-center gap-2 px-3 text-sm py-2 rounded-lg text-blue-500'>
          <p className='flex items-center gap-2'>New</p>
          <i className="fa-solid fa-plus"></i>
      </a>
    </header>
  )
}
