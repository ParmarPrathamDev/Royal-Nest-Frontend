import { useNavigate } from "react-router-dom"

const BreadCrums = ({ product }) => {

  const navigate = useNavigate()

  return (

    <div className="text-sm text-gray-500 flex items-center gap-2">

      <span
        className="cursor-pointer hover:text-pink-500"
        onClick={() => navigate("/")}
      >
        Home
      </span>

      <span>{'>'}</span>

      <span
        className="cursor-pointer hover:text-pink-500"
        onClick={() => navigate("/products")}
      >
        Products
      </span>

      <span>{'>'}</span>

      <span
        className="cursor-pointer hover:text-pink-500"
        onClick={() => navigate(`/products/category/${product?.category?.categoryName}`)}
      >
        {product?.category?.categoryName}
      </span>

      <span>{'>'}</span>

      <span className="text-gray-700 font-medium">
        {product?.productName}
      </span>

    </div>

  )
}

export default BreadCrums