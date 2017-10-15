import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import axios from 'axios';
import lodash from 'lodash';
import ReactBootstrap, { Panel, Tooltip, Navbar, Button, Grid, Row, Col } from 'react-bootstrap';

import '../styles/app.scss';
		
class App extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			width: 550,
			height: 500,
			globeData: undefined,
			meteoriteData: undefined,
			tooltipShow: false,
			tooltipHTML: '',
			tooltipX: 0,
			tooltipY: 0,
			update: true
		};
	}
	componentDidMount() {
		d3.select('#svg-globe')
			.append('svg')
			.attr('width' , this.state.width+270)
			.attr('height', this.state.height+30)
		d3.json(this.props.dataURL.globeData,  data=>this.setState({ globeData: data }));
		d3.json(this.props.dataURL.meteoriteData, data=>this.setState({ meteoriteData: data }));
	}
	componentDidUpdate(prevProps, prevState) {
		if(typeof this.state.globeData  === 'undefined' ||
		   typeof this.state.meteoriteData === 'undefined' || 
		   this.state.update === false) return;
		let width = this.state.width, height = this.state.height,
		 proj  = d3.geoOrthographic().translate([0,0]).scale((height/2)-8),
		 dots = d3.geoOrthographic().translate([0,0]).scale((height/2)+8 ),
		 path  = d3.geoPath().projection(proj),
		 countries = topojson.feature(this.state.globeData, this.state.globeData.objects.countries).features,
		 meteorites = this.state.meteoriteData.features;		

   let min = d3.min(meteorites, d=>parseInt(d.properties.mass));
   let max = d3.max(meteorites, d=>parseInt(d.properties.mass));
    let circleScale = d3.scaleLinear()
     .clamp([true])
     .domain([min, max / 200])
     .range([1,6]);		     

    function circle(r, properties) {
      let points = [];
      for(let angle=0; angle<=2*Math.PI; angle=angle+0.1) {
        let x = r*Math.cos(angle);
        let y = r*Math.sin(angle);
        points.push(dots([properties.reclong-x, properties.reclat-y]));
      }
      return points.join(',');
    }    

		let water = d3.select('svg')
			.append('g')
				.attr('transform', `translate(${width/2+250},${height/2})`)
			.append('circle')
				.style('fill', '#00004d')
				.attr('cx', 0)		
				.attr('cy', 0)
				.attr('r', (height/2)-8)				
		let land = d3.select('svg')
			 .append('g')
			 	.attr('transform', `translate(${width/2+250},${height/2})`)
			 .selectAll('path')
			 .data(countries).enter().insert('path')
			 	.style('fill', '#20a9df')
        		.attr('stroke', 'black')
        		.attr('stroke-width', '0.5')
        		.attr('d', path);		
        let polygon = d3.select('svg')
        	 .append('g')
        	 	.attr('transform', `translate(${width/2+250},${height/2})`)
        	 .selectAll('polygon').data(meteorites)
        	 .enter().insert('polygon')
        	 	.style('fill' ,(_,index)=> {
        	 		let color = d3.color(d3.schemeCategory20c[index % 20]);
        	 		color.opacity = 0.5;
        	 		return color;
        	 	})
        	 	.attr('points', d=> circle(0.1, d.properties))
        	 	.style('display', d=> path(d) === undefined ? 'none': 'block' )
        	 	.attr('stroke', (_,index)=>d3.schemeCategory20[index % 20])
        	 	.attr('stroke-width', 1) 
		let svg = d3.select('#svg-globe svg');
		let that = this;
	polygon.on('mouseover', function(d) {
//console.log(Object.keys(svg))
        if(svg.hasOwnProperty('movement')) return;
		that.setState({
					tooltipShow: true,
					tooltipX: d3.event.clientX - 200,
					tooltipY: d3.event.clientY - 40,
					tooltipHTML: (
						<span>
							<strong>Name:</strong>{d.properties.name}<br/>
							<strong>Year:</strong>{(new Date(d.properties.year)).getFullYear()}<br/>
							<strong>Class.:</strong>{d.properties.recclass}<br/>
							<strong>Mass:</strong>{d.properties.mass}g
						</span>
					)
				});
      })
      .on('mouseout', d=>this.setState({ tooltipShow: false }));
	polygon
      .transition()
      	.attr('points', d=>circle(circleScale(parseInt(d.properties.mass || 0)), d.properties))
      .duration((_,index)=>{
      	return 12*index;
      })
      .ease(d3.easeBounce)

		svg.on('mousedown', ()=>{
			if(!svg.hasOwnProperty('rotation'))
				svg.rotation = {
					x: 0,
					y: 0
				};
			// console.log(Object.keys(svg))
			svg.movement = true;
			svg.mX = d3.event.clientX;
			svg.mY = d3.event.clientY;
			 // console.log('2: ',Object.keys(svg))
		})	
		d3.select(window).on('mousemove', ()=>{
			if(!svg.hasOwnProperty('movement')) return;
			let x = svg.mX - d3.event.clientX; 
			let y = svg.mY - d3.event.clientY;
			svg.mX = d3.event.clientX;
			svg.mY = d3.event.clientY;			
			if(x<0) svg.rotation.x = svg.rotation.x + 6;
			if(x>0) svg.rotation.x = svg.rotation.x - 6;
			if(y<0) svg.rotation.y = svg.rotation.y - 6;
			if(y>0) svg.rotation.y = svg.rotation.y + 6;
			if(svg.rotation.x < 0) svg.rotation.x * -1;
			if(svg.rotation.y < 0) svg.rotation.y * -1;
			svg.rotation = {
				x: svg.rotation.x % 360,
				y: svg.rotation.y % 360
			}
			// console.log(svg.rotation)
			proj.rotate([svg.rotation.x,svg.rotation.y,0]);
			dots.rotate([svg.rotation.x,svg.rotation.y,0]);
			land.attr('d', path); // update graphic
			polygon
				.interrupt()
				.style('display', d=>path(d)===undefined? 'none' : 'block')
				.attr('points', d=>circle(circleScale(parseInt(d.properties.mass || 0)), d.properties))
		}).on('mouseup', ()=> { delete(svg.movement); });		

		this.setState({ update: false });
		// console.log(document);
	}//end componentDidUpdate
	render() {
		return(
			<Grid>
							<Tooltip id='tooltip' className='in' placement='left' 
							style={{
								display	: this.state.tooltipShow ? 'block': 'none',
								position: 'fixed',
								left: this.state.tooltipX,
								top	: this.state.tooltipY,
								width: 165
							}}
						>{this.state.tooltipHTML}</Tooltip>
						<div id="svg-globe" />
			</Grid>
		);
	}
}

export default App;
