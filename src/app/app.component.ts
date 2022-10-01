import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

enum Size {
  width = 800,
  height = 860
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  svg: any;
  title = 'angular-d3 test1';

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.init()
    this.setData()
  }

  init(): void{
     this.svg = d3.select('#my_dataviz')
      .append("svg")
        .attr("width", 1200)
        .attr("height", Size.height)
      .append("g")
        .attr("transform", "translate(40,0)");
  }
 

  setData(): void{
    this.http.get("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram.json").subscribe((data: any) => {
    console.log(data)
      // Create the cluster layout:
      var cluster = d3.cluster()
        .size([Size.height, Size.width - 100]);  // 100 is the margin I will have on the right side
    
      // Give the data to this cluster layout:
      var root = d3.hierarchy(data, (value: any) => {
          return value.children;
      });
      cluster(root);
      this.constructParent(root)
      this.constructChild(root)
    })
  }
    
  constructParent(root: any): void{
    this.svg.selectAll('path')
    .data( root.descendants().slice(1) )
    .enter()
    .append('path')
    .attr("d", (d: any) => {
        return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 50) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
              })
    .style("fill", 'none')
    .attr("stroke", '#ccc')
  }

  // Add the links between nodes:
 
  constructChild(root: any): void{
    // Add a circle for each node.
    const node = this.svg.selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", (d: any) => {
        return "translate(" + d.y + "," + d.x + ")"
    })

    node.append("rect")  
    .attr("x", (d: any) => { return d.children ? -50 : -15; })
    .attr("y", (d: any) => { return d.children ? -10 : -15; })
    .attr("width", 200)
    .attr("height", 40)
    .attr("stroke", "orange") 
    .style("fill", "#69b3a2")

    node.append("text")
    .style("fill", "#blue")
    .text((d: any) => d.data.name)
    .attr("dx", (d: any) => { return d.children ? -25 : 0; })       
    .attr("dy", (d: any) => { return d.children ? 13 : 10; })  
   
  }

 


}
