import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/analytics';

import firebaseConfig from './firebaseConfig';

/**
 * Initialize Firebase
 */
export const firebaseApp = firebase.initializeApp(firebaseConfig);

/**
 * Firebase App initialization check
 */
let initialized = false;

try {
	firebase?.auth();
	initialized = true;
} catch (e) {
	// eslint-disable-next-line no-console
	console.error(e);
}

export const firebaseInitialized = initialized;
