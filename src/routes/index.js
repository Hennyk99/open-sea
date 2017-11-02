import { h } from 'preact';
import { map } from 'lodash';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Container from '../components/Container';
import Main from '../components/Main';
import Hero from '../components/Hero';
import Card, { CardTitle, CardContent } from '../components/Card';
import Grid from '../components/Grid';

const Home = (props, { mobxStores: { store } }) => (
		<Main>
		<Hero />
		<Container>
		<p>Your organisations</p>
		<Grid gutter={25}>
			{ map(toJS(store.organisations), (org, id) => (
				<Card to={`/${id}`}>
					<CardTitle
						primary={org.name}
						secondary={org._role}
					/>
				</Card>
			)) }
		</Grid>
		</Container>
	</Main>
);

export default observer(Home);