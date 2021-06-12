const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
	//syntax for creating a Endpoint in next-js
	const { items, email } = req.body;

	const transformedItems = items.map((item) => ({
		description: item.description,
		quantity: 1,
		price_data: {
			currency: "usd",
			product_data: {
				name: item.title,
				images: [item.image],
			},
			unit_amount: item.price * 100,
		},
	})); //implicit return

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		shipping_rates: ["shr_1Iyh58SFWx5VhGzblCyJcR92"], // For next day shipping
		shipping_address_collection: {
			allowed_countries: ["GB", "US", "CA"], //These are the countries which we ship our orders too
		},
		line_items: transformedItems,
		mode: "payment",
		success_url: `${process.env.HOST}/success`,
		cancel_url: `${process.env.HOST}/checkout`, //redirect user on checkout if something goes wrong or he cancels the order
		metadata: {
			email,
			images: JSON.stringify(items.map((item) => item.image)), // treats whole as array as massive string
		},
	});
	res.status(200).json({ id: session.id });
};
