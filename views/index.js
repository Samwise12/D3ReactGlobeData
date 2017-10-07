import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import ReactBootstrap, { Panel, Tooltip, Navbar, Button, Grid, Row, Col } from 'react-bootstrap';

import App from './components/App'

ReactDOM.render(
<div>
{/*<DefaultNavbar />*/}
	<Grid>
		<Row>
						<Col xs={12}>
<App dataURL='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json' />
				</Col>
		</Row>
	</Grid>
</div>
	,document.getElementById('root')
);