import { BentoDemo } from '@/components/BentoLayout'
import SignInComponent from '@/components/SignIn'
import { Protect} from '@clerk/nextjs'

export default function Page() {
  return (
    <Protect fallback={<SignInComponent url='/games'/>}>
      {/* <div className='flex justify-center items-center min-h-screen'>
            <BentoDemo />
      </div> */}

      Coming Soon
    </Protect>
  )
}