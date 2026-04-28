import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import React from 'react'
import ProductView from './ProductView';
import CategoryNavbar from '@/components/CategoryNavbar';

 const Home = () => {
  return (
    <div>
      <Hero/>
      {/* <Nav /> */}
      <CategoryNavbar/>
      <ProductView/>
      {/* <Footer/> */}
    </div>
  )
}
export default Home;