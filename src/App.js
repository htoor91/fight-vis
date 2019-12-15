import React, { useState} from 'react';
import { BrowserRouter as Router, Route, Link, useHistory, Redirect } from 'react-router-dom';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { isAuthenticated } from './util';
import { LoginContainer, MainContainer } from './App.styled';
import { useFirebase } from './firebase';
import Visualzations from './view/Visualizations';
import './App.css';

const Main = ({ setAuth }) => {
  const firebase = useFirebase();
  const history = useHistory();

  const signOut = () => {
    localStorage.clear();
    setAuth(false);
    firebase.signOut().then(() => history.push('/'));
  }

  return (
    <MainContainer>
      <Visualzations signOut={signOut} />
    </MainContainer>
  )

}

const Login = ({ setAuth }) => {
  const [inputVal, setInputVal] = useState({ username: '', password: ''})
  const [error, setError] = useState(null);
  const firebase = useFirebase();
  const history = useHistory();

  const handleChange = (key) => (e, {value}) => setInputVal(prev => ({...prev, [key]: value }));

  const loginAction = () => {
    firebase.signIn(inputVal.username, inputVal.password)
    .then(authUser => {
      localStorage.setItem('uid', authUser.uid);
      setAuth(true);
      history.push('/main');
    })
    .catch(errorObj => setError(errorObj.message));
  };

  console.log('firebase', firebase);

  return (
    <div>
      <LoginContainer>
        <h3>Login</h3>
        <h5>{error}</h5>
        <Input type="text" value={inputVal.username} onChange={handleChange('username')} label="username" />
        <Input type="password" value={inputVal.password} onChange={handleChange('password')} label="password" />
        <Button primary onClick={loginAction} content="Go" />
      </LoginContainer>
    </div>
  )
}

function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  return (
    <Router>
      <div className="App">
        <CustomRoute exact path="/" conditionToView={!auth} redirect='/main'>
          <Login setAuth={setAuth}/>
        </CustomRoute>
        <CustomRoute exact path="/main" conditionToView={auth} redirect='/'>
          <Main setAuth={setAuth}/>
        </CustomRoute>
      </div>
    </Router>
    
  );
}

function CustomRoute({ children, conditionToView, redirect, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        conditionToView ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
