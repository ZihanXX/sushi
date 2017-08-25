//画布尺寸
var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1200,
    outerHeight = 600,
    width = outerWidth - margin.left - margin.right/4,
    height = outerHeight - margin.top - margin.bottom;

//网格
var x = d3.scale.linear()
    .range([0, width]).nice();
var y = d3.scale.linear()
    .range([height, 0]).nice();

//声明data变量
var yCat = "Population (%)",
    xCat = "GDP Per Cap",
    rCat = "Edu Resources Amt", //r
    colorCat = "Edu Level"; //color
    country = "Country"; //每一个点点

//操作data
d3.csv("rankings.csv", function(data) {

  //搞坐标轴的，初始状态
  x.domain([0, 90000]);
  y.domain([-2, 20]);
  //坐标轴网格线
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  //颜色库10
  // var color = d3.scale.category10();
  var color = d3.scale.threshold()
    .domain([60, 150, 200, 250])
    .range(["#fdd765", "#fdbe01", "#574b9e", "#43177d"]);

  //显示小tip
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        //hover显示
        return "<span style='color:#ff4500; font-size:16px;'>" + d[country] + "</span>" + "<br>" +
        rCat + ":  " + d[rCat] + "<br>" +
        colorCat + ":  " + d[colorCat] + "<br>" +
        xCat + ":  " + d[xCat] + "<br>" +
        yCat + ":  " + d[yCat];
      });

  //搞zoom的东西
  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  //选择这个div，改变它
  var svg = d3.select("#scatter")
    //布置画布
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    //布置坐标轴
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);
  //加上tips
  svg.call(tip);
  //一通布置
  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  //坐标轴x
  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .text(xCat);
  //坐标轴y
  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .text(yCat);

  //这一坨是个变量 objects
  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  //轴，轴，还是轴
  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");
  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  //加上点点们
  objects.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .classed("dot", true)
      //r在这里
      .attr("r", function (d) { return 7 * Math.sqrt(d[rCat] / Math.PI); })
      .attr("transform", transform)
      //color在这里
      .style("fill", function(d) { return color(d[colorCat]); })
      //id
      .attr("id",function(d){return d[country];})
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  //侧边标签
  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  //侧边标签圈圈
  legend.append("circle")
      .attr("r", 3.5)
      .attr("cx", width + 20)
      .attr("fill", color);
  //侧边标签文字
  legend.append("text")
      .attr("x", width + 26)
      .attr("dy", ".35em")
      .text(function(d) { return d;});

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }

   //选点
   $('#example-multiple-optgroups').multiselect({
     enableClickableOptGroups: true,
     enableCollapsibleOptGroups: true,
     nonSelectedText: 'Select Countries',
     enableFiltering: true,
     includeSelectAllOption: true,
     inheritClass: true,
     buttonWidth: 300,
     maxHeight: 470,
     numberDisplayed: 5,
   });
   $(document).ready(function(){
     var selects;
     var element;
      $("#example-multiple-optgroups").on("change",function(){
        var selects = $("#example-multiple-optgroups").val();
        for(var i = 0; i < selects.length; i++){
          var element = document.getElementById(selects[i]);
          $(element).toggle();
        }
        // if($(element).css("visibility") == "visible"){
        //   $(element).css("visibility","hidden");
        // }
        // else{
        //   $(element).css("visibility","visible");
        // }

      });
    })

});
