import React from 'react'
import Header from '../../Components/Common/Header'
import Footer from '../../Components/Common/Footer'
import Breadcrumbs from '../../Components/Common/Breadcrumbs'
import PageTitle from '../../Components/Common/PageTitle'
import CartMain from '../../Components/Client/CartMain'
import CouponBox from '../../Components/Client/CouponBox'
import RelatedProducts from '../../Components/Common/RelatedProducts'

function Cart() {
  return (
    <div>
      <Header/>
      <Breadcrumbs items={[
        { label: "Home", path: "/" },
         { label: "Cart" }
         ]} />
      <PageTitle Header='Cart'Discription=' All items listed are essential for accurate speedometer repairs and vehicle diagnostics. Please double-check before proceeding to checkout.'/>
      <CartMain/>
      <CouponBox/>
      <RelatedProducts/>
      <Footer/>
    </div>
  )
}

export default Cart
