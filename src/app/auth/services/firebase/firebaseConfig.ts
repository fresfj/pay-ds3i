type FirebaseConfig = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  appId: string
  messagingSenderId: string
  measurementId: string
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_APP_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
}

export default firebaseConfig
