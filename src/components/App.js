import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useTransition, animated } from 'react-spring';

import Loading from './Loading';
import useRouter from '../hooks/useRouter';
import Header from './Header';
import { StateProvider } from '../hooks/stateManager';
import '../styles/App.scss';

// lazy load routes
const Home = lazy(() => import(/* webpackChunkName: "Home" */'./Home'));
const SignIn = lazy(() => import(/* webpackChunkName: "SignIn" */'./SignIn'));
const SignUp = lazy(() => import(/* webpackChunkName: "SignUp" */'./SignUp'));
const CreateList = lazy(() => import(/* webpackChunkName: "CreateList" */'./CreateList'));
const ViewLists = lazy(() => import(/* webpackChunkName: "ViewLists" */'./ViewLists'));
const Donate = lazy(() => import(/* webpackChunkName: "Donate" */'./Donate'));
const EditList = lazy(() => import(/* webpackChunkName: "EditList" */'./EditList'));
const SharedList = lazy(() => import(/* webpackChunkName: "SharedList" */'./SharedList'));
const List = lazy(() => import(/* webpackChunkName: "List" */'./List'));
const ListCopy = lazy(() => import(/* webpackChunkName: "ListCopy" */'./ListCopy'));
const NoMatch = lazy(() => import(/* webpackChunkName: "NoMatch" */'./NoMatch'));

// If servive workers are supported, register ours.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(function () { console.log('Service Worker Registered'); }); // eslint-disable-line no-console
}

const App = () => {
  // initialize state
  const initialState = {
  };
  // create reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case 'updateName':
        return {
          ...state,
          name: action.name
        };

      default:
        return state;
    }
  };
  // Store location history
  const { location } = useRouter();

  // Create route page animations
  const transitions = useTransition(location, location => location.pathname, {
    from: { transform: 'translate3d(-100%, 0, 0)' },
    enter: { transform: 'translate3d(0, 0, 0)' },
    leave: { transform: 'translate3d(0, 0, 0)' },
    config: { mass: 1, tension: 280, friction: 40, clamp: true }
  });
  // return JSX
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <div>
        <Header />
        {transitions.map(({ item, props, key }) => (
          <animated.div
            key={key}
            style={{ ...props, display: 'flex', justifyContent: 'center' }}>
            <Suspense fallback={<Loading />}>
              <Switch location={item}>
                <Route exact path="/" component={Home} />
                <Route path='/signin' component={SignIn} />
                <Route path='/signup' component={SignUp} />
                <Route path="/lists/create" component={CreateList} />
                <Route exact path="/lists" component={ViewLists} />
                <Route path="/donate" component={Donate} />
                <Route path="/lists/:name/edit" component={EditList} />
                <Route path="/lists/:name/shared" component={SharedList} />
                <Route path="/lists/:name/copy" component={ListCopy} />
                <Route path="/lists/:name" component={List} />
                {/* when none of the above match, <NoMatch> will be rendered */}
                <Route component={NoMatch} />
              </Switch>
            </Suspense>
          </animated.div>
        ))}
      </div>
    </StateProvider>
  );
};

export default App;