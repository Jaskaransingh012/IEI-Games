import React from 'react'
import { SignIn } from '@clerk/nextjs'

function SignInComponent({url}: {url: string}) {
  return (
    <div className='relative min-h-screen w-full overflow-hidden flex justify-center items-center bg-black'>
        <SignIn fallbackRedirectUrl={url}/>
    </div>
  )
}

export default SignInComponent