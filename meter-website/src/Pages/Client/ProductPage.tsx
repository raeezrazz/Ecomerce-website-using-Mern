import React from 'react'
import Header from '../../Components/Common/Header'
import Breadcrumbs from '../../Components/Common/Breadcrumbs'
import Footer from '../../Components/Common/Footer'
import ProductDetails from '../../Components/Client/ProductDetails'
import DeliveryPolicy from '../../Components/Client/DeliveryPolicy'
import ProductDiscription from '../../Components/Client/ProductDiscription'
import CustomerReviews from '../../Components/Client/CustomerReview'
import RelatedProducts from '../../Components/Common/RelatedProducts'
import StickyCartSummary from '../../Components/Common/StickyCart'
function ProductPage() {
  return (
    <div>
        <Header/>
        <Breadcrumbs
         items={[
            { label: "Home", path: "/" },
            { label: "Shop", path: "/shop"},
            { label: "product" }
          ]}/>
          <ProductDetails/> 
          <DeliveryPolicy/>
          <ProductDiscription/>
          <CustomerReviews/>
          <RelatedProducts/>
          <StickyCartSummary
            title="Hero Splendor Digital Meter"
            price={1299}
            onAddToCart={() => {
            console.log("Added to cart!");
         }}
        />
        <Footer/>
    </div>
  )
}

export default ProductPage
