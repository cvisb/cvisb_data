import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-epidemiology',
  templateUrl: './epidemiology.component.html',
  styleUrls: ['./epidemiology.component.scss']
})

export class EpidemiologyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


createPlot() {
  this.element = this.chartContainer.nativeElement;

  // Append SVG
  this.svg = d3.select(this.element)
    .append('svg')
    .attr("class", "dot-plot")
    .attr("width", this.width + this.margin.left + this.margin.right)
  // .style("background", "#98AED4");

  // selectors
  this.chart = this.svg.append("g")
    .attr("id", "dotplot")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);


  this.x = d3.scaleTime()
    .domain([new Date(2010, 0, 1), new Date(2013, 0, 1)])
    .range([0, this.width]);

  this.y = d3.scaleLinear()
    // .paddingInner(0.2)
    // .paddingOuter(0);
}

updatePlot() {

  this.data.sort((a,b) => a.evalDate < b.evalDate ? -1 : 1)
  this.height = this.yHeight * this.data.length;

  this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

  let evalRange = d3.extent(this.data.map(d => d.evalDate))
  let infectionRange = d3.extent(this.data.map(d => d.infectionDate ? d.infectionDate.gte : null));
  let dischargeRange = d3.extent(this.data.map(d => d.dischargeDate));

  // --- update axes ---
  this.y
    .range([0, this.height])
    // .rangeRound([0, this.height])
    .domain([0, this.data.length]);

    console.log(this.y)

    this.xAxis = d3.axisBottom(this.x);

    this.svg.append('g')
      .attr('class', 'dotplot-axis axis--x')
      .attr('transform', `translate(${this.margin.left}, ${this.height-15})`)
      .call(this.xAxis);

  // --- enter / exit data ---
  let dotGroup = this.chart
    .selectAll(".dot-group")
    .data(this.data);

  let dots = dotGroup.select(".dot");
  let dots2 = dotGroup.select(".dot2");
  let dots3 = dotGroup.select(".dot3");
  let lollipops = dotGroup.select(".lollipop-stick");

  // --- exit ---
  dotGroup.exit()
    .remove();

  // --- enter ---
  let dotGroupEnter = dotGroup.enter() // enter the text
    .append("g")
    .attr("class", "dot-group");


  // let lollipopEnter = dotGroupEnter.append("line") // enter the first tspan on the text element
  //   .attr('class', 'lollipop-stick')
  //   .attr("x1", 0);

  let dotEnter = dotGroupEnter.append("circle") // enter the first tspan on the text element
    .attr('class', 'dot dot--count')
    .attr("r", 7);

  let dot2Enter = dotGroupEnter.append("circle") // enter the first tspan on the text element
    .attr('class', 'dot2 dot--count')
    .attr("r", 7);

  let dot3Enter = dotGroupEnter.append("circle") // enter the first tspan on the text element
    .attr('class', 'dot3 dot--count')
    .attr("r", 4);
    // .attr("r", this.y.bandwidth() / 2);


  // --- update/merge ---
  dotGroup = dotGroupEnter
    .merge(dotGroup)
    .attr("id", (d: any) => `${d._id}`); // enter + update


  // Update the position, class, and properties for the count per thing.
  dots.merge(dotEnter)
    .attr("fill", "dodgerblue")
    // .attr("fill", "none")
    .attr("cy", (d: any, i) => this.y(i))
    .attr("r", 4)
    .attr("cx", (d: any) => this.x(new Date(d.evalDate)))

  dots2.merge(dot2Enter)
    .attr("fill", "none")
    .attr("fill", "blue")
    .attr("r", 4)
    .attr("cy", (d: any, i) => this.y(i))
    .attr("cx", (d: any) => this.x(new Date(d.dischargeDate)))

  dots3.merge(dot3Enter)
    .attr("fill", "none")
    .attr("fill", "red")
    .attr("r", 4)
    .attr("cy", (d: any, i) => this.y(i))
    .attr("cx", (d: any) => d.infectionDate.gte ? this.x(new Date(d.infectionDate.gte)) : null)

  // dots.merge(lollipopEnter)
  //   .attr("y1", (d: any) => this.y(d.name) + this.y.bandwidth() / 2)
  //   .attr("y2", (d: any) => this.y(d.name) + this.y.bandwidth() / 2)
  //   .attr("x2", (d: any) => this.x(d.count));


}

}
