import { buffer } from "micro";
import * as admin from "firebase-admin";

const serviceAccount = require("../../../permissions.json");

//be careful of not initializing two apps at once in backend
//use an existing app if exists or create a new one
const app = !admin.apps.length
	? admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
	  })
	: admin.app();

//connect to stripe from backend
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
	console.log("fulfilling order", session);

	return app
		.firestore()
		.collection("users")
		.doc(session.metadata.email)
		.collection("orders")
		.doc(session.id)
		.set({
			amount: session.amount_total / 100,
			amount_shipping: session.total_details.amount_shipping / 100,
			images: JSON.parse(session.metadata.images),
			timestamp: admin.firestore.FieldValue.serverTimestamp(),
		})
		.then(() => {
			console.log(`SUCCESS:: Order ${session.id} has been added to db...`);
		});
};

export default async (req, res) => {
	if (req.method === "POST") {
		const requestBuffer = await buffer(req); //to generate certicate and consume req stream as buffer of information
		const payload = requestBuffer.toString();

		const sig = req.headers["stripe-signature"];
		let event;

		// verify whether this event is legitmately from stripe itself
		try {
			event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
		} catch (error) {
			console.log("ERROR", error.message);
			return res.status(400).send(`Webhook Error: ${error.message}`);
		}

		//Handle checkout.session.completed event from stripe
		if (event.type === "checkout.session.completed") {
			const session = event.data.object; //order content

			//fulfill the order(push that specific order in db)

			return fulfillOrder(session)
				.then(() => res.status(200))
				.catch((err) => res.status(400).send(`WebHook Err: ${err.message}`));
		}
	}
};
//disabling bodyparser as we used buffer here for getting stream of req
export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};
