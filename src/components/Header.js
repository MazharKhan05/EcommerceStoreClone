import Image from "next/image";
import {
	SearchIcon,
	ShoppingCartIcon,
	MenuIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";

function Header() {
	const [session] = useSession();
	const router = useRouter(); //Next-js has inbuild router to route between various pages.
	const items = useSelector(selectItems); //this selector hook allows us to grab all the items from the redux store

	return (
		<header>
			{/* top nav */}
			{/* here 'sm:flex-grow-0' says that when display is in mobile view that particular container should not grow & also when mobile view is not there,ie breakpoint just make 'flex-grow-0' and in mobile view 'flex-grow' kicks in */}
			<div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
				<div className="mt-2 flex items-center flex-grow sm:flex-grow-0 ">
					<Image
						onClick={() => router.push("/")}
						src="https://links.papareact.com/f90"
						width={150}
						height={40}
						objectFit="contain"
						className="cursor-pointer"
					/>
				</div>
				{/* Here 'sm:flex' means whenever display is other than sm than use flex else hide the input */}
				<div className="hidden sm:flex items-center h-10 rounded-md bg-yellow-400 flex-shrink flex-grow hover:bg-yellow-500">
					<input
						className="p-2 h-full w-6 flex-grow rounded-l-md px-4"
						type="text"
					/>
					<SearchIcon className="h-12 p-4" />
				</div>
				{/* Right-side of nav */}
				<div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
					<div onClick={!session ? signIn : signOut} className="link">
						<p>{session ? `Hello, ${session.user.name}` : "Sign-In"}</p>
						<p className="font-extrabold md:text-sm">Accounts & List</p>
					</div>
					<div onClick={() => router.push("/orders")} className="link">
						<p>Returns</p>
						<p className="font-extrabold md:text-sm">& Orders</p>
					</div>
					<div
						onClick={() => router.push("/checkout")}
						className="relative link flex items-center"
					>
						<span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
							{items.length}
						</span>
						<ShoppingCartIcon className="h-10" />
						<p className="hidden md:inline font-extrabold md:text-sm mt-2">
							Basket
						</p>
					</div>
				</div>
			</div>
			{/* bottom nav */}
			<div className="flex space-x-3 p-2 pl-6 items-center bg-amazon_blue-light text-white text-sm">
				<p className="link flex items-center">
					<MenuIcon className="mr-1 h-6" />
					All
				</p>
				<p className="link">Prime Video</p>
				<p className="link">Amazon Business</p>
				<p className="link">Today's Deals</p>
				<p className="link hidden lg:inline-flex">Electronics</p>
				<p className="link hidden lg:inline-flex">Amazon Pantry & Fresh</p>
				<p className="link hidden lg:inline-flex">Shopper Toolkit</p>
				<p className="link hidden lg:inline-flex">Health & Personal Care</p>
			</div>
		</header>
	);
}

export default Header;
