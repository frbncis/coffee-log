import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyAmf5D6ea6FAUlWNGnfNXPqNkjOjGrwxQw',
  authDomain: 'coffee-log-9bcc7.firebaseapp.com',
  databaseURL: 'https://coffee-log-9bcc7.firebaseio.com',
  projectId: 'coffee-log-9bcc7',
  storageBucket: 'coffee-log-9bcc7.appspot.com',
  messagingSenderId: '835115919827',
  appId: '1:835115919827:web:8ea185bd6d0888b004e726',
  measurementId: 'G-4N9Z49K12Y',
};

firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const beansCollection = db.collection('beans');
const brewsCollection = db.collection('brews');
const usersCollection = db.collection('users');

export {
  auth,
  db,
  storage,
  beansCollection,
  brewsCollection,
  usersCollection,
};
