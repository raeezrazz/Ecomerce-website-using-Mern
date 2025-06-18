import React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react';

function ContactUsBody() {
  return (
    <div className="bg-gray-50 min-h-screen px-4 py-12">
    <div className="text-center mb-10">
      <button className="text-sm px-4 py-1 rounded-full border mb-4">CONTACT US</button>
      <h1 className="text-4xl font-semibold">Let’s <span className="text-blue-600">Connect</span></h1>
      <p className="text-gray-600 mt-2">We’d love to hear about your meter service needs.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
      {/* Location */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-600 text-white p-4 rounded-full mb-3 ">
          <MapPin className="h-4 w-4" />
        </div>
        <h4 className="font-semibold">India</h4>
        <p>Calicut, Kerala</p>
      </div>
      {/* Phone */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-600 text-white p-4 rounded-full mb-3">
          <Phone className="h-6 w-6" />
        </div>
        <h4 className="font-semibold">Phone</h4>
        <p>+91 97785 99696</p>
      </div>
      {/* Email */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-600 text-white p-4 rounded-full mb-3">
          <Mail className="h-6 w-6" />
        </div>
        <h4 className="font-semibold">Email</h4>
        <p>ashhadkhan@gmail.com</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-0 max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow mt-12">
        {/* Form Section */}
        <div className="p-10">
          {/* <button className="text-xs px-4 py-1 rounded-full border mb-6">CONTACT US</button> */}
          <h1 className="text-4xl font-semibold text-blue-600 mb-2">Get in Touch</h1>
          <p className="text-gray-600 mb-8">
            Have a question or feedback?<br />
            Fill out the form below, and we’ll respond promptly!
          </p>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Your name" className="col-span-1 border p-3 rounded-lg" />
            <input type="email" placeholder="Email address" className="col-span-1 border p-3 rounded-lg" />
            <input type="tel" placeholder="Phone number" className="col-span-1 border p-3 rounded-lg" />
            <input type="text" placeholder="Company name" className="col-span-1 border p-3 rounded-lg" />
            <textarea
              placeholder="Your message"
              className="col-span-2 border p-3 rounded-lg"
              rows={4}
            />
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-green-900"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=1000&q=80"
            alt="Meeting"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Floating Section */}
      {/* <div className="max-w-4xl mx-auto mt-12 mb-6 px-6">
        <div className="bg-white shadow-lg rounded-full flex items-center gap-4 px-6 py-4">
          <div className="bg-lime-500 h-4 w-4 rounded-full"></div>
          <p className="text-sm text-gray-800">
            Call us at <strong>+91 95152 75560</strong> or fill out our form, and we’ll contact you within one business day.
          </p>
        </div>
      </div> */}
      <section className="p-10">
        <h2 className="text-4xl font-semibold text-green-600 mb-8">Office Locations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* HQ */}
          <div className="rounded-xl p-6 bg-blue-800 text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 h-32 w-32 bg-blue-400 rounded-tl-full"></div>
            <h3 className="text-xl font-bold">RS Meter Service</h3>
            <p className="text-lg">All Type Digital Meter Servicing</p>
            <p>Calicut, Kerala</p>
            <p className="mt-4 text-lime-300 font-semibold">Get direction →</p>
          </div>

          {/* Office 1 */}
          <div className="rounded-xl border p-6">
            <p className="uppercase text-sm text-gray-500 mb-2">Office</p>
            <h3 className="text-lg font-semibold">Calicut</h3>
            <p>Rs Meter Service</p>
            <p>Thottungal (P.O)</p>
            <p>Ramanattukara , Calicut</p>
            <p>Kerala ,India ,673633</p>
            <p className="mt-2 text-green-900 font-semibold">+91 97785 99696 </p>
            <p className="mt-4 text-lime-500 font-semibold">Get direction →</p>
          </div>

         
          
        </div>
      </section>
    </div>
    
  )
}

export default ContactUsBody
