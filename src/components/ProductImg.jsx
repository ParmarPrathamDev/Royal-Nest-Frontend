import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url || "/placeholder.png")

  return (
    <div className='flex flex-col md:flex-row gap-4 sm:gap-5 w-full max-w-full overflow-hidden'>
      
      {/* Thumbnails */}
      <div className='flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0'>
        {images?.map((img, index) => (
          <img
            key={index}
            onClick={() => setMainImg(img.url)}
            src={img.url}
            alt={`product-${index}`}
            className={`cursor-pointer flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover border rounded-md ${
              mainImg === img.url ? "border-pink-500" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Main Image */}
      <div className='order-1 md:order-2 w-full min-w-0'>
        <div className='w-full aspect-square bg-white border rounded-xl shadow-lg overflow-hidden'>
          <Zoom>
            <img
              src={mainImg}
              alt='product'
              className='w-full h-full object-cover'
            />
          </Zoom>
        </div>
      </div>

    </div>
  )
}

export default ProductImg






// import React, { useState } from 'react'
// import Zoom from 'react-medium-image-zoom'
// import 'react-medium-image-zoom/dist/styles.css'

// const ProductImg = ({ images }) => {
//   const [mainImg, setMainImg] = useState(images?.[0]?.url)

//   return (
//     <div className='flex flex-col md:flex-row gap-5 w-full'>
      
//       <div className='flex md:flex-col gap-3 order-2 md:order-1'>
//         {
//           images?.map((img, index) => (
//             <img
//               key={index}
//               onClick={() => setMainImg(img.url)}
//               src={img.url}
//               alt=''
//               className='cursor-pointer w-16 h-16 md:w-20 md:h-20 object-cover border'
//             />
//           ))
//         }
//       </div>

//       {/* Main Image */}
//       <Zoom>
//         <img
//           src={mainImg}
//           alt=''
//           className='w-full md:w-[450px] max-w-full border shadow-lg order-1 md:order-2'
//         />
//       </Zoom>

//     </div>
//   )
// }

// export default ProductImg

// import React, { useState } from 'react'
// import Zoom from 'react-medium-image-zoom'
// import 'react-medium-image-zoom/dist/styles.css'


//  const ProductImg = ({ images }) => {
//      const [mainImg, setMainImg] = useState(images?.[0]?.url)
//   return (
//     <div className='flex gap-5 w-max'>
//         <div className='gap-5 flex flex-col'>
//         {
//             images.map((img)=>{
//                 return <img onClick={()=> setMainImg(img.url)} src={img.url} alt='' className='cursor-pointer w-20 h-20 '/>
//             })
//         }
//         </div>
//         <Zoom>
//             <img src={mainImg} alt='' className='w-[500px] border shadow-lg'/>
//         </Zoom>
//     </div>
//   )
// }

// export default ProductImg