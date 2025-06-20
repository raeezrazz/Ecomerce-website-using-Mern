import React from 'react'

function CartItems() {
    const cartItems = [1, 2]; 
  return (
    <>
   
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">
        Your Shopping Cart {cartItems.length > 0 && `(${cartItems.length} items)`}
      </h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CartItemList />
            <CouponBox />
          </div>
          <CartSummary />
        </div>
      )}
    </div>
    <SuggestedProducts />
    <Footer />
  </>
  )
}

export default CartItems
