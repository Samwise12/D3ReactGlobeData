import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import ReactBootstrap, { Panel, Tooltip, Navbar, Button, Grid, Row, Col } from 'react-bootstrap';

import App from './components/App'
// import './styles/app.scss';
// ReactDOM.render(<App />,
// 	document.getElementById('root'));

// for(let rObj in ReactBootstrap)
// 	if(!window.hasOwnProperty(rObj) && rObj!=='__esModule')
// 		window[rObj]=ReactBootstrap[rObj];
// class DefaultNavbar extends React.Component {
// 	render() {
// 		return(
// 			<Navbar>
// 				<Navbar.Header>
// 					<Navbar.Brand>
// 						<a href="https://codepen.io/eddyw/" target="_blank">
// 							Data Visualisation Project
// 						</a>
// 					</Navbar.Brand>
// 					<Navbar.Toggle />
// 				</Navbar.Header>
// 				<Navbar.Collapse>
// 					<Navbar.Form pullRight>
// 						<Button target="_blank" href="https://www.freecodecamp.com/eddyw">
// 							FreeCodeCamp
// 						</Button>{' | '}
// 						<Button target="_blank" href="https://www.linkedin.com/in/ieddyw">
// 							Linkedin
// 						</Button>{' | '}
// 						<Button target="_blank" href="https://github.com/eddyw" disabled>
// 							Github
// 						</Button>
// 					</Navbar.Form>
// 				</Navbar.Collapse>
// 			</Navbar>
// 		);
// 	}
// }

ReactDOM.render(
<div>
{/*<DefaultNavbar />*/}
	<Grid>
		<Row>
						<Col xs={12}>
<App dataURL='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json' />
				</Col>
		</Row>
	</Grid>
</div>
	,document.getElementById('root')
);