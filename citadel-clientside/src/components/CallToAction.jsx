import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className=" flex flex-col sm:flex-row p-3 border border-teal-500 rounded-tl-3xl rounded-br-3xl justify-center items-center text-center">
      <div className=' flex-1 flex flex-col justify-center'>
        <h2 className=' text-2xl'>Be a Part of our service this sunday</h2>
        <p className=' text-gray-500 my-2'>Join the School of wisdom @7:30am and word and wonder service @9:00am</p>
        <Button gradientDuoTone={'purpleToPink'} className=' rounded-tl-xl rounded-bl-none'>
          <a href="https://www.facebook.com/citadeloftreasureministry/videos/3064550087010095" target='_blank' rel='noopener noreferrer'>Follow online</a>
        </Button>
      </div>
      <div className=" p-7 flex-1">
        <img src="https://th.bing.com/th/id/OIP.YE0pXk-2mmcYQVvkxUA6CQHaE8?rs=1&pid=ImgDetMain" alt="" />
      </div>
    </div>
  )
}

export default CallToAction