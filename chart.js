const dateParser = d3.timeParse('%d.%m.%Y');
//var bisectDate = d3.bisector(function(d) { return d.datum; }).left; 
//drawAreaChart('./Epi.json', d => dateParser(d.datum), d => d.taeglicheErkrankungen);
 //drawAreaChart('./test.json', d => dateParser(d.datum), d => d.AnzahlFaelle, 'Burgenland'); 

drawAreaChart(d => dateParser(d.datum), d => d.AnzahlFaelle, 'Kaernten', 500); 

//Areachart
async function drawAreaChart(xA, yA, region, range) {

  //1 - access data

  const yAccessor = yA;
  const xAccessor = xA;
  const land = region; 
  let filtered = dataOffline.filter(function(d) { return d.Bundesland == land; });

  
//   console.table(filtered); 
  // var allGroup = d3.map(data, functio n(d){return(xA)}).keys()

  let anzahl = filtered.length - 1;
  console.log('Tage: ' + anzahl);  

  // let val = d3.select('#selectButton').property('value');
  let val = 15; /*** Value vom Dropdown Zeitfilter */

  // if (d3.select("#selectButton").property("value") == "1") {
  //   test = anzahl; 
  //   console.log(test); 
  // }

  let startDate = dateParser(filtered[filtered.length - val].datum);
  let endDate = dateParser(filtered[filtered.length - 1].datum);

  let startV = filtered[filtered.length - val].AnzahlFaelle;
  let endV = filtered[filtered.length - 1].AnzahlFaelle;

  let eR = d3.max([filtered,yAccessor])

  console.log('Start: ' + startDate); 
  console.log('Ende: ' + endDate);

  console.log('StartV: ' + startV); 
  console.log('EndeV: ' + endV);

  console.log('Max: ' + eR)

  
  

  //2 - set dimension and properties
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: window.innerWidth * 0.5,
    margin: {
      top: 30,
      right: 70,
      bottom: 25,
      left: 47
    },
  };
  //calculate bounded width and height
  dimensions.boundW = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundH = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //3 - draw canvas
  const wrapper = d3.select('#wrapper');

  let svg = wrapper.append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
    .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

  let bounds = svg.append('g')
    .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);


  //create scales
  let yScale = d3.scaleLinear()
    .nice()
    .domain([0, range]) /*abhängig von Daten machen */
    .range([dimensions.boundH, 0]);


  let xScale = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, dimensions.boundW]);

  // draw data (area)
  let areaGenerator = d3.area()
      .curve(d3.curveBasis)
      .x(d => xScale(xAccessor(d)))
      .y0(dimensions.boundH)
      .y1(d => yScale(yAccessor(d)));


  let area = bounds
    .append('defs')
    .append('clipPath')
    .attr('id', 'area-clip')
    .append('path') 
    // .datum(dataset.filter(function(d){return d.Bundesland=="Österreich"}))
    .attr('d', areaGenerator(filtered));

    // console.log(dataset.Bundesland[1]); 
   

  let test = bounds.append("rect")        // attach a rectangle
    .attr("x", 0)        // position the left of the rectangle
    .attr("y", 0)         // position the top of the rectangle
    .attr("clip-path", "url(#area-clip)") // clip the rectangle
    .style("fill", "#968AB6")   // fill the clipped path with lila
    .attr("height", dimensions.boundH)    // set the height
    .attr("width", dimensions.boundW);    // set the width


  //Interactions

  /*-------------------------------------------------------------*/
  //Change xAxis
//   function updateX() {
//     area.remove();
    
//     val = d3.select('#selectButton').property('value');

//     if (d3.select("#selectButton").property("value") == "1") {
//       val = anzahl;
//     }

//     startDate = dateParser(filtered[filtered.length - val].datum);
//     endDate = dateParser(filtered[filtered.length - 1].datum);


//     xScale.domain([startDate, endDate]);
  

//     area = bounds
//     // .append('defs')
//     // .append('clipPath')
//     // .attr('id', 'area-clip')
//     .append('path')
//     .attr('d', areaGenerator(filtered));

//     yAxisGenerator.ticks(4);
//     yAxisGenerator.tickSize(-dimensions.boundW); //weißes 'grid'
//     //yAxisGenerator.tickValues([startValue, endValue]);

