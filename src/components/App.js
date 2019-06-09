import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loading from './Loading';

import '../styles/App.scss';
import 'react-toastify/dist/ReactToastify.min.css';

// lazy load routes
const Home = lazy(() => import(/* webpackChunkName: "Home" */'./Home'));
const SignIn = lazy(() => import(/* webpackChunkName: "SignIn" */'./SignIn'));
const CreateList = lazy(() => import(/* webpackChunkName: "CreateList" */'./CreateList'));
const ViewLists = lazy(() => import(/* webpackChunkName: "ViewLists" */'./ViewLists'));
const Donate = lazy(() => import(/* webpackChunkName: "Donate" */'./Donate'));
const EditList = lazy(() => import(/* webpackChunkName: "EditList" */'./EditList'));
const NoMatch = lazy(() => import(/* webpackChunkName: "NoMatch" */'./NoMatch'));


const App = () => {

  return (
    <Suspense fallback={Loading}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path='/signin' component={SignIn} />
        <Route exact path="/lists/create" component={CreateList} />
        <Route exact path="/lists" component={ViewLists} />
        <Route path="/donate" component={Donate} />
        <Route path="/lists/:name/edit" component={EditList} />
        {/* when none of the above match, <NoMatch> will be rendered */}
        <Route component={NoMatch} />
      </Switch>
      <ToastContainer />
    </Suspense>
  );
};

export default App;