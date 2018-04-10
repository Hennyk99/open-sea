import React from 'react';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { injectGlobal, ThemeProvider } from 'styled-components';
import { global, theme } from './mixins/index';
import Routes from './routes/index';
import ProductRoutes from './routes/product/index';

export const App = () => (
	<ThemeProvider {...theme}>
		<Router>
			<React.Fragment>
				<Helmet
					titleTemplate="%s — openSEA"
					defaultTitle="openSEA"
				/>
				<Switch>
					<Route path="/product" component={ProductRoutes} />
					<Route path="*" component={Routes} />
				</Switch>
			</React.Fragment>
		</Router>
	</ThemeProvider>
);

injectGlobal`${global}`;

export default hot(module)(App);