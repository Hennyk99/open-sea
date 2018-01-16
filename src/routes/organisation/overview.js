import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import Table from 'components/Table';

const PageHeader = ({ orgId, organisation }) => (
	<Header>
		<Breadcrumbs>
			<Link to={`/${orgId}`}>{ organisation.name }</Link>
		</Breadcrumbs>
		<h1>Overview</h1>
	</Header>
);

const OrganisationOverview = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const reports = ReportsStore.getItems({ _orgId: orgId });

	if (reports.length === 0) return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>No reports exist for this organisation! To get started, create a report first.</p>
					<p><Button to={`/create/report?organisation=${orgId}`}>Create a report</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container flex>
				<Placeholder />
				<section style={{ flex: '0 0 375px' }}>
					<h1>Reports</h1>
					<Table
						disableSorting
						defaultSort="-updated"
						data={reports}
						limit={4}
						columns={[
							{
								key: 'name',
								label: 'Organisation',
								value: ({ name }) => name,
								format: (value, { _id, name }) => <Link to={ `/${_id}` }>{ name }</Link>
							},
							{
								key: 'updated',
								label: 'Last updated',
								value: ({ created, updated }) => updated || created,
								format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow(),
								hidden: true
							},
							{
								key: 'Status',
								label: 'Status'
							}
						]}
					/>
					<p>
						<span>Recently updated</span>&nbsp;·&nbsp;<Link to={`/${orgId}/reports`}>View all reports</Link>
					</p>
				</section>
			</Container>
		</Fragment>
	);
}));

export default OrganisationOverview;