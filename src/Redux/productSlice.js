import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: {
      items: [],
      totalPrice: 0,
    },
    addresses: [],
    selectedAddress: null,
  },

  reducers: {
    // PRODUCTS
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // CART
    setCart: (state, action) => {
      state.cart = {
        items: action.payload?.items || [],
        totalPrice: action.payload?.totalPrice || 0,
      };
    },

    clearCart: (state) => {
      state.cart = {
        items: [],
        totalPrice: 0,
      };
    },

    // ADDRESS
    addAddress: (state, action) => {
      if (!state.addresses) {
        state.addresses = [];
      }
      state.addresses.push(action.payload);
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload
      );

      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
      } else if (state.selectedAddress > action.payload) {
        state.selectedAddress -= 1;
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  clearCart,
  addAddress,
  deleteAddress,
  setSelectedAddress,
} = productSlice.actions;

export default productSlice.reducer;








// import { createSlice } from "@reduxjs/toolkit";

// const productSlice = createSlice({
//   name: 'product',
//   initialState: {
//     products: [],
//     cart: {
//       items: [],
//       totalPrice: 0
//     },
//     addresses: [],
//     selectedAddress: null, // currently chosen address
//   },
//   reducers: {
//     setProducts: (state, action) => {
//       state.products = action.payload;
//     },
//     setCart: (state, action) => {
//       state.cart = action.payload;
//     },
//     clearCart: (state) => {
//       state.cart = [];
//     },
//     // address management
//     addAddress: (state, action) => {
//       state.addresses.push(action.payload);
//     },
//     setSelectedAddress: (state, action) => {
//       state.selectedAddress = action.payload;
//     },
//     deleteAddress: (state, action) => {
//       // remove the selected address
//       state.addresses = state.addresses.filter((_, index) => index !== action.payload);

//       // reset selectedAddress if it was deleted
//       if (state.selectedAddress === action.payload) {
//         state.selectedAddress = null;
//       } else if (state.selectedAddress > action.payload) {
//         state.selectedAddress -= 1;
//       }
//     },
//   }
// });

// export const { setProducts, setCart, clearCart, addAddress, deleteAddress, setSelectedAddress } = productSlice.actions;

// export default productSlice.reducer;


// import Cart from "@/pages/Cart";
// import { createSlice } from "@reduxjs/toolkit";

// const productSlice = createSlice({
//     name: 'product',
//     initialState: {
//         products: [],
//         cart: [],

//     },
//     reducers: {
//         //action
//         setProducts: (state, action) => {
//             state.producs = action.payload
//         },
//         setCart:(state, action)=>{
//             state.cart = action.payload
//         }
//     }
// })

// export const { setProducts, setCart } = productSlice.actions
// export default productSlice.reducer