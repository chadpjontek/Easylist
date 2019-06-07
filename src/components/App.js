import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from './SignIn';
import Home from './Home';
import CreateList from './CreateList';
import ViewLists from './ViewLists';
import Donate from './Donate';
import EditList from './EditList';
import NoMatch from './NoMatch';
import '../styles/App.scss';

const App = () => {

  return (
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
  );
};

export default App;