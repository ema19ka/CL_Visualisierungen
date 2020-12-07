
//Areachart
async function drawAreaChart(url, xA, yA) {

  //1 - access data
  //const dataset = await d3.csv('https://info.gesundheitsministerium.at/data/Epikurve.csv'); 
  //const dataset = await d3.csv('Epikurve.csv'); 
  let dataset = await d3.json(url);
  // console.log('set: ', dataset); 
  // console.table(dataset[0]); 

  const yAccessor = yA;
  const xAccessor = xA;

  

  //2 - set dimension and properties
  let dimensions = {
    width: window.innerWidth * 0.8,
    height: window.innerWidth * 0.5,
    margin: {
      top: 15,
      right: 40,
      bottom: 60,
      left: 120
    },
  };
  //calculate bounded width and height
  dimensions.boundW = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundH = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //3 - draw canvas
  const wrapper = d3.select('#wrapper');
  const svg = wrapper.append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = svg.append('g')
    .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);


  //create scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundH, 0]);

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundW]);

  // draw data (area)
  const areaGenerator = d3.area()
    .curve(d3.curveBasis)
    .x(d => xScale(xAccessor(d)))
    .y0(dimensions.boundH)
    .y1(d => yScale(yAccessor(d)));

  console.log();

  const area = bounds.append('path')
    .attr('d', areaGenerator(dataset))
    .attr('fill', '#968AB6')
    .attr('stroke', '#968AB6');

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale);

  yAxisGenerator.tickSize(-dimensions.boundW);

  const yAxis = bounds.append('g')
    .attr("class", "grid")
    .call(yAxisGenerator);//führt generator methode aus

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale);

  xAxisGenerator.ticks(2);
  xAxisGenerator.tickValues(d3.extent(dataset, xAccessor));
  xAxisGenerator.tickFormat(d3.timeFormat("%d.%m.%Y"));

  const xAxis = bounds.append('g')
    .attr("class", "grid")
    .call(xAxisGenerator)//führt generator methode aus
    .style('transform', `translateY(${dimensions.boundH}px)`);

  //Interactions
  const tooltip = d3.select("#tooltip")

  d3.select("#wrapper")
    .on("mouseover", onMouseEnter)
    .on("mouseleave", onMouseLeave);

  function onMouseEnter() {

    tooltip.style("opacity", 1)
  }
  function onMouseLeave() {
    console.log("2");
  }

/*-------------------------------------------------------------*/
  //Hovern  
  d3.select("#wrapper").call(hover);

	function hover() {
		var bisect = d3.bisector(d => d.datum).left,
			format = d3.format("+20"),
			dateFormat = d3.timeFormat("%d %B")

		var focus = bounds.append("g")
			.style("display", "none");

		focus.append("line") //linie definieren
			.attr("stroke", "#666")
			.attr("stroke-width", 1)
			.attr("y1", -dimensions.boundH) //obere grenze
			.attr("y2", -0); //untere grenze

		focus.append("circle") //kreis definieren
      .attr("class", "y")
      .style("fill", "grey")
      .style("stroke", "grey")
      .attr("r", 4);

    focus.append("text") //text dfinieren
      .attr("fill", "#666")
			.attr("text-anchor", "middle")
			
		var overlay = bounds.append("rect") //wo hovern funktioniert
			.attr("class", "overlay")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", dimensions.boundW)
			.attr("height", dimensions.boundH)
			.on("mouseover", () => focus.style("display", null))
			.on("mouseout", () => focus.style("display", "none"))
			.on("mousemove", mousemove);
  
		function mousemove() { //was beim hovern angezeigt wird 
      //var x0 = xScale.invert(d3.mouse(this)[0]);
      var x = d3.mouse(this)[0];
      //var y = yAccessor; 
    
  
      
			// var i = bisect(dataset, x0, 1),
			// 	d0 = dataset[i - 1],
			// 	d1 = dataset[i],
			// 	d = x0 - d0.date > d1.date - x0 ? d1 : d0;

			focus.select("line") //linie bewegt sich mit
				.attr("transform", `translate(${x},${dimensions.boundH})`); 
					//"translate(" + xScale(d.datum) + "," + dimensions.boundH + ")"); 

			focus.selectAll(".circle") //kreis bewegt sich mit
      . attr("transform", `translate(${x},${x})`);
      
      


			// focus.select("text") //text bewegt sich mit
      //   .attr("transform", `translate(${x},${dimensions.boundH})`)
			// 	.text('datum + erkrankungen');
		}
  }
  /*-------------------------------------------------------------*/
}


const dateParser = d3.timeParse('%d.%m.%Y')
drawAreaChart('./Epi.json',d => dateParser(d.datum),d => d.taeglicheErkrankungen);







