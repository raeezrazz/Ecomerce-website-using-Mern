import React from 'react'
import Header from '../../Components/Common/Header'
import Footer from '../../Components/Common/Footer'
import Breadcrumbs from '../../Components/Common/Breadcrumbs'
import PageTitle from '../../Components/Common/PageTitle'
import ProductGrid from '../../Components/Client/ProductGrid'
import ShopFilters from '../../Components/Client/ShopFilters'
import NewsletterBanner from '../../Components/Common/NewsLetterBanner'
function Shop() {
  return (
    <>
        <Header/>
        <Breadcrumbs
         items={[
            { label: "Home", path: "/" },
            { label: "Shop" }
          ]}
          />
        <PageTitle Header ='Our Products' Discription=" Explore our range of high-quality digital and analog meter services and parts."/>
        
        <section className="flex flex-col md:flex-row px-4 md:px-12 gap-6 my-10">
            <ShopFilters />
            <ProductGrid />
        </section>
        <NewsletterBanner/>
        <Footer/>
    </>
  )
}

export default Shop
