import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import * as d3 from 'd3';

import { HlaService } from '../../_services';

@Component({
  selector: 'app-allele-bar',
  templateUrl: './allele-bar.component.html',
  styleUrls: ['./allele-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlleleBarComponent implements OnInit {
  @ViewChild('barplot') private chartContainer: ElementRef;
  @Input() data: any;
  @Input() title: string;
  @Input() subtitle: string;

  // plot sizes
  private element: any;
  private margin: any = { top: 10, bottom: 15, left: 45, right: 10 };
  private width: number = 125;
  private height: number = 225;
  private spacing: number = 0.2;

  // --- Selectors ---
  private chart: any;
  private yAxis: any;

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private colorScale: any;


  constructor(private hlaSvc: HlaService) {
    hlaSvc.selectedLocusState$.subscribe((locus: string) => {
      if (locus) {
        d3.selectAll(".node--leaf")
          .classed("masked", (d: any) => d.data.locus !== locus)
          .classed("enabled", (d: any) => d.data.locus === locus);

          // bars
          d3.selectAll(".minirect--alleles")
            .classed("disabled", (d: any) => d.key !== locus);
          // y-axis text
          d3.selectAll(".allelebar-axis g.tick text")
            .classed("disabled", (d: any) => d !== locus);
      } else {
        // bars
        d3.selectAll(".minirect--alleles")
          .classed("disabled", false);

        // y-axis text
        d3.selectAll(".allelebar-axis g.tick text")
          .classed("disabled", false);
      }
    })

   }

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {
    this.element = this.chartContainer.nativeElement;

    this.data.sort((a: any, b: any) => b.count - a.count);

    let svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);
      // .style('background', 'yellow');

    this.chart = svg.append("g")
      .attr("id", "bars--unique-alleles")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- x & y axes --
    this.x = d3.scaleLinear()
      .rangeRound([0, this.width])
      .domain([0, <any>d3.max(this.data, (d: any) => d.count)]);

    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(this.spacing)
      .paddingOuter(0)
      .domain(this.data.map(d => d.key));

    this.yAxis = d3.axisLeft(this.y);

    this.colorScale = this.hlaSvc.locusColors;

    // --- define tooltip ---
    let mouseover = function(d, hlaService) {
      let selected = d.key;

      hlaService.selectedLocusSubject.next(selected);

      // bars
      d3.selectAll(".minirect--alleles")
        .classed("disabled", (d: any) => d.key !== selected);
      // y-axis text
      d3.selectAll(".allelebar-axis g.tick text")
        .classed("disabled", (d: any) => d !== selected);
    }

    let mouseout = function(hlaService) {
      // bars
      d3.selectAll(".minirect--alleles")
        .classed("disabled", false);

      // y-axis text
      d3.selectAll(".allelebar-axis g.tick text")
        .classed("disabled", false);

      // update subscription for other linked components
      hlaService.selectedLocusSubject.next(null);
    }

    // --- Create axes ---
    svg.append('g')
      .attr('class', 'allelebar-axis axis--y')
      .attr('transform', `translate(${this.margin.left + 5}, ${this.margin.top})`)
      .call(this.yAxis);


    this.chart.append("g")
      .attr("class", 'bars')
      .selectAll(".bars")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "minirect--alleles")
      .attr("id", (d: any) => d.key)
      .attr("x", (d: any) => 0)
      .attr("y", (d: any) => this.y(d.key))
      .attr("width", (d: any) => this.x(d.count))
      .attr("height", this.y.bandwidth())
      .attr("fill", (d: any) => this.colorScale(d.key))
      .on("mouseover", (d: any) => mouseover(d, this.hlaSvc))
      .on("mouseout", (d: any) => mouseout(this.hlaSvc));


  }
}
