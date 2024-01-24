import * as d3 from "d3";

const drawChart = (element: any, data: any[]) => {
  const colors = ["#05BBD2", "#2070C4", "#EB80F1", "#F5C842", "#37D400"];
  const boxSize = 500;

  d3.select(element).select("svg").remove(); // Remove the old svg
  // Create new svg
  const svg = d3
    .select(element)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("viewBox", `0 0 ${boxSize} ${boxSize}`)
    .append("g")
    .attr("transform", `translate(${boxSize / 2}, ${boxSize / 2})`);

  const maxValue = data.reduce((cur: any, val: any) => Math.max(cur, val.value), 0);
  const arcGenerator: any = d3
    .arc()
    .cornerRadius(10)
    .padAngle(0.02)
    .innerRadius(100)
    .outerRadius((d: any) => {
      return 250 - (maxValue - d.value);
    });

  const pieGenerator = d3
    .pie()
    .startAngle(-0.75 * Math.PI)
    .value((d: any) => d.value);

  const arcs = svg.selectAll().data(pieGenerator(data)).enter();
  arcs
    .append("path")
    .attr("d", arcGenerator)
    .style("fill", (d, i) => colors[i % data.length])
    .transition()
    .duration(700)
    .attrTween("d", function (d) {
      const i = d3.interpolate(d.startAngle, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arcGenerator(d);
      };
    });

  // Append text labels
  arcs
    .append("text")
    .attr("text-anchor", "middle")
    .text((d: any) => `${d.data.value}%`) // label text
    .style("fill", "#fff") // label color
    .style("font-size", "30px") // label size
    .attr("transform", (d) => {
      const [x, y] = arcGenerator.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .style("font-size", 0)
    .transition()
    .duration(700)
    .style("font-size", "26px");

  // Add inner border
  svg
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 100) // should be same as innerRadius value
    .attr("stroke", "#143F8A")
    .attr("fill", "transparent")
    .transition()
    .duration(700)
    .attr("stroke-width", 8);
};

export default drawChart;
