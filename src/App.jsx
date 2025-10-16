import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Coffee,
  Clock,
  MapPin,
} from "lucide-react";
// import axios from 'axios';
export default function CoffeeOrderApp() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    floor: "",
    room: "",
    phone: "",
  });

  // Simulated API call - replace with your actual API endpoint
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token") ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdyaWxsX05fU2hha2VzIiwibmJmIjoxNzU5MTMyMzY3LCJleHAiOjE3NjY5MDgzNjcsImlhdCI6MTc1OTEzMjM2N30.ko8YPHfApg0uN0k3kUTLcJXpZp-2s-6TiRHpsiab42Q";

        const response = await fetch(
          "https://localhost:7104/api/Order/GetCoffeeItems?username=Grill_N_Shakes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (
      !customerDetails.name ||
      !customerDetails.floor ||
      !customerDetails.room ||
      !customerDetails.phone
    ) {
      alert("Please fill in all details");
      return;
    }

    const order = {
      customer: customerDetails,
      items: cart,
      total: getTotalPrice(),
      timestamp: new Date().toISOString(),
    };

    // Replace with your actual API endpoint
    // await fetch('YOUR_ORDER_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(order)
    // });

    console.log("Order placed:", order);
    alert(
      "Order placed successfully! We will deliver to your location shortly."
    );
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
    setCustomerDetails({ name: "", floor: "", room: "", phone: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-amber-700 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-amber-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Grill_N_Shakes</h1>
                <p className="text-xs text-amber-200">
                  In-Building Coffee Delivery
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-amber-800 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Delivery in 5-10 mins</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Plan S only</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Menu Grid */}
        {!showCart && !showCheckout && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100  flex items-center justify-center h-48 overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${item.image}`}
                      alt={item.coffeeName}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<span class="text-6xl">☕</span>';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.coffeeName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-700">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart View */}
        {showCart && !showCheckout && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back to Menu
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-4"
                      >
                        <div className="bg-gradient-to-br   from-amber-100 to-orange-100 flex items-center justify-center w-24 h-24 rounded-lg overflow-hidden">
                          <img
                            src={`data:image/jpeg;base64,${item.image}`}
                            alt={item.coffeeName}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h2 className="font-semibold text-gray-800">
                            {item.coffeeName}
                          </h2>
                          {/* <h4 className="font-semibold text-gray-800">
                            {item.description}
                          </h4> */}
                          <p className="text-amber-700 font-bold">
                            ₹{item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-800">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-amber-700">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Checkout View */}
        {showCheckout && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back to Cart
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Floor
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={customerDetails.floor}
                      onChange={handleInputChange}
                      placeholder="e.g., 3rd"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Room/Desk
                    </label>
                    <input
                      type="text"
                      name="room"
                      value={customerDetails.room}
                      onChange={handleInputChange}
                      placeholder="e.g., 305A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Order Summary
                </h3>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {item.coffeeName} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-amber-700">₹{getTotalPrice()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
