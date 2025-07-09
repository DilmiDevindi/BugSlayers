import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Add = () => {
  //const [category, setCategory] = useState('Bed');

  const getSizeOptions = () => {
    switch (Category) {
      case 'Bed':
        return ['King', 'Queen', 'Normal'];
      case 'Table':
        return ['4', '6', '8'];
      case 'Chair':
        return ['Small', 'Medium', 'Big'];
      default:
        return [];
    }
  };
  const [images,setImages] = useState([null,null,null,null]);
 

  const [name,setName] = useState('');
  const[description,setDescription] = useState('');
  const [price,setPrice] = useState('');
  const [Category,setCategory] = useState('Bed');
  const [subCategory,setSubCategory] = useState('Timber');
  const [bestseller, setBestseller]=useState(false);
  const [sizes,setSizes]=useState([]);

  return (
    <form className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[1, 2, 3, 4].map((n) => (
            <label key={n} htmlFor={`image${n}`}>
              <img className='w-20' src={!image[0]?assets.upload_area:URL.createObjectURL(image[0])} alt='' />
              <input onChange={(e)=>setImage(e.target.files[0])} type='file' id={`image${n}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write Content Here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select
            className='w-full px-3 py-2'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=''>Select</option>
            <option value='Bed'>Bed</option>
            <option value='Table'>Table</option>
            <option value='Chair'>Chair</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value='Timber'>Timber</option>
            <option value='Glass'>Glass</option>
            <option value='Plastic'>Plastic</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type='number' placeholder='25' />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-2 flex-wrap'>
          {getSizeOptions().map((size) => (
            <div key={size} className='border px-3 py-1 rounded-md bg-gray-100'>
              {size}
            </div>
          ))}
          {getSizeOptions().length === 0 && <p className='text-sm text-gray-500'>Select a category first</p>}
        </div>
      </div>
      <div className='flex gap-2 mt-2'>
        <input type="checkbox" id="bestseller"/>
        <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type ="Submit" className='w-28 py-3 mt-4 bg-black text-white'>Add</button>
    </form>
  );
};

export default Add;
