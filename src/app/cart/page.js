// 'use client'

// import { CartContext, cartItemsPrice } from "@/components/AppContext";
// import Trash from "@/components/icons/Trash";
// import AddressInputs from "@/components/layout/AddressInputs";
// import SectionHeaders from "@/components/layout/SectionHeaders";
// import { useProfile } from "@/components/UseProfile";
// import Image from "next/image";
// import { useContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function CartPage() {
//     const { cartItems, removeCartItem, clearCart } = useContext(CartContext)
//     const { data: profileData } = useProfile()
//     const [address, setAddress] = useState({})

//     console.log(profileData);


//     useEffect(() => {
//         setAddress(profileData)
//     }, [profileData])

//     const totalPrice = cartItems.reduce((sum, item) => sum + cartItemsPrice(item), 0)

//     function handleAddressChange(propName, value) {
//         setAddress(prev => {
//             return { ...prev, [propName]: value }
//         })
//     }

//     async function proceedToCheckout(ev) {
//         ev.preventDefault();

//         // Prevent proceeding to checkout if the cart is empty
//         if (cartItems.length === 0) {
//             toast.error('Your cart is empty');
//             return;
//         }

//         try {
//             const res = await fetch('/api/checkout', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ cartItems, address })
//             });

//             if (res.ok) {
//                 await toast.promise(Promise.resolve(), {
//                     loading: 'Placing order...',
//                     success: 'Order placed',
//                 });

//                 clearCart();
//             } else {
//                 await toast.promise(Promise.reject(), {
//                     loading: 'Placing order...',
//                     error: 'Failed to place the order',
//                 });
//             }
//         } catch (error) {
//             toast.error('Failed to place the order');
//         }
//     }


//     return (
//         <section className="mt-8">
//             <div className="text-center">
//                 <SectionHeaders mainHeader='Cart' />
//             </div>
//             <div className="grid grid-cols-2 gap-12 mt-8">
//                 <div>
//                     {
//                         cartItems?.length === 0
//                             ? <div>Cart is empty</div>
//                             : (cartItems.map((item, index) => (
//                                 <div key={index} className="flex items-center gap-4 border-b py-2">
//                                     <div className="w-24">
//                                         <Image src={item.image} width={280} height={280} />
//                                     </div>
//                                     <div className="grow">
//                                         <h3 className="font-semibold">{item.name}</h3>
//                                         {item.size && (
//                                             <div className="text-sm text-gray-700">
//                                                 Size: <span>{item.size.name}</span>
//                                             </div>
//                                         )}
//                                         {item.toppings.length > 0 && (
//                                             <div>
//                                                 {
//                                                     item.toppings.map(topping => (
//                                                         <div className="text-sm text-gray-500">
//                                                             Extra {topping.name} ${topping.price}
//                                                         </div>
//                                                     ))
//                                                 }
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="text-lg font-semibold">
//                                         ${cartItemsPrice(item)}
//                                     </div>
//                                     <div className="ml-2">
//                                         <button onClick={() => removeCartItem(index)}
//                                             type="button" className="p-2"><Trash /></button>
//                                     </div>
//                                 </div>
//                             )))
//                     }
//                     <div className="py-4 text-lg text-right">
//                         Total:&nbsp;
//                         <span className="font-semibold">
//                             ${totalPrice}
//                         </span>
//                     </div>
//                 </div>

//                 <div className="bg-gray-100 p-4 rounded-lg">
//                     <h2 className="text-lg font-semibold">Checkout</h2>
//                     <form onSubmit={proceedToCheckout}>
//                         <AddressInputs addressProps={address} setAddressProps={handleAddressChange} />
//                         <button className="primary" disabled={cartItems.length === 0}>Place Order</button>
//                     </form>
//                 </div>
//             </div>
//         </section>
//     )
// }


'use client';

import { CartContext, cartItemsPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useProfile } from "@/components/UseProfile";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useRazorpayScript from "@/components/useRazorpayScript";

export default function CartPage() {
    const { cartItems, removeCartItem, clearCart } = useContext(CartContext);
    const { data: profileData } = useProfile();
    const [address, setAddress] = useState({});

    useEffect(() => {
        setAddress(profileData);
    }, [profileData]);

    const totalPrice = cartItems.reduce((sum, item) => sum + cartItemsPrice(item), 0).toFixed(2);

    function handleAddressChange(propName, value) {
        setAddress(prev => ({ ...prev, [propName]: value }));
    }

    useRazorpayScript();

    async function proceedToCheckout(ev) {
        ev.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalPrice })
            });

            const orderData = await res.json();

            if (res.ok) {
                const options = {
                    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is correct
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Pizza store",
                    description: "Test Transaction",
                    order_id: orderData.id,
                    handler: async function (response) {
                        const paymentResponse = await fetch('/api/payment-verification', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...response, cartItems, address, totalPrice })
                        });
                        if (paymentResponse.ok) {
                            toast.success('Payment successful! Order placed.');
                            clearCart();
                        } else {
                            toast.error('Payment verification failed.');
                        }
                    },
                    prefill: {
                        name: profileData?.name,
                        email: profileData?.email,
                        contact: profileData?.phoneNum || '9999999999'
                    },
                    theme: {
                        color: '#F37254'
                    }
                };

                if (window.Razorpay) {
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                } else {
                    console.error('Razorpay script not loaded');
                }
            } else {
                toast.error('Failed to initiate payment');
            }
        } catch (error) {
            console.error('Checkout Error:', error.message || error);
            toast.error('Failed to proceed with checkout');
        }
    }

    return (
        <section className="mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader='Cart' />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                <div>
                    {cartItems?.length === 0 ? (
                        <div>Cart is empty</div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="md:flex items-center gap-4 border-b py-2">
                                <div className="w-24">
                                    <Image src={item.image} alt="food item" width={280} height={280} />
                                </div>
                                <div className="grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    {item.size && (
                                        <div className="text-sm text-gray-700">
                                            Size: <span>{item.size.name}</span>
                                        </div>
                                    )}
                                    {item.toppings.length > 0 && (
                                        <div>
                                            {item.toppings.map(topping => (
                                                <div key={topping.name} className="text-sm text-gray-500">
                                                    Extra {topping.name} ${topping.price}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-lg font-semibold">
                                    ${cartItemsPrice(item)}
                                </div>
                                <div className="ml-2">
                                    <button onClick={() => removeCartItem(index)} type="button" className="p-2"><Trash /></button>
                                </div>
                            </div>
                        ))
                    )}
                    <div className="py-4 text-lg text-right">
                        Total:&nbsp;
                        <span className="font-semibold">${totalPrice}</span>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Checkout</h2>
                    <form onSubmit={proceedToCheckout}>
                        <AddressInputs addressProps={address} setAddressProps={handleAddressChange} />
                        <button className="primary" disabled={cartItems.length === 0}>Pay ${totalPrice}</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
