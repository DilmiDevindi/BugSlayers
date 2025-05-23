import React from 'react'

const Banners = ({text1, text2, text3, src, alt}) => {
  return (
    <div className="max-w-screen-2xl m-auto py-20 px-4 min-h-[650px] bg-primary-light rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
      <div className="max-w-[600px] ml-auto">
        <h1 className="uppercase text-5xl font-bold">{text1}</h1>
        <h1 className="text-3xl font-bold mt-2">{text2}</h1>
        <h4 className="mt-3 text-lg  text-primary mb-5">{text3}</h4>

        <button className="py-3 px-6 outline-none border-0 text-base text-white bg-primary rounded-[5px] cursor-pointer transition-all duration-300 hover:bg-primary-dark">
          SHOP NOW
        </button>
      </div>

      <div className="relative h-full ml-8">
        <img src={src} alt={alt} className='absolute left-1/2 bottom-[-5rem] -translate-x-1/2 max-w-[500px] '/>
      </div>

    </div>

  )
}

export default Banners
