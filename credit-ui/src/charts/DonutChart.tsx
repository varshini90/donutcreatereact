import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface ScoreItem {
  grade: string;
  range: [number, number];
}

export interface DonutChartProps {
  scores: ScoreItem[];
  width: number;
  creditScore?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ scores, width , creditScore}) => {
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;
  const ref = useRef<SVGSVGElement>(null);
  const score: any = creditScore;

  useEffect(() => {
    if (!ref.current || !scores.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear SVG to prevent duplicate charts

    const data = scores.map(score => ({
      ...score,
      value: score.range[1] - score.range[0],
    }));

    const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const pie = d3.pie<typeof data[0]>()
      .padAngle(1 / radius)
      .sort(null)
      .value(d => d.value);

    const color: any = d3.scaleOrdinal()
      .domain(data.map(d => d.grade))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const paths = svg.append("g")
      .selectAll("path")
      .data(pie(data))
      .enter().append("path")
        .attr("fill", d => color(d.data.grade))
        .attr("d", arc);

        paths.transition()
        .duration(750)
        .ease(d3.easeCubicOut)
        .attrTween("d", function(d) {
          const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d); // Create an interpolator
          return function(t) {
            // Ensure the return type is always a string by using the String function or fallback to an empty string
            return String(arc(i(t))) || "";
          };
        });

    paths.append("title")
      .text(d => `${d.data.grade}: ${d.data.range[0]}-${d.data.range[1]}`);

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(pie(data))
      .enter().append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.grade))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => `${d.data.range[0]}-${d.data.range[1]}`));

  }, [scores, height, radius, width]);



  useEffect(() =>{
    if (creditScore !== null && ref.current) {
        const svg = d3.select(ref.current);

      // Remove any existing markers before adding a new one
      svg.selectAll(".credit-score-marker").remove();

      const dataWithTotalValue = scores.map(score => ({
        ...score,
        totalValue: score.range[1] - score.range[0],
      }));

      const totalValuesSum = dataWithTotalValue.reduce((acc, curr) => acc + curr.totalValue, 0);

      const angleScale = d3.scaleLinear()
        .domain([0, totalValuesSum])
        .range([0, 2 * Math.PI]);

     let scoreAngle;
    
     let cumulative = 0;
     let targetAngle;
     for (const item of dataWithTotalValue) {
       if (score >= item.range[0] && score <= item.range[1]) {
         const scorePosition = score - item.range[0];
         targetAngle = (cumulative + scorePosition) / totalValuesSum * 2 * Math.PI - Math.PI / 2;
         break;
       }
       cumulative += item.totalValue;
     }
 
     if (targetAngle !== undefined) {
       const lineLength = radius; // Length of the line from the center to the edge of the chart
       const x1 = radius * Math.cos(targetAngle);
       const y1 = radius * Math.sin(targetAngle);
       const x2 = (radius + 20) * Math.cos(targetAngle); // Extend the line beyond the chart
       const y2 = (radius + 20) * Math.sin(targetAngle);
 
       // Draw the line
       svg.append("line")
         .classed("credit-score-marker", true)
         .attr("x1", x1)
         .attr("y1", y1)
         .attr("x2", x2)
         .attr("y2", y2)
         .attr("stroke", "black")
         .attr("stroke-width", 2);
 
       // Add text at the end of the line
       svg.append("text")
         .classed("credit-score-text", true)
         .attr("x", x2 + 5 * Math.cos(targetAngle)) // Offset text slightly from the line end
         .attr("y", y2 + 5 * Math.sin(targetAngle))
         .attr("dy", ".35em") // Center text vertically
         .style("text-anchor", targetAngle > 0 && targetAngle < Math.PI ? "start" : "end") // Adjust text anchor based on angle
         .text(score);
     }
    }
  }, [creditScore,  scores, radius]);


  

  return <svg ref={ref} width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }} />;
};

export default DonutChart;
