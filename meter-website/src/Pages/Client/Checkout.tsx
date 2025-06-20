import React from 'react'
import Header from '../../Components/Common/Header'
import Footer from '../../Components/Common/Footer'
import PageTitle from '../../Components/Common/PageTitle'
import CheckoutMain from '../../Components/Client/CheckoutMain'

function Checkout() {
  return (
    <div>
        <Header/>
        <PageTitle Header='Checkout' Discription=' Finalize your purchase of premium vehicle meter services and accessories. Confirm your contact, shipping, and payment details to complete your order with confidence.'/>
        <CheckoutMain/>
        <Footer/>
      
    </div>
  )
}

export default Checkout
