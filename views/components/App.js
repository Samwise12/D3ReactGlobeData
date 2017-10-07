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
		degree: undefined,
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
			 this.state.width === prevState.width) return; 
		d3.select('#chart svg').remove();
		d3.select('#chart').append('svg')
			.attr('width', this.state.width)
			.attr('height', this.state.height + margin.top + margin.bottom+50)

		 if(typeof this.state.cache === 'undefined') {
		 	d3.json(this.props.dataURL, data => {
		 		 // console.log(data)
	// data.map()		 		 
		 		this.setState({ cache: data });
		 		this.buildChart( data );
		 	});
		 } else {
		 	this.buildChart( this.state.cache );
		 }
	}// end-componentDidUpdate	
	buildChart(data) {
		let months = ['January','February','March','April','May','June','July',
						'August','September','October','November','December'];
		let {width,height} = {
			width: this.state.width - margin.left - margin.right,
			height: this.state.height - margin.top - margin.bottom
		};
		let {xMin, xMax} = {
			xMin: d3.min(data.monthlyVariance, d=>d.year),
			xMax: d3.max(data.monthlyVariance, d=>d.year)
		};
		let {yMin,yMax} = {
			yMin: d3.min(data.monthlyVariance, d=>d.variance),
			yMax: d3.max(data.monthlyVariance, d=>d.variance)
		};
		// let colorScale = d3.scaleLinear()
		// 	.domain([yMin, d3.median([yMin,yMax]), yMax])
		// 	.range(['#325D88','#fcf8e3','#d9534f']);		
    	const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4",
                "#e6f598", "#ffffbf", "#fee08b", "#fdae61",
                "#f46d43", "#d53e4f", "#9e0142"];		                
var colorScale = d3.scaleQuantize()
    .domain([yMin + data.baseTemperature, yMax + data.baseTemperature])
    .range(colors);
// var colors2 = d3.scaleQuantile()

		// Settings ^
		let xScale = d3.scaleBand()
				.domain(d3.range(xMin, xMax))
				.range([0, width]);
				/*console.log('xMax:', xMax)
				console.log('xMin:', xMin)*/
		let yScale = d3.scaleBand()
				.domain(d3.range(1, 13))
				.range([0, height]);
		// Scales ^
		let xAxis = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top+60})`)
			.append('g')
				.attr('transform',`translate(0,${height})`)
				.call(
					d3.axisBottom(xScale)
					.tickValues(d3.range(xMin, xMax,  21 ))				 	
					)
				// console.log(width)
		let yAxis = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top+60})`)
			.append('g')
			.call(
				d3.axisLeft(yScale)				
				.tickFormat(t=>months[t-1]).tickSize(0)
			);
		let xAxisText = d3.select('svg')
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('x', Math.ceil((margin.left + width)/2))
				.attr('y', this.state.height + 50)
				.text('Years')
		let yAxisText = d3.select('svg')
			.append('g')
				.attr('transform', `translate(20,${Math.ceil((margin.top+height)/2+40)})`)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90)')
				.text('Months')
		let titleText = d3.select('svg')				
			.append('text')
				.attr("x", (width / 2))
			    .attr("y", -margin.top/2 + 20)
			    .attr("text-anchor", "middle")
			    .attr("class", "subtitle")
			    .text("Monthly Global Land-Surface Temperature");
			d3.select('svg')				
			.append('text')
				.attr("x", (width / 2))
			    .attr("y", -margin.top/2 + 40)
			    .attr("text-anchor", "middle")
			    .attr("class", "subtitle")
			    .text("1753-2016");
			d3.select('svg')				
			.append('text')
				.attr("x", (width / 2) + 80)
			    .attr("y", -margin.top/2 + 60)
			    .attr("text-anchor", "middle")
			    .attr("class", "subtitle")
			    .text("Temperature are in Celsius and reported as anomalies relative "
			    	+"to the Jan 1951 - Dec 1980 average.");
			d3.select('svg')				
			.append('text')
				.attr("x", (width / 2))
			    .attr("y", -margin.top/2 + 80)
			    .attr("text-anchor", "middle")
			    .attr("class", "subtitle")
			    .text("Estimated Jan 1951 - Dec 1980 absolute temperature °C 8.66 +/- 0.07");			    
// let svg = d3.select('#chart svg');				
		// Axes	^	
    let legend = d3.select('svg')
  		.append('g')
  			.attr('transform', `translate(${margin.left+300},${margin.top+65})`)
  		.selectAll('.legend')
  		.data(colors).enter()
  		.append('rect')
  		.attr('x', function (d,i) {
		var ancho = width / 25;
        	return (ancho * i) + (width / 4);
  		})
  		.attr('y', height + 40)
  		.attr('width', width/25)
  		.attr('height', 10)
  		.style('fill', function(d, i) {
  			return colors[i];
  		});
	let legendText = d3.select('svg')
      // .attr('class', '.label')
      // .style('background', '#fafafa')
      .append('g')
      .attr('transform', `translate(${margin.left+305},${margin.top+65})`)
      .selectAll('.legend')
      	.data(colors).enter()
      	.append('text')
      	.attr('class', 'label')
      	.attr('x', function (d, i) {
        var ancho = width / 25;
        return (ancho * i) + (width / 4);
      })
      	.attr('y', height + 65)
      	.text(function (d) {
        var r = colorScale.invertExtent(d);
        // console.log(Math.floor(r[0] * 10) / 10)
        if(r[0].toFixed(1) == 1.7){
        	return 0;
        }
        return (r[0].toFixed(1));
      });      	  		
    let legendTitle = d3.select('svg').append('g') 
	.attr('transform', `translate(${margin.left+620},${margin.top+456})`)
      .append('text')
	      .attr('class', 'legendTitle')
	      .attr('x', 30)
	      .attr('y', 30)
	      .text('Color Scale (ºC)');  		
		//Legend^^
	function getColor (d) {
      var temp = (d.variance + data.baseTemperature).toFixed(3);
      return colorScale(temp);
    }		
		let bars = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top+60})`)
			.selectAll('g').data(data.monthlyVariance).enter()
			.append('rect')
				// .style('fill', d=>colorScale(d.variance))
				.attr('x', d=>xScale(d.year))
				.attr('y',d=>yScale(d.month))
				.attr('width', xScale.bandwidth)
				.attr('height', yScale.bandwidth)    
				.attr("fill", d=>getColor(d))				
			.on('mouseover', d=> {
				this.setState({
					tooltipShow: true,
					tooltipX: d3.event.clientX +13,
					tooltipY: d3.event.clientY -35,
					tooltipHTML: (
						<span>
							Year <strong>{d.year} ─ {months[d.month-1]}</strong><br/>
							<strong>{(data.baseTemperature + d.variance).toFixed(3)}</strong> °C<br/>
							<small>{d.variance} °C</small>
						</span>
					)					
				});				
			})
			.on('mouseout', d=>this.setState({ tooltipShow: false }))			
		//toolTip
		 console.log(document)
	}		
	render() {
		// console.log(this.state.width)
		return(			
			<Panel header={<h1>FreeCodeCamp Heat Map</h1>}>			
				<Tooltip id='tooltip' placement='left' className='in'
					style={{
						display	: this.state.tooltipShow ? 'block' : 'none',
						position: 'fixed',
						left: this.state.tooltipX,
						top	: this.state.tooltipY,
						width: 190
					}}
				>{this.state.tooltipHTML}</Tooltip>			
				<div id="chart" className='panel panel-default' />			
			</Panel>
		);
	}
}

export default App;
