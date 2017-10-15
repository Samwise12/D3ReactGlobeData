import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import ReactBootstrap, { Panel, Tooltip, Navbar, Button, Grid, Row, Col } from 'react-bootstrap';

import App from './components/App'

ReactDOM.render(
<App 
		dataURL={{
			globeData: 'https://unpkg.com/world-atlas@1.1.4/world/110m.json',
			meteoriteData: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'			
		}}
	/>
	,document.getElementById('root')
);

