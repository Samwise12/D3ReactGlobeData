import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import axios from 'axios';
import lodash from 'lodash';

var globalVals = [243.1, 246.3, 250.1, 260.3, 266.2, 272.9, 279.5, 280.7, 275.4, 271.7, 273.3, 271, 281.2, 290.7, 308.5, 320.3, 336.4, 344.5, 351.8, 356.6, 360.2, 361.4, 368.1, 381.2, 388.5, 392.3, 391.7, 386.5, 385.9, 386.7, 391.6, 400.3, 413.8, 422.2, 430.9, 437.8, 440.5, 446.8, 452, 461.3, 470.6, 472.8, 480.3, 475.7, 468.4, 472.8, 486.7, 500.4, 511.1, 524.2, 525.2, 529.3, 543.3, 542.7, 546, 541.1, 545.9, 557.4, 568.2, 581.6, 595.2, 602.6, 609.6, 613.1, 622.7, 631.8, 645, 654.8, 671.1, 680.8, 692.8, 698.4, 719.2, 732.4, 750.2, 773.1, 797.3, 807.2, 820.8, 834.9, 846, 851.1, 866.6, 883.2, 911.1, 936.3, 952.3, 970.1, 995.4, 1011.4, 1032, 1040.7, 1053.5, 1070.1, 1088.5, 1091.5, 1137.8, 1159.4, 1180.3, 1193.6];

class Chart extends Component {
	render() {
		return <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
	}
}

class DataSeries extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		 console.log(this.props)
		var props = this.props;
		var xScale = d3.scale.ordinal()
			.domain(d3.range(this.props.data.length))
			.rangeRoundBands([0, this.props.width], 0.05);
		var yScale = d3.scale.linear()
			.domain([0, d3.max(this.props.data)])
			.range([0, this.props.height]);		      	
		var bars = _.map(this.props.data, function(point, i) {
            return (              
               <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} color={props.color} key={i} />
            )
          });
		// console.log(bars)
			return (
				<g>
				{bars}
				<XAxis x={450} labels={this.props.labels} start={0} end={600} />
				</g>
				)
	}
}
class Bar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			offset: 0
		}
	}
	render() {
		// console.log('Bar:', this.props)
		return (
		<rect fill={this.props.color} width={this.props.width} height={this.props.height}
		x={this.props.offset} y={this.props.availableHeight - this.props.height} />
			)
	}
}
class XAxis extends Component {
  constructor(props) {
    super(props)
  }
  render() {
  	// console.log(this.props)
    let style = {
      stroke: "steelblue",
      strokeWidth: "3px"
    } 
    let step = (this.props.start + this.props.end / this.props.labels.length)    
    //D3 mathy bits   
    let ticks = d3.range(0, 600, step)    
    let lines = []
    ticks.forEach((tick, index) => {
      lines.push(<line style={style} x1={tick + 10 } y1={this.props.x} x2={tick + 10} y2={this.props.x + 4}  />)
    })    
    let columnLables = []
    ticks.forEach((tick, index) => {
      columnLables.push(<text style={{fill: "steelblue"}} x={tick + 5} y={20} 
      	fontFamily="Verdana" fontSize="11" key={index + Date.now()}>{this.props.labels[index]}</text>)
    })      
    return(
      <g>
	      <line x1={0} y1={200 } x2={600} y2={200} style={ style } />
	      { columnLables }
      </g>
    )
  }
}

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			dates: [], values: []
		}
		// this.barWidth = 35;
		// this.barOffset = 5;
	}
	componentDidMount() {
		axios({
			method: 'get',
			url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
			responseType: 'json'
		}).then(res => {		
			let obj = res.data.data;
			let values = [], dates = [];
		for(let i=0; i<obj.length; i++)	{			
			values.push(obj[i][1])
			dates.push(obj[i][0])
		}
		this.setState({ values: values, dates: dates.slice(-2) })
		})

	}
	render(){
		//console.log(globalVals)
		return(
			<Chart width={this.props.width} height={this.props.height}>
				<DataSeries 
				labels={this.state.dates}
				data={this.state.values}
				width={this.props.width} height={this.props.height} color="green" />
			</Chart>
			)
	}
}

Bar.defaultProps = {
  width: 0,
  height: 0,
  offset: 0
};
DataSeries.defaultProps = {

};
App.defaultProps = {
	height: 500,
	width: 600
};
export default App;
