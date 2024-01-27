// TODO: describe plot

function createTreemap() {

    const jsonData = window.chartData;

    // // GENERATE DATASET
    // // Create an array to hold the transformed data
    // const dataForD3Treemap = [];

    // // Iterate through the classifications
    // for (const key in jsonData.classifications) {
    // if (jsonData.classifications.hasOwnProperty(key)) {
    //     const items = jsonData.classifications[key].split(',');

    // GENERATE DATASET
    // Convert JSON data to an array of objects
    const data = Object.keys(jsonData["organization_e"]).map((key) => ({
        classifications: jsonData["classifications"][key],
        organization: jsonData["organization_e"][key],
        creation_date_month: jsonData["creation_date_month"][key],
        total_submitted: jsonData["total_submitted_sup"][key],
        }));

    // Create a default
    const uniqueorganizations = [...new Set(data.map(d => d.organization))];

    createTreemap.updatePlot = function (selectedorganization) {
        // Dropdown Filters
        const filteredData = data.filter(d => d.organization === selectedorganization);

        // Create an array to hold the transformed data
        let dataForD3Treemap = [];

        // Iterate through the classifications
        for (const row of filteredData) {
            const items = row.classifications.split(',');

            // Iterate through the items within a classification
            items.forEach(item => {
            // Check if group exists first (e.g., "as" in "as01")
            const groupKey = item.substring(0, 2);
            const group = dataForD3Treemap.find(existingGroup => existingGroup.name === groupKey);

            if (group) {
                // Check if level exists next (e.g., "01" in "as01")
                const level = group.children.find(existingItem => existingItem.name === item);

                if (level) {
                // If the item with the name exists, increment its value by 1
                level.value += 1;
                } else {
                // If the item with the name doesn't exist, add it to the group's children array
                group.children.push({
                    name: item,
                    value: 1
                });
                }
            } else {
                // If the group doesn't exist, create the group and add the level
                dataForD3Treemap.push({
                name: groupKey,
                children: [{
                    name: item,
                    value: 1
                }]
                });
            }
            });
        }
        
        // Filter out blank groups if job posting doesn't list
        dataForD3Treemap = dataForD3Treemap.filter(d => d.name != ' ');

        // Create the root object for D3.js
        const treemap_data = {
        name: "root",
        children: dataForD3Treemap
        };

        // GRAPH - TREEMAP

        // set the dimensions and margins of the graph
        // Create the tree map layout
        // Set up the dimensions for the tree map
        // set the dimensions and margins of the graph
        const margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        // Remove previous treemap if it exists, needed for dropdown refresh
        d3.select("#d3-treemap").selectAll("*").remove();

        // append the svg object to the body of the page
        const svg = d3.select("#d3-treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                `translate(${margin.left}, ${margin.top})`);

        // Create a hierarchy from the data
        const root = d3.hierarchy(treemap_data);

        // Sum the values for the hierarchy
        root.sum((d) => d.value);

        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)      // Padding between each rectangle
        //.paddingOuter(6)
        //.padding(20)
        (root)

        // prepare a color scale
        // generate a list groupkeys
        const groupkeys = [];
        treemap_data.children.forEach(item => {
        if (item.children) {
            groupkeys.push(item.name)}});
        
        // https://colordesigner.io/#5C4B51-8CBEB2-F2EBBF-F3B562-F06060
        const color = d3.scaleOrdinal()
        .domain(groupkeys)
        .range(['#5C4B51','#8CBEB2','#F2EBBF','#F3B562','#F06060'])

        // And a opacity scale
        const opacity = d3.scaleLinear()
        .domain([1, 30])
        .range([.8,1])

        // use this information to add rectangles:
        svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", function(d){ return color(d.parent.data.name)} )
            .style("opacity", function(d){ return opacity(d.data.value)})

        // and to add the text labels
        svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
            .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            .text(function(d){ return d.data.name })
            .attr("font-size", "15px")
            .attr("fill", "white")

        // and to add the text labels
        svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
            .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
            .text(function(d){ return d.data.value })
            .attr("font-size", "11px")
            .attr("fill", "white")

        // Add title for the 3 groups
        svg
        .selectAll("titles")
        .data(root.descendants().filter(function(d){return d.depth==1}))
        .enter()
        .append("text")
            .attr("x", function(d){ return d.x0})
            .attr("y", function(d){ return d.y0+21})
            .text(function(d){ return d.data.name })
            .attr("font-size", "19px")
            .attr("fill",  function(d){ return color(d.data.name)} )
            
        }

        // Run default plot
        createTreemap.updatePlot(uniqueorganizations[0])

    }

document.addEventListener("DOMContentLoaded", createTreemap);

// Even Listener for Dropdowns
let selectedorganization = [];
document.addEventListener("DOMContentLoaded", function () {
    // Access the dropdown element by ID
    const dropdown = document.getElementById("organization-select");
  
    // Attach an event listener to the dropdown element
    dropdown.addEventListener("change", function () {
        selectedorganization = dropdown.value;
        createTreemap.updatePlot(selectedorganization);
    });
  });
