import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import axios from 'axios';
import lodash from 'lodash';
import ReactBootstrap, { Panel, Tooltip } from 'react-bootstrap';

import '../styles/app.scss';
		
//var margin = {top: 20, right: 10, bottom: 20, left: 10};
//var margin = { top: 15, right: 120, bottom: 45, left: 50 };
//Global Var ^^
class App extends React.Component {
	constructor() {
		super();
		this.state = {
		width: 0,
		height: 450,
		showChart: false,		
		cache: undefined
		};
	}
	componentDidMount() {	
		this.setState({
			width: d3.select("#chart").property('clientWidth'),
			showChart: true
		});
	}	
	componentDidUpdate(prevProps, prevState) {
		d3.select('#chart').append('svg')
			.attr('width', this.state.width)
			.attr('height', this.state.height)

		 if(typeof this.state.cache === 'undefined') {
		 	d3.json(this.props.dataURL, data => {
		 		this.setState({ cache: data });
		 		this.buildChart( data );
		 	});
		 } else {
		 	this.buildChart( this.state.cache );
		 }
	}// end-componentDidUpdate	
	buildChart(data) {
		// let margin = {top: 20, right: 10, bottom: 20, left: 10};
		let margin = { top: 15, right: 120, bottom: 45, left: 50 };
		let {width,height} = {
			width: this.state.width - margin.left - margin.right,
			height: this.state.height - margin.top - margin.bottom
		};
		let svg = d3.select('#chart svg');
		let frm = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
		let {xMin, xMax} = {
			xMin: d3.min(data, d=>d.Seconds),
			xMax: d3.max(data, d=>d.Seconds) + 10
		};
		let {yMin,yMax} = {
			yMin: d3.min(data, d=>d.Place),
			yMax: d3.max(data, d=>d.Place) + 2
		};
		let xScale = d3.scaleLinear()
				.domain([ xMax, xMin ])
				.range([0, width]);
		let yScale = d3.scaleLinear()
				.domain([ yMax, yMin])
				.range([height, 0]);
		let dataGraph = frm.append('g')
				.selectAll('g')
				.data(data).enter().append('g');
		let circles = dataGraph.append('circle')
			.style('fill'  , d=>d.Doping===''? '#2196F3' : '#e51c23')
			.attr('stroke' , d=>d.Doping===''? '#2196F3' : '#e51c23')
			.attr('stroke-width', 2)
			.attr('cx', d=>xScale(d.Seconds))
			.attr('cy', d=>yScale(d.Place))
			.attr('r', 5)
		console.log(document)
	}		
	render() {
		// console.log(this)
		return(			
				<div id="chart" style={{width: '100%'}} />			
		);
	}
}

export default App;
