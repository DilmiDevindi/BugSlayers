//Contact page component
// This component is the Contact page of the website. It contains a form for users to fill out their name, email, and message. The layout is responsive, adjusting for smaller screens.

import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
        
      </div>
      <div className='my-10 flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} alt="Contact Us" className='w-full md:max-w-[480px]'/>
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>340/1/B<br/>Kamburupitiya<br/>Matara</p>
          <p className='text-gray-500'>Tel:0717374320<br/>Email:newsisira@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at New Sisira Furniture</p>
          <p className='font-semibold-500'>Learn more abount our teams and job openings</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transistion-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <NewsLetter/>
      
    </div>
  )
}

export default Contact
