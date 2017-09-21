import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import axios from 'axios';
import lodash from 'lodash';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			dates: [], values: [],
			svg: "", scales: {}
		}
		// this.barWidth = 35;
		// this.barOffset = 5;
	}
	componentDidMount() {
		var xScale = d3.scale.ordinal().rangeRoundBands([0,this.props.width], .1);
		var yScale=d3.scale.linear().range([this.props.height, 0]);
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
		this.setState({ values, dates,
		 svg: d3.select("#graph").append("svg")
				   .attr("height", this.props.height)
				   .attr("width", this.props.width)
				   .attr("class","chart"),
				    scales: {xScale, yScale} })
		})		
	}
	render(){
		var state = this.state,
		svg = state.svg || false,
		yScale = state.scales.yScale,
		data = state.values,
		height = this.props.height;
		if (svg) {
			var chart = svg.append("g");
			
			chart.selectAll(".bar")
				.data(data)
				.enter().append("rect").attr("class","bar")
				.attr("height", function(d){return height - yScale(1)})

		}
		return(
			<div className="outerwrapper">
			<h1>D3+React Bar Chart</h1>
			<div id="graph"></div>
			</div>

			)
	}
}
App.defaultProps = {
	height: 500,
	width: 600
};
export default App;
