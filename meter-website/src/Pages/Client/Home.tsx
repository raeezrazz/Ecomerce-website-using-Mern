import React from 'react'
import Header from '../../Components/Common/Header'
import Hero from '../../Components/Common/Hero'
import Footer from '../../Components/Common/Footer'
import LoginModal from '../../Components/Auth/LoginModal'
import FeaturesAndServices from '../../Components/Client/FeaturesAndServicePage'
import AboutSection from '../../Components/Client/AboutSection'

export default function Home() {
  return (
    <>
      <div className='bg-gray-100'>
        <Header/>
        <Hero/>
        <FeaturesAndServices/>
        <AboutSection/>
        <Footer/>
        </div>
           </>
  )
}
