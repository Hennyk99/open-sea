import { inject, observer } from 'mobx-react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Account from 'routes/account';
import Create from 'routes/create';
import CreateDrawer from 'components/CreateDrawer';
import Dashboard from 'routes/dashboard';
import Helmet from 'react-helmet';
import Login from 'routes/account/login';
import Logout from 'routes/account/logout';
import MainNavigation from 'components/MainNavigation';
import Organisation from 'routes/organisation';
import Overview from 'routes/dashboard/overview';
import PrivateRoute from 'components/PrivateRoute';
import React from 'react';
import SearchDrawer from 'components/SearchDrawer';
import Signup from 'routes/account/signup';
import Snackbar from 'components/Snackbar';

const Main = inject('AuthStore', 'MVCStore', 'OrganisationsStore', 'ReportsStore')(observer(({ AuthStore, MVCStore, OrganisationsStore, ReportsStore }) => (
	<React.Fragment>
		<Helmet defaultTitle="openSEA" titleTemplate="%s — openSEA" />

		<MainNavigation curPath={window.location.pathname} />
		
		{ OrganisationsStore.loading || ReportsStore.loading ? (
			<Switch>
				{ !AuthStore.authed && <Redirect from="/" exact to="/product" replace /> }
				<Route path="/account/signin" component={Login} />
				<Route path="/account/signup" component={Signup} />
				<Route path="/account/logout" component={Logout} />
			</Switch>
		) : (
			<Switch>
				{ !AuthStore.authed && <Redirect from="/" exact to="/product" replace /> }
				<Route path="/account/signin" component={Login} />
				<Route path="/account/signup" component={Signup} />
				<Route path="/account/logout" component={Logout} />
				<PrivateRoute path="/" exact component={Overview} />
				<PrivateRoute path="/account" component={Account} />
				<PrivateRoute path="/create" component={Create} />
				<PrivateRoute path="/dashboard" component={Dashboard} />
				<PrivateRoute path="/search" />
				<Route path="/:org" component={Organisation} />
			</Switch>
		) }

		<SearchDrawer />
		<CreateDrawer />
		<Snackbar />
	</React.Fragment>
)));

export default Main;