//     yAxis = bounds.append('g')
//       .attr("class", "grid")
//       .call(yAxisGenerator);//führt generator methode aus


//     xAxisGenerator.ticks(2);
//     xAxisGenerator.tickValues([startDate, endDate]);
//     xAxisGenerator.tickFormat(d3.timeFormat("%d.%m"));


//     xAxis.transition().duration(1000).call(xAxisGenerator);
//     yAxis.transition().duration(1000).call(yAxisGenerator);
//     area.transition().duration(1000).call(areaGenerator);

//     // d3.select("#wrapper").call(hover);
    

//   }


//   d3.select('#selectButton').on('change', updateX);

  
  //draw peripherals
  let yAxisGenerator = d3.axisLeft()
    .scale(yScale);

  yAxisGenerator.ticks(4);
  yAxisGenerator.tickSize(-dimensions.boundW); //weißes 'grid'
  //yAxisGenerator.tickValues([startValue, endValue]);

  let yAxis = bounds.append('g')
    .attr("class", "grid")
    .call(yAxisGenerator);
  // .style('transform', `translateX(-7px)`);//führt generator methode aus

  let xAxisGenerator = d3.axisBottom()
    .scale(xScale);

  xAxisGenerator.ticks(2);
  xAxisGenerator.tickValues([startDate, endDate]);
  xAxisGenerator.tickFormat(d3.timeFormat("%d.%m"));

  // yAxisGenerator.ticks(8);
  // yAxisGenerator.tickValues([0,endValue+100]);

  let xAxis = bounds.append('g')
    .attr("class", "grid")
    .call(xAxisGenerator)//führt generator methode aus
    .style('transform', `translateY(${dimensions.boundH}px)`);
  /*-------------------------------------------------------------*/
  /*-------------------------------------------------------------*/
  // Hovern  
  // const tooltip = d3.select("#tooltip")

  // d3.select("#wrapper")
  //   .on("mouseover", onMouseEnter)
  //   .on("mouseleave", onMouseLeave);

  // function onMouseEnter() {

  //   tooltip.style("opacity", 1)
  // }
  // function onMouseLeave() {
  //   //console.log("2");
  // }

  // d3.select("#wrapper").call(hover);

  // function hover() {
  //   var bisect = d3.bisector(d => d.datum).left,
  //     format = d3.format("+20"),
  //     dateFormat = d3.timeFormat("%d %B")

  //   var focus = bounds.append("g")
  //     .style("display", "none");

  //   focus.append("line") //linie definieren
  //     .attr("stroke", "#211F77")
  //     .attr("stroke-width", 1)
  //     .attr("y1", -dimensions.boundH) //obere grenze
  //     .attr("y2", -0); //untere grenze

  //   focus.append("circle")
  //     .attr("class", "circle")
  //     .attr("r", 5)
  //     .attr("dy", 5)
  //     .attr("stroke", "#211F77")
  //     .attr("fill", "#211F77");

  //   focus.append("text") //text dfinieren
  //     .attr("fill", "#666")
  //     .attr("text-anchor", "middle")

  //   var overlay = bounds.append("rect") //wo hovern funktioniert
  //     .attr("class", "overlay")
  //     .attr("x", 0)
  //     .attr("y", 0)
  //     .attr("width", dimensions.boundW)
  //     .attr("height", dimensions.boundH)
  //     .on("mouseover", () => focus.style("display", null))
  //     .on("mouseout", () => focus.style("display", "none"))
  //     .on("mousemove", mousemove);

  //   function mousemove() { //was beim hovern angezeigt wird 

  //     var xM = d3.mouse(this)[0];
  //     var yM = d3.mouse(this)[1];

  //     var x0 = xScale.invert(xM),
  //       i = (dataset, x0, 1),
  //       d0 = dataset[i - 1],
  //       d1 = dataset[i],
  //       d = x0 - d0.datum > d1.datum - x0 ? d1 : d0;
  //     focus.attr("transform", `translate(${xM},${yScale(d.taeglicheErkrankungen)})`);

  //     //console.log(yScale(d.taeglicheErkrankungen));
  //   }
  // }
  /*-------------------------------------------------------------*/

}