import firebase from 'firebase';
import { config } from './config';

class Firebase {
  constructor() {
    firebase.initializeApp(config);

    this.auth = firebase.auth();
  }

  signIn = (username, password) => this.auth.signInWithEmailAndPassword(username + '@toor-capstone.com', password);

  signOut = () => this.auth.signOut();
    
}
export default Firebase;