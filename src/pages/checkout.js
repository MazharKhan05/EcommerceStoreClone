import Image from "next/image";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import { selectItems, selectTotal } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(process.env.stripe_public_key); //Takes in public that gives access to our stripe acc

function Checkout() {
	const items = useSelector(selectItems);
	const total = useSelector(selectTotal);
	const [session] = useSession();

	const createCheckoutSession = async () => {
		const stripe = await stripePromise;

		//call an endpoint on backend to create a checkout session
		const checkoutSession = await axios.post("/api/create-checkout-session", {
			items: items,
			email: session.user.email,
		});

		// Redirect user to stripe checkout page
		const result = await stripe.redirectToCheckout({
			sessionId: checkoutSession.data.id,
		});

		if (result.error) alert(result.error.message);
	};

	return (
		<div className="bg-gray-100">
			<Header />
			<ToastContainer position="top-right" closeOnClick />
			<main className=" lg:flex max-w-screen-2xl mx-auto">
				{/* Left */}
				<div className=" flex-grow m-5 shadow-sm">
					<Image
						src="https://links.papareact.com/ikj"
						width={1020}
						height={250}
						objectFit="contain"
					/>
					<div className="bg-white flex flex-col p-5 space-y-10">
						<h1 className="text-3xl  border-b pb-4">
							{items.length === 0
								? "Your Amazon Basket is Empty."
								: "Your Shopping Basket"}
						</h1>
						{items.map((item, i) => (
							<CheckoutProduct
								key={i}
								id={item.id}
								title={item.title}
								price={item.price}
								rating={item.rating}
								description={item.description}
								category={item.category}
								image={item.image}
								hasPrime={item.hasPrime}
							/>
						))}
					</div>
				</div>

				{/* Right */}
				<div className="whitespace-nowrap flex flex-col bg-white p-10 shadow-md">
					{items.length > 0 && (
						<>
							<h2 className="text-md">
								SubTotal ({items.length} items):
								<span className="font-bold">
									<Currency quantity={total} />
								</span>
							</h2>
							<button
								onClick={createCheckoutSession}
								role="link"
								disabled={!session}
								className={`button mt-2 ${
									!session &&
									"from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
								}`}
							>
								{!session ? "SignIn to CheckOut" : "Proceed to CheckOut"}
							</button>
						</>
					)}
				</div>
			</main>
		</div>
	);
}

export default Checkout;
