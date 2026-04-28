import BreadCrums from '@/components/BreadCrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
  const params = useParams()

  const productId = params.id
  const { products } = useSelector(store => store.product)

  const product = products.find((item) => item._id === productId)

  if (!product) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-6 px-3 sm:px-6 lg:px-10">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto">
        <BreadCrums product={product} />
      </div>

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          
          {/* LEFT - IMAGE */}
          <div className="w-full">
            <div className="lg:sticky lg:top-24">
              <ProductImg images={product.productImg} />
            </div>
          </div>

          {/* RIGHT - DESCRIPTION */}
          <div className="w-full">
            <ProductDesc product={product} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default SingleProduct










// import BreadCrums from '@/components/BreadCrums'
// import ProductDesc from '@/components/ProductDesc'
// import ProductImg from '@/components/ProductImg'
// import { useSelector } from 'react-redux'
// import { useParams, useNavigate } from 'react-router-dom'

// const SingleProduct = () => {
//   const params = useParams()
//   const navigate = useNavigate()

//   const productId = params.id
//   const { products } = useSelector(store => store.product)

//   const product = products.find((item) => item._id === productId)

//   if (!product) {
//     return null
//   }

//   // 🔥 RELATED PRODUCTS (MAX 8)
//   const relatedProducts = products
//     .filter(
//       (item) =>
//         item.category === product.category &&
//         item._id !== product._id
//     )
//     .slice(0, 8)

//   return (
//     <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-10">

//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto">
//         <BreadCrums product={product} />
//       </div>

//       {/* MAIN SECTION */}
//       <div className="max-w-7xl mx-auto mt-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-10">

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

//           {/* LEFT - IMAGE */}
//           <div className="w-full">
//             <div className="sticky top-24">
//               <ProductImg images={product.productImg} />
//             </div>
//           </div>

//           {/* RIGHT - DESCRIPTION */}
//           <div className="w-full">
//             <ProductDesc product={product} />
//           </div>

//         </div>

//       </div>

//       {/* 🔥 RELATED PRODUCTS SECTION */}
//       <div className="max-w-7xl mx-auto mt-10">
//         <h2 className="text-xl font-semibold mb-4">Related Products</h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//           {relatedProducts.map((item) => (
//             <div
//               key={item._id}
//               onClick={() => navigate(`/product/${item._id}`)}
//               className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 cursor-pointer"
//             >
//               <img
//                 src={item.productImg?.[0]?.url}
//                 alt="product"
//                 className="w-full h-32 object-cover rounded-md"
//               />

//               <h3 className="text-sm font-medium mt-2 line-clamp-1">
//                 {item.productName}
//               </h3>

//               <p className="text-sm text-gray-500">
//                 ₹{item.productPrice}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   )
// }

// export default SingleProduct







// import BreadCrums from '@/components/BreadCrums'
// import ProductDesc from '@/components/ProductDesc'
// import ProductImg from '@/components/ProductImg'
// import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'

// const SingleProduct = () => {
//   const params = useParams()
//   const productId = params.id
//   const { products } = useSelector(store => store.product)
//   const product = products.find((item) => item._id === productId)

//   if (!product) {
//     return (
//       <div className="flex justify-center items-center h-[60vh]">
//         <p className="text-gray-500 text-lg animate-pulse">Loading product...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-10">

//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto">
//         <BreadCrums product={product} />
//       </div>

//       {/* MAIN SECTION */}
//       <div className="max-w-7xl mx-auto mt-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-10">

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

//           {/* LEFT - IMAGE */}
//           <div className="w-full">
//             <div className="sticky top-24">
//               <ProductImg images={product.productImg} />
//             </div>
//           </div>

//           {/* RIGHT - DESCRIPTION */}
//           <div className="w-full">
//             <ProductDesc product={product} />
//           </div>

//         </div>

//       </div>

//     </div>
//   )
// }

// export default SingleProduct








// import BreadCrums from '@/components/BreadCrums'
// import ProductDesc from '@/components/ProductDesc'
// import ProductImg from '@/components/ProductImg'
// import { useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'

// const SingleProduct = () => {
//   const params = useParams()
//   const productId = params.id
//   const { products } = useSelector(store => store.product)
//   const product = products.find((item) => item._id === productId)

//   if (!product) return <p>Loading...</p>

//   return (
//     <div className='pt-5 py-10 max-w-7xl mx-auto px-4'>
//       <BreadCrums product={product} />

//       <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
//         <ProductImg images={product.productImg} />
//         <ProductDesc product={product} />   
//       </div>
//     </div>
//   )
// }

// export default SingleProduct


// const SingleProduct = () => {
//   const params = useParams()
//   const productId = params.id
//   const { products } = useSelector(store => store.product)
//   const product = products.find((item) => item._id === productId)

//   console.log("Single Product:", product)

//   return (
//     <div className='pt-5 py-10 max-w-7xl mx-auto'>
//       <BreadCrums product={product} />
//       <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
//         <ProductImg images={product.productImg} />
//         <ProductDesc product={product} />
//       </div>
//     </div>
//   )
// }
// export default SingleProduct