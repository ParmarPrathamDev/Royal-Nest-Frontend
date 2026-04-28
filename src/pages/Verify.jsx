import React from 'react'

const Verify = () => {
  return (

    <div className='relative w-full min-h-screen overflow-hidden'>
      <div className='h-full flex items-center justify-center bg-pink-100 p-4'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
          <h1 className='text-2xl font-semibold text-green-500 mb-4'>✔️Check Your Email</h1>
          <p className='text-gray-400 text-sm '>
            We'have Sent You An Email To Verify Your Account. Please check your in box and click verification link
          </p>
        </div>

      </div>
    </div>
  )
}
export default Verify;