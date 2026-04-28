import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";

const AddCategory = () => {
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/category/get");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!categoryName) return toast.error("Category name required");
    if (!categoryImage) return toast.error("Category image required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("file", categoryImage);

      const res = await axios.post(
        "http://localhost:8000/api/v1/category/add",
        formData
      );

      if (res.data.success) {
        toast.success("Category Added Successfully");
        setCategoryName("");
        setCategoryImage(null);
        getCategories();
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editImage) return toast.error("Please select image");

    const formData = new FormData();
    formData.append("file", editImage);

    try {
      await axios.put(
        `http://localhost:8000/api/v1/category/update/${editCategoryId}`,
        formData
      );

      toast.success("Category updated");
      setEditOpen(false);
      setEditImage(null);
      getCategories();

    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-4 px-3 sm:px-6 lg:px-8 lg:pl-[320px]">

      {/* ADD PRODUCT MODAL */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <AddProductForm
            selectedCategoryId={selectedCategoryId}
            onClose={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95%] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Category Image</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />

            {editImage && (
              <img src={URL.createObjectURL(editImage)} className="w-24 h-24 object-cover rounded-lg border" />
            )}

            <Button onClick={handleUpdate} className="bg-blue-600 text-white">Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="w-[95%] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500">
            Are you sure you want to delete this category?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 bg-red-600 text-white"
              onClick={async () => {
                try {
                  const res = await axios.delete(
                    `http://localhost:8000/api/v1/category/delete/${deleteId}`
                  );

                  if (res.data.success) {
                    toast.success(res.data.message);
                    setCategories(categories.filter((cat) => cat._id !== deleteId));
                  }

                } catch {
                  toast.error("Delete failed");
                } finally {
                  setDeleteOpen(false);
                }
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">

        {/* ADD CATEGORY */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
            <CardDescription>Create new category</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category Name</Label>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Category Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} />
            </div>
          </CardContent>

          <CardFooter>
            <Button disabled={loading} onClick={submitHandler} className="w-full bg-pink-500 text-white">
              {loading ? "Please wait..." : "Add Category"}
            </Button>
          </CardFooter>
        </Card>

        {/* CATEGORY LIST */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>Manage categories</CardDescription>
          </CardHeader>

          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center text-gray-500">No categories found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-white rounded-xl shadow p-3 flex flex-col gap-3 h-full"
                  >

                    {cat.categoryImg?.[0]?.url ? (
                      <img src={cat.categoryImg[0].url} className="h-32 w-full object-cover rounded" />
                    ) : (
                      <div className="h-32 bg-gray-200 flex items-center justify-center">No Img</div>
                    )}

                    <h1 className="text-center font-semibold">{cat.categoryName}</h1>

                    <Button
                      className="bg-green-600 text-white"
                      onClick={() => {
                        setSelectedCategoryId(cat._id);
                        setAddOpen(true);
                      }}
                    >
                      Add Product
                    </Button>

                   <div className="grid grid-cols-2 gap-2 w-full">
  <Button
    className="bg-blue-600 text-white w-full min-w-0"
    onClick={() => {
      setEditCategoryId(cat._id);
      setEditOpen(true);
    }}
  >
    Edit
  </Button>

  <Button
    className="bg-red-500 text-white w-full min-w-0 flex items-center justify-center gap-1"
    onClick={() => {
      setDeleteId(cat._id);
      setDeleteOpen(true);
    }}
  >
    <Trash2 size={14} className="shrink-0" />
    <span className="truncate">Delete</span>
  </Button>
</div>

                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AddCategory;

/* ================= ADD PRODUCT FORM ================= */

const AddProductForm = ({ selectedCategoryId, onClose }) => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: selectedCategoryId || "",
    quantity: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/category/get")
      .then(res => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setProductData((prev) => ({
      ...prev,
      category: selectedCategoryId || ""
    }));
  }, [selectedCategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productPrice") {
      if (value === "") {
        setProductData((prev) => ({ ...prev, productPrice: "" }));
        return;
      }

      let numericValue = value.replace(/\D/g, "");
      numericValue = Number(numericValue);

      if (numericValue < 0) numericValue = 0;
      if (numericValue > 1000000) numericValue = 1000000;

      setProductData((prev) => ({
        ...prev,
        productPrice: numericValue
      }));
      return;
    }

    if (name === "quantity") {
      if (value === "") {
        setProductData((prev) => ({ ...prev, quantity: "" }));
        return;
      }

      let numericValue = value.replace(/\D/g, "");
      numericValue = Number(numericValue);

      if (numericValue < 0) numericValue = 0;
      if (numericValue > 50) numericValue = 50;

      setProductData((prev) => ({
        ...prev,
        quantity: numericValue
      }));
      return;
    }

    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!productData.productName.trim()) {
      toast.error("Product name required");
      return;
    }

    if (productData.productPrice === "" || Number(productData.productPrice) < 0 || Number(productData.productPrice) > 1000000) {
      toast.error("Price must be between 0 and 1000000");
      return;
    }

    if (!productData.brand.trim()) {
      toast.error("Brand required");
      return;
    }

    if (!productData.category) {
      toast.error("Category required");
      return;
    }

    if (productData.quantity === "" || Number(productData.quantity) < 0 || Number(productData.quantity) > 50) {
      toast.error("Quantity must be between 0 and 50");
      return;
    }

    if (!productData.productDesc.trim()) {
      toast.error("Description required");
      return;
    }

    if (!productData.productImg || productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "productImg") {
        value.forEach((img) => formData.append("files", img));
      } else {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8000/api/v1/product/add", formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res.data.success) {
        toast.success("Product Added");
        onClose();

        setTimeout(() => {
          navigate("/dashboard/products");
        }, 700);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-3">
      <Input
        name="productName"
        placeholder="Product Name"
        value={productData.productName}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          type="number"
          name="productPrice"
          placeholder="price"
          min="0"
          max="1000000"
          value={productData.productPrice}
          onChange={handleChange}
        />

        <Input
          type="number"
          name="quantity"
          placeholder="quantity"
          min="0"
          max="50"
          value={productData.quantity}
          onChange={handleChange}
        />
      </div>

      <Input
        name="brand"
        placeholder="Brand"
        value={productData.brand}
        onChange={handleChange}
      />

      <Select value={productData.category} disabled>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        name="productDesc"
        placeholder="Description"
        value={productData.productDesc}
        onChange={handleChange}
      />

      <ImageUpload productData={productData} setProductData={setProductData} />

      <Button type="submit" disabled={loading}>
        {loading ? "Please wait..." : "Add Product"}
      </Button>
    </form>
  );
};














// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2, Trash2 } from "lucide-react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select";

// import { Textarea } from "@/components/ui/textarea";
// import ImageUpload from "@/components/ImageUpload";

// const AddCategory = () => {

//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [editCategoryId, setEditCategoryId] = useState("");
//   const [editImage, setEditImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryImage, setCategoryImage] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const [addOpen, setAddOpen] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");

//   const getCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/category/get");
//       if (res.data.success) {
//         setCategories(res.data.categories);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!categoryName) return toast.error("Category name required");
//     if (!categoryImage) return toast.error("Category image required");

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("categoryName", categoryName);
//       formData.append("file", categoryImage);

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/category/add",
//         formData
//       );

//       if (res.data.success) {
//         toast.success("Category Added Successfully");
//         setCategoryName("");
//         setCategoryImage(null);
//         getCategories();
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!editImage) return toast.error("Please select image");

//     const formData = new FormData();
//     formData.append("file", editImage);

//     try {
//       await axios.put(
//         `http://localhost:8000/api/v1/category/update/${editCategoryId}`,
//         formData
//       );

//       toast.success("Category updated");
//       setEditOpen(false);
//       setEditImage(null);
//       getCategories();

//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen py-4 px-3 sm:px-6 lg:px-8 lg:pl-[320px]">

//       {/* ADD PRODUCT MODAL */}
//       <Dialog open={addOpen} onOpenChange={setAddOpen}>
//         <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Add Product</DialogTitle>
//           </DialogHeader>

//           <AddProductForm
//             selectedCategoryId={selectedCategoryId}
//             onClose={() => setAddOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* EDIT MODAL */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className="w-[95%] sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Update Category Image</DialogTitle>
//           </DialogHeader>

//           <div className="flex flex-col gap-3">
//             <Input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />

//             {editImage && (
//               <img src={URL.createObjectURL(editImage)} className="w-24 h-24 object-cover rounded-lg border" />
//             )}

//             <Button onClick={handleUpdate} className="bg-blue-600 text-white">Update</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* DELETE MODAL */}
//       <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//         <DialogContent className="w-[95%] sm:max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>

//           <p className="text-sm text-gray-500">
//             Are you sure you want to delete this category?
//           </p>

//           <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">

//             <Button
//               variant="outline"
//               className="flex-1"
//               onClick={() => setDeleteOpen(false)}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="flex-1 bg-red-600 text-white"
//               onClick={async () => {
//                 try {
//                   const res = await axios.delete(
//                     `http://localhost:8000/api/v1/category/delete/${deleteId}`
//                   );

//                   if (res.data.success) {
//                     toast.success(res.data.message);
//                     setCategories(categories.filter((cat) => cat._id !== deleteId));
//                   }

//                 } catch {
//                   toast.error("Delete failed");
//                 } finally {
//                   setDeleteOpen(false);
//                 }
//               }}
//             >
//               Yes, Delete
//             </Button>

//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* MAIN */}
//       <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">

//         {/* ADD CATEGORY */}
//         <Card className="shadow-xl rounded-2xl">
//           <CardHeader>
//             <CardTitle>Add Category</CardTitle>
//             <CardDescription>Create new category</CardDescription>
//           </CardHeader>

//           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="grid gap-2">
//               <Label>Category Name</Label>
//               <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
//             </div>

//             <div className="grid gap-2">
//               <Label>Category Image</Label>
//               <Input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} />
//             </div>
//           </CardContent>

//           <CardFooter>
//             <Button disabled={loading} onClick={submitHandler} className="w-full bg-pink-500 text-white">
//               {loading ? "Please wait..." : "Add Category"}
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* CATEGORY LIST */}
//         <Card className="shadow-xl rounded-2xl">
//           <CardHeader>
//             <CardTitle>All Categories</CardTitle>
//             <CardDescription>Manage categories</CardDescription>
//           </CardHeader>

//           <CardContent>
//             {categories.length === 0 ? (
//               <p className="text-center text-gray-500">No categories found</p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {categories.map((cat) => (
//                   <div key={cat._id} className="bg-white rounded-xl shadow p-3 flex flex-col gap-2">

//                     {cat.categoryImg?.[0]?.url ? (
//                       <img src={cat.categoryImg[0].url} className="h-32 w-full object-cover rounded" />
//                     ) : (
//                       <div className="h-32 bg-gray-200 flex items-center justify-center">No Img</div>
//                     )}

//                     <h1 className="text-center font-semibold">{cat.categoryName}</h1>

//                     <Button className="bg-green-600 text-white"
//                       onClick={() => {
//                         setSelectedCategoryId(cat._id);
//                         setAddOpen(true);
//                       }}>
//                       Add Product
//                     </Button>

//                     <div className="flex gap-2">
//                       <Button className="bg-blue-600 text-white flex-1"
//                         onClick={() => {
//                           setEditCategoryId(cat._id);
//                           setEditOpen(true);
//                         }}>
//                         Edit
//                       </Button>

//                       <Button className="bg-red-500 text-white flex-1 flex items-center justify-center gap-1"
//                         onClick={() => {
//                           setDeleteId(cat._id);
//                           setDeleteOpen(true);
//                         }}>
//                         <Trash2 size={14} /> Delete
//                       </Button>
//                     </div>

//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   );
// };

// export default AddCategory;

// /* ================= ADD PRODUCT FORM ================= */

// const AddProductForm = ({ selectedCategoryId, onClose }) => {

//   const accessToken = localStorage.getItem("accessToken");

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [productData, setProductData] = useState({
//     productName: "",
//     productPrice: "",
//     productDesc: "",
//     productImg: [],
//     brand: "",
//     category: selectedCategoryId || "",
//     quantity: ""
//   });

//   useEffect(() => {
//     axios.get("http://localhost:8000/api/v1/category/get")
//       .then(res => setCategories(res.data.categories));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData(prev => ({ ...prev, [name]: value }));
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.entries(productData).forEach(([key, value]) => {
//       if (key === "productImg") {
//         value.forEach(img => formData.append("files", img));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:8000/api/v1/product/add", formData, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       });

//       toast.success("Product Added");
//       onClose();

//     } catch {
//       toast.error("Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={submitHandler} className="flex flex-col gap-3">
//       <Input name="productName" placeholder="Product Name" onChange={handleChange} />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

//         <Input
//           type='number'
//           name='productPrice'
//           placeholder="price"
//           min="0"
//           value={productData.productPrice || ""}
//           onChange={(e) => {
//             if (e.target.value < 0) return;
//             handleChange(e);
//           }}
//         />

//         <Input
//           type='number'
//           name='quantity'
//           placeholder="quantity"
//           min="0"
//           value={productData.quantity || ""}
//           onChange={(e) => {
//             if (e.target.value < 0) return;
//             handleChange(e);
//           }}
//         />

//       </div>
//       <Input name="brand" placeholder="Brand" onChange={handleChange} />

//       <Select value={productData.category} disabled>
//         <SelectTrigger><SelectValue /></SelectTrigger>
//         <SelectContent>
//           {categories.map((cat) => (
//             <SelectItem key={cat._id} value={cat._id}>{cat.categoryName}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Textarea name="productDesc" placeholder="Description" onChange={handleChange} />

//       <ImageUpload productData={productData} setProductData={setProductData} />

//       <Button type="submit">{loading ? "Please wait..." : "Add Product"}</Button>
//     </form>
//   );
// };









//11-4/26


// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2, Trash2 } from "lucide-react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select";

// import { Textarea } from "@/components/ui/textarea";
// import ImageUpload from "@/components/ImageUpload";

// const AddCategory = () => {
//   const [deleteId, setDeleteId] = useState(null);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [editCategoryId, setEditCategoryId] = useState("");
//   const [editImage, setEditImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [categoryImage, setCategoryImage] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const [addOpen, setAddOpen] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");

//   const getCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/category/get");
//       console.log(res.data.categories);
//       if (res.data.success) {
//         setCategories(res.data.categories);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!categoryName) {
//       toast.error("Category name required");
//       return;
//     }

//     if (!categoryImage) {   // 👈 FIXED POSITION
//       toast.error("Category image required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("categoryName", categoryName);
//       formData.append("file", categoryImage);

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/category/add",
//         formData
//       );

//       if (res.data.success) {
//         toast.success("Category Added Successfully");
//         setCategoryName("");
//         setCategoryImage(null);
//         getCategories();
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // const submitHandler = async (e) => {
//   //   e.preventDefault();

//   //   if (!categoryName) {
//   //     toast.error("Category name required");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const formData = new FormData();
//   //     formData.append("categoryName", categoryName);
//   //     formData.append("file", categoryImage); // 👈 IMPORTANT

//   //     const res = await axios.post(
//   //       "http://localhost:8000/api/v1/category/add",
//   //       formData
//   //     );
//   //     if (!categoryImage) {
//   //       toast.error("Category image required");
//   //       return;
//   //     }
//   //     if (res.data.success) {
//   //       toast.success("Category Added Successfully");
//   //       setCategoryName("");
//   //       setCategoryImage(null);
//   //       getCategories();
//   //     }

//   //   } catch (error) {
//   //     toast.error(error?.response?.data?.message || "Something went wrong");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const deleteCategory = async (id) => {
//     try {
//       const res = await axios.delete(
//         `http://localhost:8000/api/v1/category/delete/${id}`
//       );

//       if (res.data.success) {
//         toast.success(res.data.message);
//         setCategories(categories.filter((cat) => cat._id !== id));
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Delete failed");
//     }
//   };
//   const handleUpdate = async () => {
//     if (!editImage) {
//       toast.error("Please select image");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", editImage);

//     try {
//       await axios.put(
//         `http://localhost:8000/api/v1/category/update/${editCategoryId}`,
//         formData
//       );

//       toast.success("Category updated");
//       setEditOpen(false);
//       setEditImage(null);
//       getCategories();

//     } catch (error) {
//       toast.error("Update failed");
//     }
//   };
//   return (
//     <div className="bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px]">

//       {/* ADD PRODUCT MODAL */}
//       <Dialog open={addOpen} onOpenChange={setAddOpen}>
//         <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Add Product</DialogTitle>
//           </DialogHeader>

//           <AddProductForm
//             selectedCategoryId={selectedCategoryId}
//             onClose={() => setAddOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* EDIT CATEGORY MODAL */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className="w-[95%] sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Update Category Image</DialogTitle>
//           </DialogHeader>

//           <div className="flex flex-col gap-3">
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setEditImage(e.target.files[0])}
//             />

//             {editImage && (
//               <img
//                 src={URL.createObjectURL(editImage)}
//                 className="w-24 h-24 object-cover rounded-lg border"
//               />
//             )}

//             <Button onClick={handleUpdate} className="bg-blue-600 text-white">
//               Update
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* 🔥 DELETE CONFIRM DIALOG */}
//       <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
//         <DialogContent className="max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>

//           <p className="text-sm text-gray-500">
//             Are you sure you want to delete this category?
//           </p>

//           <div className="flex flex-col sm:flex-row gap-3 mt-4">

//             <Button
//               variant="outline"
//               className="w-full sm:w-1/2"
//               onClick={() => setDeleteOpen(false)}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="w-full sm:w-1/2 bg-red-600 hover:bg-red-700 text-white"
//               onClick={async () => {
//                 try {
//                   const res = await axios.delete(
//                     `http://localhost:8000/api/v1/category/delete/${deleteId}`
//                   );

//                   if (res.data.success) {
//                     toast.success(res.data.message);
//                     setCategories(categories.filter((cat) => cat._id !== deleteId));
//                   }

//                 } catch (error) {
//                   toast.error("Delete failed");
//                 } finally {
//                   setDeleteOpen(false);
//                 }
//               }}
//             >
//               Yes, Delete
//             </Button>

//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* MAIN */}
//       <div className="max-w-6xl mx-auto flex flex-col gap-8">

//         {/* ADD CATEGORY */}
//         <Card className="shadow-xl border-0 rounded-2xl">
//           <CardHeader>
//             <CardTitle>Add Category</CardTitle>
//             <CardDescription>Create new category</CardDescription>
//           </CardHeader>

//           <CardContent className="grid md:grid-cols-2 gap-4">
//             <div className="grid gap-2">
//               <Label>Category Name</Label>
//               <Input
//                 type="text"
//                 placeholder="Ex - Sofa"
//                 value={categoryName}
//                 onChange={(e) => setCategoryName(e.target.value)}
//               />
//             </div>

//             <div className="grid gap-2">
//               <Label>Category Image</Label>
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setCategoryImage(e.target.files[0])}
//               />
//             </div>
//           </CardContent>

//           <CardFooter>
//             <Button
//               disabled={loading}
//               onClick={submitHandler}
//               className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white"
//             >
//               {loading ? "Please wait..." : "Add Category"}
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* CATEGORY LIST */}
//         <Card className="shadow-xl border-0 rounded-2xl">
//           <CardHeader>
//             <CardTitle>All Categories</CardTitle>
//             <CardDescription>Manage categories</CardDescription>
//           </CardHeader>

//           <CardContent>
//             {categories.length === 0 ? (
//               <p className="text-gray-500 text-center py-6">
//                 No categories found
//               </p>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//                 {categories.map((cat) => (
//                   <div
//                     key={cat._id}
//                     className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
//                   >
//                     <div className="overflow-hidden">
//                       {cat.categoryImg?.[0]?.url ? (
//                         <img
//                           src={cat.categoryImg[0].url}
//                           className="w-full h-40 object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
//                           No Img
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-3 flex flex-col gap-2">
//                       <h1 className="font-semibold text-center">
//                         {cat.categoryName}
//                       </h1>

//                       <Button
//                         className="bg-green-600 text-white text-sm"
//                         onClick={() => {
//                           setSelectedCategoryId(cat._id);
//                           setAddOpen(true);
//                         }}
//                       >
//                         Add Product
//                       </Button>

//                       <div className="flex gap-2">
//                         <Button
//                           onClick={() => {
//                             setEditCategoryId(cat._id);
//                             setEditOpen(true);
//                           }}
//                           className="bg-blue-600 text-white flex-1 text-sm"
//                         >
//                           Edit
//                         </Button>

//                         {/* 🔥 UPDATED DELETE BUTTON */}
//                         <Button
//                           onClick={() => {
//                             setDeleteId(cat._id);
//                             setDeleteOpen(true);
//                           }}
//                           className="bg-red-500 text-white flex-1 text-sm flex items-center justify-center gap-1"
//                         >
//                           <Trash2 size={16} />
//                           Delete
//                         </Button>

//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   );
//   // return (
//   //   <div className="bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px]">

//   //     {/* ADD PRODUCT MODAL */}
//   //     <Dialog open={addOpen} onOpenChange={setAddOpen}>
//   //       <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//   //         <DialogHeader>
//   //           <DialogTitle>Add Product</DialogTitle>
//   //         </DialogHeader>

//   //         <AddProductForm
//   //           selectedCategoryId={selectedCategoryId}
//   //           onClose={() => setAddOpen(false)}
//   //         />
//   //       </DialogContent>
//   //     </Dialog>

//   //     {/* EDIT CATEGORY MODAL */}
//   //     <Dialog open={editOpen} onOpenChange={setEditOpen}>
//   //       <DialogContent className="w-[95%] sm:max-w-[500px]">
//   //         <DialogHeader>
//   //           <DialogTitle>Update Category Image</DialogTitle>
//   //         </DialogHeader>

//   //         <div className="flex flex-col gap-3">
//   //           <Input
//   //             type="file"
//   //             accept="image/*"
//   //             onChange={(e) => setEditImage(e.target.files[0])}
//   //           />

//   //           {editImage && (
//   //             <img
//   //               src={URL.createObjectURL(editImage)}
//   //               className="w-24 h-24 object-cover rounded-lg border"
//   //             />
//   //           )}

//   //           <Button onClick={handleUpdate} className="bg-blue-600 text-white">
//   //             Update
//   //           </Button>
//   //         </div>
//   //       </DialogContent>
//   //     </Dialog>

//   //     {/* MAIN */}
//   //     <div className="max-w-6xl mx-auto flex flex-col gap-8">

//   //       {/* ADD CATEGORY */}
//   //       <Card className="shadow-xl border-0 rounded-2xl">
//   //         <CardHeader>
//   //           <CardTitle>Add Category</CardTitle>
//   //           <CardDescription>Create new category</CardDescription>
//   //         </CardHeader>

//   //         <CardContent className="grid md:grid-cols-2 gap-4">
//   //           <div className="grid gap-2">
//   //             <Label>Category Name</Label>
//   //             <Input
//   //               type="text"
//   //               placeholder="Ex - Sofa"
//   //               value={categoryName}
//   //               onChange={(e) => setCategoryName(e.target.value)}
//   //             />
//   //           </div>

//   //           <div className="grid gap-2">
//   //             <Label>Category Image</Label>
//   //             <Input
//   //               type="file"
//   //               accept="image/*"
//   //               onChange={(e) => setCategoryImage(e.target.files[0])}
//   //             />
//   //           </div>
//   //         </CardContent>

//   //         <CardFooter>
//   //           <Button
//   //             disabled={loading}
//   //             onClick={submitHandler}
//   //             className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white"
//   //           >
//   //             {loading ? "Please wait..." : "Add Category"}
//   //           </Button>
//   //         </CardFooter>
//   //       </Card>

//   //       {/* CATEGORY LIST */}
//   //       <Card className="shadow-xl border-0 rounded-2xl">
//   //         <CardHeader>
//   //           <CardTitle>All Categories</CardTitle>
//   //           <CardDescription>Manage categories</CardDescription>
//   //         </CardHeader>

//   //         <CardContent>

//   //           {categories.length === 0 ? (
//   //             <p className="text-gray-500 text-center py-6">
//   //               No categories found
//   //             </p>
//   //           ) : (

//   //             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//   //               {categories.map((cat) => (
//   //                 <div
//   //                   key={cat._id}
//   //                   className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
//   //                 >
//   //                   {/* IMAGE */}
//   //                   <div className="overflow-hidden">
//   //                     {cat.categoryImg?.[0]?.url ? (
//   //                       <img
//   //                         src={cat.categoryImg[0].url}
//   //                         alt="category"
//   //                         className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
//   //                       />
//   //                     ) : (
//   //                       <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
//   //                         No Img
//   //                       </div>
//   //                     )}
//   //                   </div>

//   //                   {/* CONTENT */}
//   //                   <div className="p-3 flex flex-col gap-2">
//   //                     <h1 className="font-semibold text-center">
//   //                       {cat.categoryName}
//   //                     </h1>

//   //                     <div className="flex flex-col gap-2 mt-2">

//   //                       {/* ADD PRODUCT */}
//   //                       <Button
//   //                         className="bg-green-600 text-white text-sm"
//   //                         onClick={() => {
//   //                           setSelectedCategoryId(cat._id);
//   //                           setAddOpen(true);
//   //                         }}
//   //                       >
//   //                         Add Product
//   //                       </Button>

//   //                       {/* EDIT + DELETE */}
//   //                       <div className="flex gap-2 w-full">

//   //                         {/* EDIT */}
//   //                         <Button
//   //                           onClick={() => {
//   //                             setEditCategoryId(cat._id);
//   //                             setEditOpen(true);
//   //                           }}
//   //                           className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-sm"
//   //                         >
//   //                           Edit
//   //                         </Button>

//   //                         {/* DELETE (BONUS 🔥 ICON STYLE) */}
//   //                         <Button
//   //                           onClick={() => {
//   //                             setDeleteId(cat._id);
//   //                             setDeleteOpen(true);
//   //                           }}
//   //                           className="bg-red-500 hover:bg-red-600 text-white flex-1 text-sm flex items-center justify-center gap-1"
//   //                         >
//   //                           <Trash2 size={16} />
//   //                           Delete
//   //                         </Button>
//   //                         {/* <Button
//   //                           onClick={() => deleteCategory(cat._id)}
//   //                           className="bg-red-500 hover:bg-red-600 text-white flex-1 text-sm flex items-center justify-center gap-1"
//   //                         >
//   //                           <Trash2 size={16} />
//   //                           Delete
//   //                         </Button> */}

//   //                       </div>
//   //                     </div>
//   //                   </div>
//   //                 </div>
//   //               ))}
//   //             </div>

//   //           )}

//   //         </CardContent>
//   //       </Card>

//   //     </div>
//   //   </div>
//   // );
//   // return (
//   //   // <div className="lg:pl-[300px] md:pl-[200px] px-4 sm:px-6 py-6 min-h-screen bg-gray-100">
//   //   <div className="bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px]">

//   //     {/* ADD PRODUCT MODAL */}
//   //     <Dialog open={addOpen} onOpenChange={setAddOpen}>
//   //       <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//   //         <DialogHeader>
//   //           <DialogTitle>Add Product</DialogTitle>
//   //         </DialogHeader>

//   //         <AddProductForm
//   //           selectedCategoryId={selectedCategoryId}
//   //           onClose={() => setAddOpen(false)}
//   //         />
//   //       </DialogContent>
//   //     </Dialog>

//   //     {/* EDIT CATEGORY MODAL */}
//   //     <Dialog open={editOpen} onOpenChange={setEditOpen}>
//   //       <DialogContent className="w-[95%] sm:max-w-[500px]">
//   //         <DialogHeader>
//   //           <DialogTitle>Update Category Image</DialogTitle>
//   //         </DialogHeader>

//   //         <div className="flex flex-col gap-3">

//   //           <Input
//   //             type="file"
//   //             accept="image/*"
//   //             onChange={(e) => setEditImage(e.target.files[0])}
//   //           />

//   //           {/* 👇 Preview */}
//   //           {editImage && (
//   //             <img
//   //               src={URL.createObjectURL(editImage)}
//   //               className="w-20 h-20 object-cover rounded"
//   //             />
//   //           )}

//   //           <Button
//   //             onClick={handleUpdate}
//   //             className="bg-blue-600 text-white"
//   //           >
//   //             Update
//   //           </Button>

//   //         </div>
//   //       </DialogContent>
//   //     </Dialog>
//   //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//   //       {/* ADD CATEGORY */}
//   //       <Card>
//   //         <CardHeader>
//   //           <CardTitle>Add Category</CardTitle>
//   //           <CardDescription>Enter Category Name</CardDescription>
//   //         </CardHeader>

//   //         <CardContent>
//   //           <div className="grid gap-2">
//   //             <Label>Category Name</Label>
//   //             <Input
//   //               className="w-full"
//   //               type="text"
//   //               placeholder="Ex - Sofa"
//   //               value={categoryName}
//   //               onChange={(e) => setCategoryName(e.target.value)}
//   //             />
//   //           </div>
//   //           <div className="grid gap-2 mt-3">
//   //             <Label>Category Image</Label>
//   //             <Input
//   //               type="file"
//   //               accept="image/*"
//   //               onChange={(e) => setCategoryImage(e.target.files[0])}
//   //             />
//   //           </div>
//   //         </CardContent>

//   //         <CardFooter>
//   //           <Button
//   //             disabled={loading}
//   //             onClick={submitHandler}
//   //             className="w-full bg-pink-600"
//   //           >
//   //             {loading ? (
//   //               <span className="flex gap-1 items-center justify-center">
//   //                 <Loader2 className="animate-spin" />
//   //                 please wait
//   //               </span>
//   //             ) : "Add Category"}
//   //           </Button>
//   //         </CardFooter>
//   //       </Card>

//   //       {/* CATEGORY LIST */}
//   //       <Card>
//   //         <CardHeader>
//   //           <CardTitle>All Categories</CardTitle>
//   //           <CardDescription>Manage categories</CardDescription>
//   //         </CardHeader>

//   //         <CardContent className="flex flex-col gap-3">

//   //           {categories.length === 0 && (
//   //             <p className="text-gray-500">No categories found</p>
//   //           )}

//   //           {categories.map((cat) => (
//   //             <div
//   //               key={cat._id}
//   //               className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border p-3 rounded-md"
//   //             >
//   //               <div className="flex items-center gap-3">
//   //                 {cat.categoryImg?.[0]?.url ? (
//   //                   <img
//   //                     src={cat.categoryImg[0].url}
//   //                     alt="category"
//   //                     className="w-12 h-12 object-cover rounded"
//   //                   />
//   //                 ) : (
//   //                   <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-xs">
//   //                     No Img
//   //                   </div>
//   //                 )}
//   //                 <h1 className="font-medium">{cat.categoryName}</h1>
//   //               </div>
//   //               {/* <div className="flex items-center gap-3">
//   //                 <img
//   //                   src={cat.categoryImg?.url}
//   //                   alt=""
//   //                   className="w-12 h-12 object-cover rounded"
//   //                 />
//   //                 <h1 className="font-medium">{cat.categoryName}</h1>
//   //               </div> */}
//   //               <div className="flex gap-2 items-center flex-wrap">

//   //                 <Button
//   //                   className="bg-green-600 text-white w-full sm:w-auto px-3 py-1"
//   //                   onClick={() => {
//   //                     setSelectedCategoryId(cat._id);
//   //                     setAddOpen(true);
//   //                   }}
//   //                 >
//   //                   Add Product
//   //                 </Button>

//   //                 {/* 👇 AHIYA ADD KAR */}
//   //                 <Button
//   //                   onClick={() => {
//   //                     setEditCategoryId(cat._id);
//   //                     setEditOpen(true);
//   //                   }}
//   //                   className="bg-blue-600 text-white w-full sm:w-auto px-3 py-1"
//   //                 >
//   //                   Edit
//   //                 </Button>

//   //                 <Trash2
//   //                   onClick={() => deleteCategory(cat._id)}
//   //                   className="text-red-500 cursor-pointer"
//   //                 />

//   //               </div>

//   //               {/* <div className="flex gap-2 items-center flex-wrap">

//   //                 <Button
//   //                   className="bg-green-600 text-white w-full sm:w-auto px-3 py-1"
//   //                   onClick={() => {
//   //                     setSelectedCategoryId(cat._id);
//   //                     setAddOpen(true);
//   //                   }}
//   //                 >
//   //                   Add Product
//   //                 </Button>

//   //                 <Trash2
//   //                   onClick={() => deleteCategory(cat._id)}
//   //                   className="text-red-500 cursor-pointer"
//   //                 />

//   //               </div> */}
//   //             </div>
//   //           ))}

//   //         </CardContent>
//   //       </Card>

//   //     </div>
//   //   </div>
//   // );
// };

// export default AddCategory;


// // ADD PRODUCT FORM
// const AddProductForm = ({ selectedCategoryId, onClose }) => {

//   const accessToken = localStorage.getItem("accessToken");

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [productData, setProductData] = useState({
//     productName: "",
//     productPrice: "",
//     productDesc: "",
//     productImg: [],
//     brand: "",
//     category: selectedCategoryId || ""
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const res = await axios.get("http://localhost:8000/api/v1/category/get");
//       if (res.data.success) {
//         setCategories(res.data.categories);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("productName", productData.productName);
//     formData.append("productPrice", productData.productPrice);
//     formData.append("productDesc", productData.productDesc);
//     formData.append("category", productData.category);
//     formData.append("brand", productData.brand);

//     productData.productImg.forEach(img => {
//       formData.append("files", img);
//     });

//     try {
//       setLoading(true);

//       await axios.post(
//         "http://localhost:8000/api/v1/product/add",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       toast.success("Product Added");
//       onClose();

//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={submitHandler} className="flex flex-col gap-3">

//       <Input name="productName" placeholder="Product Name" onChange={handleChange} />

//       <Input name="productPrice" type="number" placeholder="Price" onChange={handleChange} />

//       <Input name="brand" placeholder="Brand" onChange={handleChange} />

//       <Select value={productData.category} disabled={true}>
//         <SelectTrigger>
//           <SelectValue placeholder="Select Category" />
//         </SelectTrigger>

//         <SelectContent>
//           {categories.map((cat) => (
//             <SelectItem key={cat._id} value={cat._id}>
//               {cat.categoryName}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Textarea name="productDesc" placeholder="Description" onChange={handleChange} />

//       <div className="w-full">
//         <ImageUpload
//           productData={productData}
//           setProductData={setProductData}
//         />
//       </div>

//       <Button type="submit" disabled={loading}>
//         {loading ? "Please wait..." : "Add Product"}
//       </Button>

//     </form>
//   );
// };

// aa coumplet j chhe but responsive natu

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2, Trash2 } from "lucide-react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select";

// import { Textarea } from "@/components/ui/textarea";
// import ImageUpload from "@/components/ImageUpload";

// const AddCategory = () => {

//   const [loading, setLoading] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);

//   // ✅ NEW STATES
//   const [addOpen, setAddOpen] = useState(false);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");

//   const getCategories = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/category/get");

//       if (res.data.success) {
//         setCategories(res.data.categories);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   // ADD CATEGORY
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!categoryName) {
//       toast.error("Category name required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/category/add",
//         { categoryName }
//       );

//       if (res.data.success) {
//         toast.success("Category Added Successfully");
//         setCategoryName("");
//         getCategories();
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DELETE CATEGORY
//   const deleteCategory = async (id) => {
//     try {
//       const res = await axios.delete(
//         `http://localhost:8000/api/v1/category/delete/${id}`
//       );

//       if (res.data.success) {
//         toast.success(res.data.message);
//         setCategories(categories.filter((cat) => cat._id !== id));
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="pl-[350px] py-10 min-h-screen pr-20 bg-gray-100">

//       {/* ✅ ADD PRODUCT POPUP */}
//       <Dialog open={addOpen} onOpenChange={setAddOpen}>
//        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Add Product</DialogTitle>
//           </DialogHeader>

//           <AddProductForm
//             selectedCategoryId={selectedCategoryId}
//             onClose={() => setAddOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>

//       <div className="grid grid-cols-2 gap-6">

//         {/* ADD CATEGORY */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Category</CardTitle>
//             <CardDescription>
//               Enter Category Name
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <div className="grid gap-2">
//               <Label>Category Name</Label>
//               <Input
//                 type="text"
//                 placeholder="Ex - Sofa"
//                 value={categoryName}
//                 onChange={(e) => setCategoryName(e.target.value)}
//               />
//             </div>
//           </CardContent>

//           <CardFooter>
//             <Button
//               disabled={loading}
//               onClick={submitHandler}
//               className="w-full bg-pink-600"
//             >
//               {
//                 loading
//                   ? <span className="flex gap-1 items-center">
//                     <Loader2 className="animate-spin" />
//                     please wait
//                   </span>
//                   : "Add Category"
//               }
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* CATEGORY LIST */}
//         <Card>
//           <CardHeader>
//             <CardTitle>All Categories</CardTitle>
//             <CardDescription>
//               Manage categories
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="flex flex-col gap-3">

//             {
//               categories.length === 0 && (
//                 <p className="text-gray-500">No categories found</p>
//               )
//             }

//             {
//               categories.map((cat) => (
//                 <div
//                   key={cat._id}
//                   className="flex items-center justify-between border p-2 rounded-md"
//                 >

//                   <h1 className="font-medium">
//                     {cat.categoryName}
//                   </h1>

//                   <div className="flex gap-2 items-center">

//                     {/* ✅ ADD PRODUCT BUTTON */}
//                     <Button
//                       className="bg-green-600 text-white px-2 py-1"
//                       onClick={() => {
//                         setSelectedCategoryId(cat._id);
//                         setAddOpen(true);
//                       }}
//                     >
//                       Add Product
//                     </Button>

//                     <Trash2
//                       onClick={() => deleteCategory(cat._id)}
//                       className="text-red-500 cursor-pointer"
//                     />

//                   </div>

//                 </div>
//               ))
//             }

//           </CardContent>
//         </Card>

//       </div>

//     </div>
//   );
// };

// export default AddCategory;


// /// ✅ ADD PRODUCT FORM COMPONENT
// const AddProductForm = ({ selectedCategoryId, onClose }) => {

//   const accessToken = localStorage.getItem("accessToken");

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [productData, setProductData] = useState({
//     productName: "",
//     productPrice: "",
//     productDesc: "",
//     productImg: [],
//     brand: "",
//     category: selectedCategoryId || ""
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const res = await axios.get("http://localhost:8000/api/v1/category/get");
//       if (res.data.success) {
//         setCategories(res.data.categories);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("productName", productData.productName);
//     formData.append("productPrice", productData.productPrice);
//     formData.append("productDesc", productData.productDesc);
//     formData.append("category", productData.category);
//     formData.append("brand", productData.brand);

//     productData.productImg.forEach(img => {
//       formData.append("files", img);
//     });

//     try {
//       setLoading(true);

//       await axios.post(
//         "http://localhost:8000/api/v1/product/add",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       toast.success("Product Added");
//       onClose();

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={submitHandler} className="flex flex-col gap-3">

//       <Input name="productName" placeholder="Product Name" onChange={handleChange} />

//       <Input name="productPrice" type="number" placeholder="Price" onChange={handleChange} />

//       <Input name="brand" placeholder="Brand" onChange={handleChange} />

//       <Select
//         value={productData.category}
//         disabled={true} // ✅ CHANGE (LOCK CATEGORY)
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select Category" />
//         </SelectTrigger>

//         <SelectContent>
//           {categories.map((cat) => (
//             <SelectItem key={cat._id} value={cat._id}>
//               {cat.categoryName}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Textarea name="productDesc" placeholder="Description" onChange={handleChange} />

//       <ImageUpload
//         productData={productData}
//         setProductData={setProductData}
//       />

//       <Button type="submit" disabled={loading}>
//         {loading ? "Please wait..." : "Add Product"}
//       </Button>

//     </form>
//   );
// };



// today




// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2, Trash2 } from "lucide-react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";

// const AddCategory = () => {

//   const [loading, setLoading] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [categories, setCategories] = useState([]);

//   // ✅ get all categories
//   const getCategories = async () => {
//     try {

//       const res = await axios.get(
//         "http://localhost:8000/api/v1/category/get"
//       );

//       if (res.data.success) {
//         setCategories(res.data.categories);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   // ✅ add category
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!categoryName) {
//       toast.error("Category name required");
//       return;
//     }

//     try {

//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/category/add",
//         { categoryName }
//       );

//       if (res.data.success) {
//         toast.success("Category Added Successfully");
//         setCategoryName("");
//         getCategories(); // refresh list
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ delete category
//   const deleteCategory = async (id) => {
//     try {

//       const res = await axios.delete(
//         `http://localhost:8000/api/v1/category/delete/${id}`
//       );

//       if (res.data.success) {
//         toast.success(res.data.message);
//         setCategories(categories.filter((cat) => cat._id !== id));
//       }

//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="pl-[350px] py-10 min-h-screen pr-20 bg-gray-100">

//       <div className="grid grid-cols-2 gap-6">

//         {/* ✅ ADD CATEGORY */}
//         <Card>

//           <CardHeader>
//             <CardTitle>Add Category</CardTitle>
//             <CardDescription>
//               Enter Category Name
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <div className="grid gap-2">
//               <Label>Category Name</Label>
//               <Input
//                 type="text"
//                 placeholder="Ex - Sofa"
//                 value={categoryName}
//                 onChange={(e) => setCategoryName(e.target.value)}
//               />
//             </div>
//           </CardContent>

//           <CardFooter>
//             <Button
//               disabled={loading}
//               onClick={submitHandler}
//               className="w-full bg-pink-600 cursor-pointer"
//             >
//               {
//                 loading
//                   ? <span className="flex gap-1 items-center">
//                       <Loader2 className="animate-spin" />
//                       please wait
//                     </span>
//                   : "Add Category"
//               }
//             </Button>
//           </CardFooter>

//         </Card>


//         {/* ✅ CATEGORY LIST */}
//         <Card>

//           <CardHeader>
//             <CardTitle>All Categories</CardTitle>
//             <CardDescription>
//               Manage categories
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="flex flex-col gap-3">

//             {
//               categories.length === 0 && (
//                 <p className="text-gray-500">No categories found</p>
//               )
//             }

//             {
//               categories.map((cat) => (
//                 <div
//                   key={cat._id}
//                   className="flex items-center justify-between border p-2 rounded-md"
//                 >

//                   <h1 className="font-medium">
//                     {cat.categoryName}
//                   </h1>

//                   <Trash2
//                     onClick={() => deleteCategory(cat._id)}
//                     className="text-red-500 cursor-pointer"
//                   />

//                 </div>
//               ))
//             }

//           </CardContent>

//         </Card>

//       </div>

//     </div>
//   );
// };

// export default AddCategory;



// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "sonner";

// const AddCategory = () => {

//   const [loading, setLoading] = useState(false);

//   const [categoryName, setCategoryName] = useState("");

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!categoryName) {
//       toast.error("Category name required");
//       return;
//     }

//     try {

//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/category/add",
//         { categoryName }
//       );

//       if (res.data.success) {
//         toast.success("Category Added Successfully");
//         setCategoryName("");
//       }

//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pl-[350px] py-10 min-h-screen pr-20 mx-auto px-4 bg-gray-100">

//       <Card className="w-full my-1.5">

//         <CardHeader>
//           <CardTitle>Add Category</CardTitle>
//           <CardDescription>
//             Enter Category Name
//           </CardDescription>
//         </CardHeader>

//         <CardContent>

//           <div className="grid gap-2">
//             <Label>Category Name</Label>
//             <Input
//               type="text"
//               placeholder="Ex - Sofa"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//             />
//           </div>

//         </CardContent>

//         <CardFooter>
//           <Button
//             disabled={loading}
//             onClick={submitHandler}
//             className="w-full bg-pink-600 cursor-pointer"
//           >
//             {
//               loading
//                 ? <span className="flex gap-1 items-center">
//                     <Loader2 className="animate-spin" />
//                     please wait
//                   </span>
//                 : "Add Category"
//             }
//           </Button>
//         </CardFooter>

//       </Card>

//     </div>
//   );
// };

// export default AddCategory;