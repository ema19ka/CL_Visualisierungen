// TO DO: 
// richtige Quelle einbinden
// runde Ecken PROFISORISCH --> siehe ab Zeile 116 "HelpRect" 
//    Funktionen left/rightRounded, Problem--> ich kann schon wieder nicht auf die richtigen Daten zugreifen :(

/**
 * Ideen: mehr mit Parameter arbeiten
 * damit man das Bundesland auswählen kann 
 * und den letzten Tag im Datensatz
 * Bundesland kommt von Dropdown und dann Vergleich mit Daten 
 * vllt alte Datensätze löschen & dann muss man nur mehr das Bundesland auswählen? 
 */


async function drawLineChart() {

    const dataset = await d3.json('./CovidFallzahlenUmgewandelt.json');

    //let currentDay = d3.select(dataset, function(d){return d => d.Meldedat;});
    //let max = d3.select(d.Meldedat);
    //arr[arr.length - 1]
    //console.log(currentDay);

    const width = 400;
    const height = 400;
    const barPadding = 200;
    // const barHeight = 40;
    const abstandErsterText = 35;
    const abstandProzentLabels = 20;
    const lineHeight = 30;
    const abstandProzentLabelsBig = 50;
    //const barPadding = height/1.5;
    const barHeight = height / 8;
    // const abstandProzentLabels = barHeight/2.5;
    // const lineHeight = barHeight/2;
    // const abstandProzentLabelsBig = barHeight/1;

    let dimensions = {
        width: width,
        height: height,
        margin: {
            top: 0,
            right: 10,
            bottom: 50,
            left: 50
        }
    };

    dimensions.boundedW = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedH = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const wrapper = d3.select('#wrapper')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const bounds = wrapper.append('g')
        .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);



    /// BERECHNUNG der Länge der Rechtecke: BoundedW * %-Anteil //////////////////////////////////////

    const FZHospPercent = d => dimensions.boundedW * ((d.FZHosp / (d.FZHosp + d.FZHospFree)));
    const FZHospFreePercent = d => dimensions.boundedW * ((d.FZHospFree / (d.FZHosp + d.FZHospFree)));

    const FZICUPercent = d => dimensions.boundedW * ((d.FZICU / (d.FZICU + d.FZICUFree)));
    const FZICUFreePercent = d => dimensions.boundedW * ((d.FZICUFree / (d.FZICU + d.FZICUFree)));

    /// PROZENTZAHLEN für die Labels
    // const FZHospPercentZahl = d => ((d.FZHosp / (d.FZHosp + d.FZHospFree)) * 100);
    // const FZICUPercentZahl = d => ((d.FZICU / (d.FZICU + d.FZICUFree)) * 100);

    /// BALKEN ///////////////////////////////////////////////

    // Returns path data for a rectangle with rounded right corners.
    // Note: it’s probably easier to use a <rect> element with rx and ry attributes!
    // The top-left corner is ⟨x,y⟩.
    function rightRoundedRect(x, y, width, height, radius) {
        return "M" + x + "," + y
            + "h" + (width - radius)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
            + "v" + (height - 2 * radius)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
            + "h" + (radius - width)
            + "z";
    }

    function leftRoundedRect(x, y, width, height, radius) {
        return "M" + (x + radius) + "," + y
            + "h" + (width - radius)
            + "v" + height
            + "h" + (radius - width)
            + "a" + radius + "," + radius + " 0 0 1 " + (-radius) + "," + (-radius)
            + "v" + (2 * radius - height)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + (-radius)
            + "z";
    }

    // var barFZHosp = wrapper.selectAll("FZHosp")
    //     .data(dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "rectLinks")
    //     .attr("x", 0)
    //     .attr("y", dimensions.margin.top + abstandErsterText)
    //     .attr("rx", 15)
    //     .attr("ry", 15)
    //     .attr("width", FZHospPercent)
    //     .attr("height", barHeight);
    //     //.attr("fill", "#34367d");



    console.log(FZHospPercent);
    console.log(dataset.FZHospPercent);
    console.log(dataset[0].FZHospPercent);

    var barFZHosp = wrapper.selectAll("FZHosp")
        .data(dataset)
        .enter()
        .append("path")
        .attr("class", "rectLinks")
        .attr('d', leftRoundedRect(0, dimensions.margin.top + abstandErsterText, 120, barHeight, 10));
    //.attr("fill", "#34367d");



    var barFZHospFree = wrapper.selectAll("FZHospFree")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "rectRechts")
        .attr("x", FZHospPercent)
        .attr("y", dimensions.margin.top + abstandErsterText)
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("width", FZHospFreePercent)
        .attr("height", barHeight);

    var barFZICU = wrapper.selectAll("FZICU")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "rectLinks")
        .attr("x", 0)
        .attr("y", dimensions.margin.top + barHeight + barPadding)
        .attr("rx", 15)
        .attr("ry", 15)
        // .attr("width", d => d.FZICU)
        .attr("width", FZICUPercent)
        .attr("height", barHeight);

    var barFZICUFree = wrapper.selectAll("FZICUFree")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "rectRechts")
        .attr("x", FZICUPercent)
        .attr("y", dimensions.margin.top + barHeight + barPadding)
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("width", FZICUFreePercent)
        .attr("height", barHeight);

    // Hilfsrechtecke, liegt über den runden Ecken in der Mitte, 
    //damit die Balken nur außen abgerundet sind
    // var HelpRectBarFZHosp = wrapper.selectAll("FZHosp")
    //     .data(dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "rectLinks")
    //     .attr("x", d => dimensions.boundedW * ((d.FZHosp / (d.FZHosp + d.FZHospFree))) - 13)
    //     .attr("y", dimensions.margin.top + abstandErsterText)
    //     .attr("width", 13)
    //     .attr("height", barHeight);

    // var HelpRectBarFZHospFree = wrapper.selectAll("FZHospFree")
    //     .data(dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "rectRechts")
    //     .attr("x", FZHospPercent)
    //     .attr("y", dimensions.margin.top + abstandErsterText)
    //     .attr("width", 13)
    //     .attr("height", barHeight);

    var HelpRectBarFZICU = wrapper.selectAll("FZICU")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "rectLinks")
        .attr("x", d => dimensions.boundedW * ((d.FZICU / (d.FZICU + d.FZICUFree))) - 13)
        .attr("y", dimensions.margin.top + barHeight + barPadding)
        .attr("width", 13)
        .attr("height", barHeight);

    var HelpRectBarFZICUFree = wrapper.selectAll("FZICUFree")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "rectRechts")
        .attr("x", FZICUPercent)
        .attr("y", dimensions.margin.top + barHeight + barPadding)
        .attr("width", 13)
        .attr("height", barHeight);


    /// LABELS //////////////////////////////////////////
    var nullProzent1 = wrapper.selectAll("texti")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "smallLabel")
        .attr('x', 0)
        .attr('y', dimensions.margin.top + abstandErsterText + barHeight + abstandProzentLabels)
        .text('0%');

    var hundertProzent1 = wrapper.selectAll("textii")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "smallLabel")
        .attr('x', dimensions.boundedW - 40)
        .attr('y', dimensions.margin.top + abstandErsterText + barHeight + abstandProzentLabels)
        .text('100%');

    var nullProzent2 = wrapper.selectAll("textiii")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "smallLabel")
        .attr('x', 0)
        .attr('y', dimensions.margin.top + barHeight + barPadding + barHeight + abstandProzentLabels)
        .text('0%');

    var hundertProzent2 = wrapper.selectAll("textiiii")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "smallLabel")
        .attr('x', dimensions.boundedW - 40)
        .attr('y', dimensions.margin.top + barHeight + barPadding + barHeight + abstandProzentLabels)
        .text('100%');


    var labelProzentHosp = wrapper.selectAll("textiiii")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "bigLabel")
        .attr('x', d => dimensions.boundedW * ((d.FZHosp / (d.FZHosp + d.FZHospFree))) - 25)
        .attr('y', dimensions.margin.top + abstandErsterText + barHeight + abstandProzentLabelsBig)
        .text(d => Math.round(((d.FZHosp / (d.FZHosp + d.FZHospFree)) * 100) * 10) / 10 + "%");

    var labelProzentICU = wrapper.selectAll("textiiii")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "bigLabel")
        .attr('x', d => dimensions.boundedW * ((d.FZICU / (d.FZICU + d.FZICUFree))) - 25)
        .attr('y', dimensions.margin.top + barHeight + barPadding + barHeight + abstandProzentLabelsBig)
        .text(d => Math.round(((d.FZICU / (d.FZICU + d.FZICUFree)) * 100) * 10) / 10 + "%");

    var textHosp = wrapper.selectAll("texti")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "anfangstext")
        .attr('x', 0)
        .attr('y', dimensions.margin.top + 15)
        .text(d => d.FZHosp + " von " + (d.FZHosp + d.FZHospFree) + " Krankenbetten sind belegt");

    var textICU = wrapper.selectAll("texti")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "anfangstext")
        //.attr('x', 0)
        .attr('y', dimensions.margin.top + barHeight + barPadding - 20)
        .text(d => d.FZICU + " von " + (d.FZICU + d.FZICUFree) + " Intensivbetten sind belegt");




    /// LINIE ///////////////////////////////////////////
    var linieHosp = wrapper.selectAll("linie")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", FZHospPercent)
        .attr("y1", dimensions.margin.top + abstandErsterText)
        .attr("x2", FZHospPercent)
        .attr("y2", dimensions.margin.top + abstandErsterText + barHeight + lineHeight)
        .style("stroke", "#000000")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "3,3");

    var linieICU = wrapper.selectAll("linie")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", FZICUPercent)
        .attr("y1", dimensions.margin.top + barHeight + barPadding)
        .attr("x2", FZICUPercent)
        .attr("y2", dimensions.margin.top + barHeight + barPadding + barHeight + lineHeight)
        .style("stroke", "#000000")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "3,3");



}

drawLineChart()