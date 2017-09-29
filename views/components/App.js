import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import axios from 'axios';
import lodash from 'lodash';
import ReactBootstrap, { Panel, Tooltip } from 'react-bootstrap';

import '../styles/app.scss';
		
var margin = { top: 15, right: 120, bottom: 45, left: 50 };
//Global Var ^^
class App extends React.Component {
	constructor() {
		super();
		this.state = {
		width: 0,
		height: 450,
		showChart: false,		
		cache: undefined,
		tooltipShow: false,
		tooltipHTML: '',
		tooltipX: 0,
		tooltipY: 0
		};
	}
	componentDidMount() {	
window.addEventListener('resize', this.componentDidMount.bind(this));		
		this.setState({
			width: d3.select("#chart").property('clientWidth'),
			showChart: true
		});
	}	
	componentDidUpdate(prevProps, prevState) {
		if(this.state.showChart === false	||
			 this.state.width === prevState.width) return; // width didn't change		
		d3.select('#chart svg').remove();
		d3.select('#chart').append('svg')
			.attr('width', this.state.width)
			.attr('height', this.state.height + margin.top + margin.bottom)

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
		let that = this;		
		let {width,height} = {
			width: this.state.width - margin.left - margin.right,
			height: this.state.height - margin.top - margin.bottom
		};
		let {xMin, xMax} = {
			xMin: d3.min(data, d=>d.Seconds),
			xMax: d3.max(data, d=>d.Seconds) + 10
		};
		let {yMin,yMax} = {
			yMin: d3.min(data, d=>d.Place),
			yMax: d3.max(data, d=>d.Place) + 2
		};
		// Settings ^
		let xScale = d3.scaleLinear()
				.domain([ 2400, 2210 ])
				.range([0, width]);
				/*console.log('xMax:', xMax)
				console.log(xMax/60)
				console.log('xMin:', xMin)*/
		let yScale = d3.scaleLinear()
				.domain([ yMax, yMin])
				.range([height, 0]);
		// Scales ^
let zeroFill = d3.format('0>2');
		let xAxis = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)
			.append('g')
				.attr('transform',`translate(0,${height})`)
				.call(
					d3.axisBottom(xScale)
					.tickValues(d3.range(xMin, xMax, width<300 ? 30 : width<600? 20 : 10))
				 	.tickFormat(tick=>{
				 	 // console.log(tick)
				 	let time = new Date(2000,1,1,0,0, tick );
				 	//console.log(time)
				 	// console.log(`${zeroFill(time.getMinutes())}:${zeroFill(time.getSeconds())}`)
				 	return `${zeroFill(time.getMinutes())}:${zeroFill(time.getSeconds())}`;
				 })					
					)
		let yAxis = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)
			.append('g')
			.call(
				d3.axisLeft(yScale)
				.ticks(10)
			);
		let xAxisText = d3.select('svg')
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('x', Math.ceil((margin.left + width)/2))
				.attr('y', this.state.height - 10)
				.text('Time (minutes)')
		let yAxisText = d3.select('svg')
			.append('g')
				.attr('transform', `translate(20,${Math.ceil((margin.top+height)/2)})`)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.text('Ranking')
		let titleText = d3.select('svg')				
			.append('text')
				.attr("x", (width / 2))
			    .attr("y", -margin.top/2 + 35)
			    .attr("text-anchor", "middle")
			    .attr("class", "subtitle")
			    .text("35 Fastest times up Alpe d'Huez");
// let svg = d3.select('#chart svg');				
		// Axes	^	
		let redDotLegend = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${width+margin.left},${Math.ceil((margin.top+height)/2)+15})`)
			.append('circle')
				.attr('cx',-50).attr('cy',-5).attr('r',6).attr('fill','#cd181e')
			d3.select('svg')//text
			.append('g')
			.attr('transform', `translate(${width+margin.left},${Math.ceil((margin.top+height)/2)+15})`)
			.append('text')
				.attr('x', -40).text('Doping Allegations');
		let blueDotLegend = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${width+margin.left},${Math.ceil((margin.top+height)/2)+15})`)
			.append('circle')
				.attr('cx',-50).attr('cy',15).attr('r',6).attr('fill','#0961aa')
			d3.select('svg')
			.append('g')
			.attr('transform', `translate(${width+margin.left},${Math.ceil((margin.top+height)/2)+15})`)
			.append('text')
				.attr('x', -40)
				.attr('y', 20)
				.text('No Doping Allegations');				
		//Info
		let circles = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)
			.selectAll('g').data(data).enter()
			.append('circle')
				.style('fill'  , d=>d.Doping===''? '#0961aa' : '#cd181e')
				.attr('stroke' , d=>d.Doping===''? '#0961aa' : '#cd181e')
				.attr('stroke-width', 2)
				.attr('cx', d=>xScale(d.Seconds))
				.attr('cy', d=>yScale(d.Place))
				.attr('r', 5)
				.on('mouseover', function(d) {
					d3.select(this)
						.attr('stroke', d3.color(d3.select(this).style('fill')).darker(3));
		that.setState({
			tooltipShow: true,
			tooltipX   : d3.event.clientX,
			tooltipY   : d3.event.clientY + 15,
			tooltipHTML: (
				<div>
					<strong>{d.Name}</strong>, {d.Nationality}<br/>
					<strong>Year:</strong> {d.Year}<br/>
					<strong>Time:</strong> {d.Time}<br/>{d.Doping===''? '' : <br/>}
					<strong>{d.Doping}</strong>
				</div>
					)
		});						
				})
				.on('mouseout', function() {
					d3.select(this).attr('stroke', d3.select(this).style('fill'));
					that.setState({ tooltipShow: false });
				})			
		//toolTip
		 // console.log(document)
	}		
	render() {
		console.log(this.state)
		return(			
			<Panel header={<h3>Doping in Professional Bicycle Racing</h3>}>			
				<Tooltip id='tooltip' placement='top' className='in'
					style={{
						display	: this.state.tooltipShow ? 'block' : 'none',
						position: 'fixed',
						left: this.state.tooltipX,
						top	: this.state.tooltipY,
						width: 190
					}}
				>{this.state.tooltipHTML}</Tooltip>			
				<div id="chart" style={{width: '100%'}} />			
			</Panel>
		);
	}
}

export default App;
