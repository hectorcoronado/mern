import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// components
import AddEducation from './components/profile-forms/AddEducation'
import AddExperience from './components/profile-forms/AddExperience'
import Alert from './components/layout/Alert'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import Dashboard from './components/dashboard/Dashboard'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Navbar from './components/layout/Navbar'
import Register from './components/auth/Register'

// higher-order-component
import PrivateRoute from './components/routing/PrivateRoute'


// actions
import { loadUser } from './actions/auth'

// utils
import setAuthToken from './utils/setAuthToken'

// styles
import './App.css'

// redux
import { Provider } from 'react-redux'
import store from './store'

// on initial load, if there's a user, set their token 
// as header for every axios request
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  // set 2nd arg to `[]`, making it roughly eq to `componentDidMount`
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <PrivateRoute exact path='/add-education' component={AddEducation} />
              <PrivateRoute exact path='/add-experience' component={AddExperience} />
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;