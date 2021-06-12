import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [],
};

export const basketSlice = createSlice({
	name: "basket",
	initialState,
	reducers: {
		//Actions
		addToBasket: (state, action) => {
			state.items = [...state.items, action.payload];
		},
		removeFromBasket: (state, action) => {
			//By Filter
			// let newBasket = [...state.items];

			// newBasket = newBasket.filter((item) => item.id !== action.payload.id);

			// state.items = newBasket;

			//By FindIndex(more efficient and clean)
			const index = state.items.findIndex(
				(item) => item.id === action.payload.id
			);

			let newBasket = [...state.items];

			if (index >= 0) {
				newBasket.splice(index, 1);
			} else {
				console.warn(
					`cant remove product (id: ${action.payload.id}) as its not present`
				);
			}

			state.items = newBasket;
		},
	},
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;

//here custom selector has been made to grab totalPrice from cartProducts using reduce function
export const selectTotal = (state) =>
	state.basket.items.reduce((total, item) => total + item.price, 0);

export default basketSlice.reducer;
