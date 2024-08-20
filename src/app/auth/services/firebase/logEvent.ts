import firebase from 'firebase/compat/app'
import 'firebase/compat/analytics'
import firebaseConfig from './firebaseConfig'

// Ensure Firebase is initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const analytics = firebase.analytics()

const logEvent = (event, params) => {
  analytics.logEvent(event, params)
}

export default logEvent
