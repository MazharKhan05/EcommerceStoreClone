import moment from "moment";
import Currency from "react-currency-formatter";

function Order({ id, amount, amountShipping, items, timestamp, images }) {
	return (
		<div className="relative border rounded-md">
			{/* upper header */}
			<div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">
				<div>
					<p className="text-xs font-bold">ORDER PLACED</p>
					<p>{moment.unix(timestamp).format("DD MMM YYYY")}</p>
				</div>
				<div>
					<p className="font-bold text-xs">Total</p>
					<p>
						<Currency quantity={amount} /> + Next Day Delivery (
						<Currency quantity={amountShipping} />)
					</p>
				</div>

				<p className="absolute top-4 right-2 text-xs whitespace-nowrap truncate w-40 lg:w-80">
					ORDER #{id}
				</p>
				<p className="text-sm mt-2 whitespace-nowrap sm:text-lg text-yellow-500 flex-1 text-right">
					{items.length} items
				</p>
			</div>
			<div className="p-5 md:p-10">
				<div className="flex space-x-6 overflow-x-auto">
					{images.map((img) => (
						<img src={img} className="h-20 md:h-32 object-contain" />
					))}
				</div>
			</div>
		</div>
	);
}

export default Order;
