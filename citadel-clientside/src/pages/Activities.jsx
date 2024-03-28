import React from 'react'
import CallToAction from '../components/CallToAction'

const Activities = () => {
  return (
    <div className=' min-h-screen max-w-2xl mx-auto flex flex-col justify-center items-center gap-6 p-3'>
      <h1 className=' text-3xl font-semibold'>Our Activities</h1>
      <p className=' text-sm text-gray-500'>Stay updated with our weekly Activities via our announcement Post </p>
      <CallToAction />
    </div>
  )
}

export default Activities