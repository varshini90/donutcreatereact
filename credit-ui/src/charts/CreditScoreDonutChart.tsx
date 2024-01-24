import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AnyARecord } from 'dns';

interface CreditScoreData {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: CreditScoreData[];
}

const CreditScoreDonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const svg: any = d3.create("svg")
      .attr("width", 500)
      .attr("height", 500)
      .attr("viewBox", [-500 / 2, -500 / 2, 500, 500])
      .attr("style", "max-width: 100%; height: auto;");
  
  const chartRef = useRef<SVGSVGElement>(svg);

  useEffect(() => {
    if (data && chartRef.current) {

        const height = 500;
        const width = 500;
        const radius = Math.min(500, height) / 2;

  const arc: any = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

  const pie: any = d3.pie()
      .padAngle(1 / radius)
      .sort(null)
      .value((d: any) => d.value);

  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

   const svg = d3.select(chartRef.current);


  svg.append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
    //.attr("fill", (d: any) => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text((d: any) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
      .attr("transform", (d: any) => `translate(${arc.centroid(d)})`)
      .call((text: any) => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d: any) => d.data.name))
      .call((text: any) => text.filter((d: any) => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d: any) => d.data.value.toLocaleString("en-US")));
    //   
    //   const width = 540;
    //   const height = 540;
    //   const radius = Math.min(width, height) / 2;

    //   svg.selectAll("*").remove(); // Clear svg content

    //   const g = svg.append("g")
    //                .attr("transform", `translate(${width / 2}, ${height / 2})`);

    //   const color = d3.scaleOrdinal(d3.schemeCategory10);

    //   const pie = d3.pie<CreditScoreData>()
    //                 .sort(null)
    //                 .value(d => d.value);

    //   const path = d3.arc<d3.PieArcDatum<CreditScoreData>>()
    //                  .outerRadius(radius - 10)
    //                  .innerRadius(radius - 70);

    //   const label = d3.arc<d3.PieArcDatum<CreditScoreData>>()
    //                   .outerRadius(radius - 40)
    //                   .innerRadius(radius - 40);

    //   const arc = g.selectAll(".arc")
    //                .data(pie(data))
    //                .enter().append("g")
    //                .attr("class", "arc");


    

    // //   arc.append("path")
    // //      .attr("d", path)
    // //      .attr("fill", d => color(d.data.name));

    // //   arc.append("text")
    // //      .attr("transform", d => `translate(${label.centroid(d)})`)
    // //      .attr("dy", "0.35em")
    // //      .text(d => d.data.name);
    //
 }
  }, [data]);

  return <svg ref={chartRef} width={540} height={540}></svg>;
};

export default CreditScoreDonutChart;
