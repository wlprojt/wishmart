"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { useRouter } from "next/navigation";


type CartItem = {
  _id: string;
  title: string;
  price: number;
  sale_price?: number;
  qty: number;
  image: string;
};

type UserType = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [stateCode, setStateCode] = useState("");
  const [cityName, setCityName] = useState("");
  const isFormValid =
  firstName.trim() &&
  lastName.trim() &&
  email.trim() &&
  phone.trim() &&
  address.trim() &&
  postalCode.trim() &&
  countryCode &&
  stateCode &&
  cityName &&
  cartItems.length > 0;

const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid) return;

  try {
    // 1️⃣ Create ORDER in DB (pending)
    const createOrderRes = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        billing: {
          firstName,
          lastName,
          phone,
          address,
          apartment,
          country: Country.getCountryByCode(countryCode)?.name,
          state: State.getStateByCodeAndCountry(stateCode, countryCode)?.name,
          city: cityName,
          postalCode,
        },
        items: cartItems.map(item => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        totalAmount: subtotal,
      }),
    });

    if (!createOrderRes.ok) {
      alert("Failed to create order");
      return;
    }

    const orderData = await createOrderRes.json();

    // 2️⃣ Create Razorpay order (USD only)
    const paymentRes = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: subtotal }),
    });

    const razorpayOrder = await paymentRes.json();

    // 3️⃣ Open Razorpay
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: razorpayOrder.amount,
      currency: "USD",
      name: "Your Store",
      description: "Checkout Payment",
      order_id: razorpayOrder.id,

      handler: async function (response: any) {
        // 4️⃣ Verify & update order
        await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData._id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
          }),
        });

        // 2️⃣ ✅ CLEAR CART (IMPORTANT)
        localStorage.removeItem("cart"); 
        setCartItems([]); // if using useState / context

        router.push("/order-success");
      },

      prefill: {
        email,
        contact: phone,
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);



useEffect(() => {
  async function ensureJwtAndFetchUser() {
    try {
      await fetch("/api/auth/session-to-jwt", {
        method: "POST",
        credentials: "include",
      });

      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data: UserType = await res.json();
      setUser(data);
      setEmail(data.email); // ✅ auto-fill email
    } catch (err) {
      console.error("Failed to fetch user:", err);
      router.replace("/login");
    }
  }

  ensureJwtAndFetchUser();
}, [router]);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCartItems(data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
  (acc, item) =>
    acc + (item.sale_price ?? item.price) * item.qty,
  0
);


  if (loading) {
    return <p className="text-center py-10">Loading checkout...</p>;
  }

  return (
  <div className="bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Details */}
        <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-6">
                Billing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                <label className="form-label">
                    First name <span className="text-red-500">*</span>
                </label>
                <input className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                </div>

                {/* Last Name */}
                <div>
                <label className="form-label">
                    Last name <span className="text-red-500">*</span>
                </label>
                <input className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                <label className="form-label">
                    Email address <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>


                {/* Country */}
                <div className="md:col-span-2">
                <label className="form-label">Country / Region</label>
                <select
                    className="form-input"
                    value={countryCode}
                    onChange={(e) => {
                    setCountryCode(e.target.value);
                    setStateCode("");
                    setCityName("");
                    }}
                >
                    {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                    </option>
                    ))}
                </select>
                </div>


                {/* Street Address */}
                <div className="md:col-span-2">
                <label className="form-label">
                    House number and street name <span className="text-red-500">*</span>
                </label>
                <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                {/* Apartment */}
                <div className="md:col-span-2">
                <label className="form-label">
                    Apartment, suite, unit, etc. <span className="text-gray-400">(optional)</span>
                </label>
                <input className="form-input" value={apartment} onChange={(e) => setApartment(e.target.value)} />
                </div>


                {/* State */}
                <div>
                <label className="form-label">State</label>
                <select
                    className="form-input"
                    value={stateCode}
                    onChange={(e) => {
                    setStateCode(e.target.value);
                    setCityName("");
                    }}
                    disabled={!countryCode}
                >
                    <option value="">Select State</option>
                    {State.getStatesOfCountry(countryCode).map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* City */}
                    <div>
                    <label className="form-label">
                        Town / City <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="form-input"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        disabled={!stateCode}
                    >
                        <option value="">Select City</option>
                        {City.getCitiesOfState(countryCode, stateCode).map((c) => (
                        <option key={c.name} value={c.name}>
                            {c.name}
                        </option>
                        ))}
                    </select>
                    </div>


                {/* ZIP */}
                <div>
                <label className="form-label">
                    Postcode / ZIP <span className="text-red-500">*</span>
                </label>
                <input className="form-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                <label className="form-label">
                    Phone <span className="text-red-500">*</span>
                </label>
                <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
            </div>
            </div>


        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty
            </p>
          ) : (
            <>
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="rounded-lg border"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${((item.sale_price ?? item.price) * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${subtotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid}
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition
                    ${
                    isFormValid
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                Place Order
                </button>

                {!isFormValid && (
                    <p className="text-xs text-gray-500 mt-2">
                        Please fill in all required billing details to place your order.
                    </p>
                )}

            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

}
