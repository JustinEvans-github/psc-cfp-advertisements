// TODO: describe plot
// import data from './data.js';

function createBarGraph() {

    const jsonData = window.chartData;
    console.log(chartData);

    // Convert JSON data to an array of objects
    const data = Object.keys(jsonData["organization_e"]).map((key) => ({
    organization: jsonData["organization_e"][key],
    creation_date_month: jsonData["creation_date_month"][key],
    total_submitted: jsonData["total_submitted_sup"][key],
    }));


    // Get the unique fiscal years
    const uniqueorganizations = [...new Set(data.map(d => d.organization))];

    // Populate the dropdown with unique fiscal years
    const orgSelect = d3.select("#organization-select");
    orgSelect.selectAll("option")
    .data(uniqueorganizations)
    .enter().append("option")
    .text(d => d);


    // PLOT SETUP
    // Set the dimensions for the SVG and the margins for the plot
    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    var svg = d3
        .select("#d3-bar-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.creation_date_month))
    .padding(0.2);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total_submitted)])
    .range([height, 0]);

    var yAxis = svg.append("g").call(d3.axisLeft(y));

    // PLOT 
    // Create a function to update the plot based on the selected year
    function updatePlot(selectedorganization) {
    const filteredData = data.filter(d => d.organization === selectedorganization);

    // Update the y-axis
    y.domain([0, d3.max(filteredData, d => d.total_submitted)]);
    yAxis.transition().call(d3.axisLeft(y));

    // Update or create the bars
    const bars = svg.selectAll("rect")
        .data(filteredData);

    bars.exit().remove(); // Remove bars not needed

    // Data suppression imputed as (*), use NaN check for height metrics
    var nan_replace = 0; 

    bars.enter().append("rect") // Create new bars
        .merge(bars) // Merge existing and new bars
        .attr("x", d => x(d.creation_date_month))
        .attr("y", d => y(d.total_submitted))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(isNaN(d.total_submitted) ? nan_replace : d.total_submitted)) // Check here
        // .attr("height", d => height - y(d.total_submitted))
        .attr("fill", "steelblue");

    }


    // PLOT START
    // Initial plot with the first fiscal year
    updatePlot(uniqueorganizations[0]);

    // Add event listener to the dropdown to update the plot
    orgSelect.on("change", function () {
        const selectedorganization = this.value;
        updatePlot(selectedorganization);

    });

}

document.addEventListener("DOMContentLoaded", createBarGraph);