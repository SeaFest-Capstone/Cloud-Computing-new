const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
const firebase = require('./private/firebase.json');

const firebaseConfig = firebase;

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const UserCollection = "users";
const FishCollection = "fish";
const CartCollection = "cart";
const HistoryCollection = "history";
const CheckoutCollection="checkout";

module.exports = {
  auth,
  firestore,
  UserCollection,
  firebaseApp,
  FishCollection,
  CartCollection,
  HistoryCollection,
  CheckoutCollection,
  storage
};
