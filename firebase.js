import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyABfUgNSGnJTa1QDKcTZQD8l1whvJi0xO0",
	authDomain: "clone-eb28e.firebaseapp.com",
	projectId: "clone-eb28e",
	storageBucket: "clone-eb28e.appspot.com",
	messagingSenderId: "1077066872984",
	appId: "1:1077066872984:web:3fc8879edcb987574478ed",
};

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();

export default db;
