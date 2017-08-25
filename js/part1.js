var margin = {top: 0, right: 30, bottom: 0, left: 30},
  width = 1050 - margin.left - margin.right - 300,
  height = 1200;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d) { return Math.abs(d); })
    .orient("bottom");

var yAxis1 = d3.svg.axis()
    .scale(y)
    .orient("right")
    .tickSize(10)
    .tickPadding(6);

var yAxis2 = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(10)
    .tickPadding(6);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Ranking:</strong> <span style='color:orangered'>" + (d.value < 0 ? Math.abs(d.value) : d.value) + "</span>";
  });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right + 800)
  .attr("height", height + margin.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + 450 + "," + 50 + ")");

svg.call(tip);


d3.tsv("data1.tsv", type, function(error, data) {
  x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  y.domain(data.map(function(d) { return d.name; }));

svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d.value)); })
      .attr("y", function(d) { return y(d.name); })
      .attr("id",function(d){
        return d.name;
      })
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
      .attr("height", y.rangeBand())

      .on('mouseover', function(d){
          tip.show(d);
          var texts = document.getElementsByTagName("text");
          for(var i = 0;i<texts.length;i++){
            console.log(texts[i].innerHTML);
            if(texts[i].innerHTML == d.name){
              var t = texts[i];
              console.log(texts[i]);
              d3.select(texts[i]).attr("fill","orangered");
            }
          }

      })

      .on('mouseout',function(d){
          tip.hide(d);
          var texts = document.getElementsByTagName("text");
          for(var i = 0;i<texts.length;i++){
            console.log(texts[i].innerHTML);
            if(texts[i].innerHTML == d.name){
              var t = texts[i];
              console.log(texts[i]);
              d3.select(texts[i]).attr("fill","black");
            }
          }
      });
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text");

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(300) + ",0)")
      .call(yAxis1)
      .selectAll("text");

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(-300) + ",0)")
      .call(yAxis2)
      .selectAll("text");


    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-family", "Montserrat")
        .style("font-size", "25px")
        .text("U.S. News  V.S.  QS      ");

});

function type(d) {
  d.value = +d.value;
  return d;
}
