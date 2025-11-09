import React from 'react'

function layout({children}: {
    children: React.ReactNode}) {
  return (
    <div className='mt-1 px-20'>{children}</div>
  )
}

export default layout