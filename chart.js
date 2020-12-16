/**
 * TO-DO:  
 * 
 * Breite verstehen? 
 * -> Path hat innerhalb eines g Elementes links einen Overflow, außer wenn man seit Beginn einstellt 
 * -> but why though?
 * 
 * 
 * Daten richtig einbinden
 * 
 * Zeitfilter: Area animation/transition
 * 
 * Tooltip: Kreis & Text
 * -> Warum kann ich nicht auf die Accessoren zugreifen? 
 */

const dateParser = d3.timeParse('%d.%m.%Y');
//var bisectDate = d3.bisector(function(d) { return d.datum; }).left; 
drawAreaChart('./Epi.json', d => dateParser(d.datum), d => d.taeglicheErkrankungen);

//Areachart
async function drawAreaChart(url, xA, yA) {

  //1 - access data
  let dataset = await d3.json(url);

  const yAccessor = yA;
  const xAccessor = xA;

  let anzahl = dataset.length - 1;
  // console.log(anzahl);  

  let test = d3.select('#selectButton').property('value');

  let startDate = dateParser(dataset[dataset.length - test].datum);
  let endDate = dateParser(dataset[dataset.length - 1].datum);

  let startValue = 0;
  let endValue = dataset[100].taeglicheErkrankungen;

  //console.log(startDate); 
  //console.log(endDate);
  //console.log(startValue); 
  //console.log(dataset.length); 
  //console.table(dataset);


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
  let svg = wrapper.append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  let bounds = svg.append('g')
    .style('transform', `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);


  //create scales
  let yScale = d3.scaleLinear()
    .nice()
    .domain(d3.extent(dataset, yAccessor))
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
    .append('path')
    .attr('d', areaGenerator(dataset))
    .attr('fill', '#968AB6')
    .attr('stroke', '#968AB6');

  //draw peripherals
  let yAxisGenerator = d3.axisLeft()
    .scale(yScale);

  yAxisGenerator.ticks(4);
  yAxisGenerator.tickSize(-dimensions.boundW); //weißes 'grid'

  let yAxis = bounds.append('g')
    .attr("class", "grid")
    .call(yAxisGenerator);//führt generator methode aus

  let xAxisGenerator = d3.axisBottom()
    .scale(xScale);

  xAxisGenerator.ticks(2);
  xAxisGenerator.tickValues([startDate, endDate]);
  xAxisGenerator.tickFormat(d3.timeFormat("%d.%m.%Y"));

  let xAxis = bounds.append('g')
    .attr("class", "grid")
    .call(xAxisGenerator)//führt generator methode aus
    .style('transform', `translateY(${dimensions.boundH}px)`);

  //Interactions

  /*-------------------------------------------------------------*/
  //Change xAxis
  function updateX() {
    area.remove();
    test = d3.select('#selectButton').property('value');

    if (d3.select("#selectButton").property("value") == "1") {
      test = anzahl;
    }

    startDate = dateParser(dataset[dataset.length - test].datum);
    endDate = dateParser(dataset[dataset.length - 1].datum);

    // console.log(startDate); 
    // startValue = 0;
    // endValue = d3.max(dataset[startDate,endDate],yAccessor); 

    //yScale.domain(d3.extent(dataset, yAccessor))

    xScale.domain([startDate, endDate]);


    area = bounds
      .append('path')
      .attr('d', areaGenerator(dataset))
      .attr('fill', '#968AB6')
      .attr('stroke', '#968AB6');


    yAxisGenerator.ticks(4);
    yAxisGenerator.tickSize(-dimensions.boundW); //weißes 'grid'

    yAxis = bounds.append('g')
      .attr("class", "grid")
      .call(yAxisGenerator);//führt generator methode aus


    xAxisGenerator.ticks(2);
    xAxisGenerator.tickValues([startDate, endDate]);
    xAxisGenerator.tickFormat(d3.timeFormat("%d.%m.%Y"));


    xAxis.transition().duration(1000).call(xAxisGenerator);
    yAxis.transition().duration(1000).call(yAxisGenerator);
    area.transition().duration(1000).call(areaGenerator);

    d3.select("#wrapper").call(hover);

  }

  d3.select('#selectButton').on('change', updateX);
  /*-------------------------------------------------------------*/
  /*-------------------------------------------------------------*/
  // Hovern  
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

    focus.append("circle")
     .attr("class", "circle")
     .attr("r", 5)
     .attr("dy", 5)
     .attr("stroke", "steelblue")
     .attr("fill", "#fff");

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

      var xM = d3.mouse(this)[0];
      var yM = d3.mouse(this)[1];

      var x0 = xScale.invert(xM),
          i = (dataset, x0, 1),
          d0 = dataset[i - 1],
          d1 = dataset[i],
          d = x0 - d0.datum > d1.datum - x0 ? d1 : d0;
      focus.attr("transform", `translate(${xM},${yScale(d.taeglicheErkrankungen)})`); 

      console.log(yScale(d.taeglicheErkrankungen));
   }
  }
  /*-------------------------------------------------------------*/

}











