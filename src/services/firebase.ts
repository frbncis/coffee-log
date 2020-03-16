import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import store from '@/store';

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

beansCollection.onSnapshot((beansRef) => {
  const beans: any = {};

  beansRef.forEach((doc) => {
    const bean: any = doc.data();
    bean.id = doc.id;

    beans[bean.id] = bean;
  });

  store.dispatch('fetchBeans', beans);
});

brewsCollection.onSnapshot((brewsRef) => {
  const brews: any = {};

  brewsRef.forEach((doc) => {
    const brew: any = doc.data();
    brew.id = doc.id;

    brews[brew.id] = brew;
  });

  store.dispatch('fetchBrews', brews);
});

export {
  auth,
  db,
  storage,
  beansCollection,
  brewsCollection,
  usersCollection,
};
