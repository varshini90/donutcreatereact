import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DonutChartDateItem {
    name: string;
    value: number;
  }
  
  interface DonutChartProps {
    data: DonutChartDateItem[];
  }

const DonutChart: React.FC<DonutChartProps> = ({data}) => {
    const d3Container = useRef<SVGSVGElement | null>(null);
    const stageCanvasRef: any = useRef(document.getElementById('ChartGrid'));
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    useEffect(() => {
        if (data && d3Container.current) {
            let iWidth = 100;
            let iHeigth = 100;
            // const resizeObserver = new ResizeObserver((event: any) => {
            //     setWidth(event[0].contentBoxSize[0].inlineSize);
            //     setHeight(event[0].contentBoxSize[0].blockSize);
            //     iWidth = event[0].contentBoxSize[0].inlineSize;
            //     iHeigth= event[0].contentBoxSize[0].blockSize
            // });
            // resizeObserver.observe(stageCanvasRef.current);
            // const radius = Math.min(iWidth, iHeigth) / 2;

        //     const arc: any = d3.arc()
        //     .innerRadius(radius * 0.67)
        //     .outerRadius(radius - 1);

        //     const pie: any = d3.pie()
        //     .padAngle(1 / radius)
        //     .sort(null)
        //     .value((d: any) => d.value)
        //     .startAngle(-Math.PI / 1.5) // Start angle set to -90 degrees (at the top)
        //     .endAngle(Math.PI / 1.5); ;

        //     const color = d3.scaleOrdinal()
        //     .domain(data.map(d => d.name))
        //     .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        //     const svg = d3.select(d3Container.current)
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("viewBox", [-width / 2, -height / 2, width, height])
        //     .attr("style", "max-width: 100%; height: auto;");
        //    // const svg = d3.select(d3Container.current);
        //      const margin = { top: 20, right: 30, bottom: 40, left: 90 };
            // width = 1000 - margin.left - margin.right,
            // height = 500 - margin.top - margin.bottom;

           // svg.selectAll("*").remove();


            
            // const chart: any = svg.append("g")
            // .selectAll()
            // .data(pie(data))
            // .join("path")
            //   .attr("fill", (d: any) => color(d.data.name))
            //   .attr("d", arc)
            // .append("title")
            //   .text((d: any) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

            //   chart

            // // const y = d3.scaleBand()
            // // .range([0, height])
            // // .domain(data.map(d => d.name))
            // // .padding(.1);
            // // chart.append("g")
            // //         .call(d3.axisLeft(y))
            // // chart.selectAll("myRect")
            // // .data(data)
            // // .enter()
            // // .append("rect")
            // // .attr("x", x(0))
            // // .attr("y", (d: any) => y(d.name))
            // // .attr("width", (d: any) => x(d.value))
            // // .attr("height", y.bandwidth())
            // .attr("fill", "#69b3a2")
        }
    }, [data, stageCanvasRef]);

    return (
        <svg
          className="d3-component"
          width={1000}
          height={500}
          ref={d3Container}
        />
      );

}

export default DonutChart;