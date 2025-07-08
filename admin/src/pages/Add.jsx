import React from 'react'
import {assets} from '../assets/assets'

const Add = () => {
  return (
    <form className='flex flex-col w-full items-start gap-3 '>
      <div>
        <p className='mb-2'>Upload Image</p>
      <div className ='flex gap-2'>
      
      <label htmlFor="image1">
        <img className ='w-20'src={assets.upload_area} alt=""/>
        <input type="file" id="image1" hidden/>
      </label>
      <label htmlFor="image2">
        <img className ='w-20'src={assets.upload_area} alt=""/>
        <input type="file" id="image2" hidden/>
      </label>
      <label htmlFor="image3">
        <img className ='w-20' src={assets.upload_area} alt=""/>
        <input type="file" id="image3" hidden/>
      </label>
      <label htmlFor="image4">
        <img className ='w-20'src={assets.upload_area} alt=""/>
        <input type="file" id="image4" hidden/>
      </label>
      </div>
      </div>

      <div className='w-full'>
       <p className='mb-2'>Product name</p> 
       <input className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
      </div>
      <div className='w-full'>
       <p className='mb-2'>Product Description</p> 
       <textarea className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write Content Here' required/>
      </div>
      <div>
        <div>
          <p>
            Product Category
            <select className='w-full px-3 py-2' >
              <option value="Bed">Bed</option>
              <option value="Table">Table</option>
              <option value="Chair">Chair</option>

            </select>
          </p>
        </div>

         <div>
          <p>
            Sub Category</p>
            <select className='w-full px-3 py-2' >
              <option value="Timber">Timber</option>
              <option value="Glass">Glass</option>
              <option value="plastic">plastic</option>

            </select>
          
        </div>
        <div>
          <p>Product Price</p>
          <input type="Number" placeholder="25"></input>
        </div>
      </div>
    </form>
    
  )
}

export default Add
