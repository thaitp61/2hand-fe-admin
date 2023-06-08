import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { LoginForm } from './sections/auth/login';



// ----------------------------------------------------------------------

// Configure Firebase.
const config = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ...
  apiKey: "AIzaSyDe449JzWahE4uOHXbeFgz2BBpOMjRNtBc",
  authDomain: "uni2hand-d25da.firebaseapp.com",
  projectId: "uni2hand-d25da",
  storageBucket: "uni2hand-d25da.appspot.com",
  messagingSenderId: "68827145137",
  appId: "1:68827145137:web:5105295c7438fb720dd390",
  measurementId: "G-LGCYLHGW3H"
};
firebase.initializeApp(config);

const app = initializeApp(config);
const analytics = getAnalytics(app);

export default function App() {


  // handel firebase auth changed
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        console.log('user is not logged in');
        return;
      }
      console.log('Logged in user:', user.displayName);
      const token = await user.getIdToken();
      console.log('Token:', token);


    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
