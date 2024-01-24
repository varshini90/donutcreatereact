import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartData {
  letter: string;
  frequency: number;
}

interface D3ChartProps {
  data: ChartData[];
}

const D3Chart: React.FC<D3ChartProps> = ({ data }) => {
    const d3Chart = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (data && d3Chart.current) {
            const svg = d3.select(d3Chart.current);
            svg.selectAll("*").remove(); // Clear svg content before adding new elements

            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 500 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
            const y = d3.scaleLinear()
                .range([height, 0]);

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            x.domain(data.map(d => d.letter));

            const dx: any = d3.max(data, d => d.frequency)
            y.domain([dx]);
            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.letter)!)
                .attr("width", x.bandwidth())
                .attr("y", d => y(d.frequency))
                .attr("height", d => height - y(d.frequency));

            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            g.append("g")
                .call(d3.axisLeft(y));
        }
    }, [data]);

    return (
        <svg ref={d3Chart} width={500} height={300}></svg>
    );
};

export default D3Chart;
