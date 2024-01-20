// TODO: describe plot
// import data from './data.js';

// TODO: fix bar graph- it is taking one instance not the SUM of total_submitted

function bar_graph_advert_by_month() {

    const jsonData = window.chartData;
    console.log(jsonData)

    // Convert JSON data to an array of objects
    const data = Object.keys(jsonData["organization_e"]).map((key) => ({
    classifications: jsonData["classifications"][key],
    organization: jsonData["organization_e"][key],
    creation_date_month: jsonData["creation_date_month"][key],
    total_submitted: jsonData["total_submitted_sup"][key],
    }));

    // Get the unique fiscal years
    const uniqueorganizations = [...new Set(data.map(d => d.organization))];
    uniqueorganizations.sort();

    // Get the unique months
    const uniquemonths = [...new Set(data.map(d => d.creation_date_month))];
    uniquemonths.sort();

    // Populate the dropdown with unique organizations
    const orgSelect = d3.select("#organization-select");
    orgSelect.selectAll("option")
    .data(uniqueorganizations)
    .enter().append("option")
    .text(d => d);

    // PLOT SETUP
    // Set the dimensions for the SVG and the margins for the plot
    const width = 200;
    const height = 300;
    const margin = { top: 10, right: 20, bottom: 30, left: 50 };

    var svg = d3
        .select("#d3-bar-graph-advert-by-month")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', 5)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Advertisements per Month');

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total_submitted)])
    .range([height, 0]);
    d3.scaleBand
    var yAxis = svg.append("g").call(d3.axisLeft(y));

    // Add y-axis label
    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .attr("font-size", "15px")
    .text('Advertisements');

    // PLOT 
    // Create a function to update the plot based on the selected year
    function updatePlot(selectedorganization) {
        // Data
        const filteredData = data.filter(d => d.organization === selectedorganization);

        // JOB POSTINGS PER MONTH
        // Set default value of 0 per month before looping
        const applications_per_month = {}; 
        uniquemonths.forEach(month => {
            applications_per_month[month] = 0;
          });

        // Iterate through the data and count keys for each 'creation_date_month'
        filteredData.forEach((item) => {
            const month = item.creation_date_month;
            if (applications_per_month[month]) {
                applications_per_month[month]++; // Increment the count if the month already exists in the object
            } else {
                applications_per_month[month] = 1; // Initialize the count if the month is encountered for the first time
            }
        });
    
        // Formatted data to pass to bar-graph
        const month_name = Object.keys(applications_per_month);
        const month_valuesList = Object.values(applications_per_month);
        const month_maxValue = Math.max(...month_valuesList);

        // In-line text for 'Advertisement Trends'
        const month_with_highest_value = month_name[month_valuesList.indexOf(month_maxValue)];
        document.getElementById('advertisement-max-month').innerText = month_with_highest_value;

        // X axis
        const x = d3.scaleBand()
        .range([0, width])
        .domain(month_name)
        .padding(0.2);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Update the y-axis
        y.domain([0, month_maxValue + 1]);
        yAxis.transition().call(d3.axisLeft(y));

        // Add Bars 
        const bars = svg.selectAll("rect")
            .data(month_valuesList);
        bars.exit().remove(); // Remove bars not needed

        var nan_replace = 0; // Data suppression

        bars.enter().append("rect") // Create new bars
            .merge(bars) // Merge existing and new bars
            .attr("x", (d, i) => x(month_name[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d)) 
            .attr("fill", "#806c74");

    }


    // PLOT START
    // Initial plot with the organization in the list
    updatePlot(uniqueorganizations[0]);

    // Add event listener to the dropdown to update the plot
    orgSelect.on("change", function () {
        const selectedorganization = this.value;
        updatePlot(selectedorganization);

    });

}

document.addEventListener("DOMContentLoaded", bar_graph_advert_by_month);


// BAR GRAPH BY TENURE

function bar_graph_tenure() {

    const jsonData = window.chartData;

    // Convert JSON data to an array of objects
    const data = Object.keys(jsonData["organization_e"]).map((key) => ({
    organization: jsonData["organization_e"][key],
    indeterminate: jsonData["indeterminate"][key],
    specified_term: jsonData["specified_term"][key],
    acting: jsonData["acting"][key],
    assignment: jsonData["assignment"][key],
    deployment: jsonData["deployment"][key],
    secondment: jsonData["secondment"][key],

    }));

    // 'indeterminate','specified_term', 'acting', 'assignment', 'deployment', 'secondment'

    // Get the unique fiscal years
    const uniqueorganizations = [...new Set(data.map(d => d.organization))];

    // PLOT SETUP
    // Set the dimensions for the SVG and the margins for the plot
    const width = 200;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 75, left: 50 };

    var svg = d3
        .select("#d3-bar-graph-tenure")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Add title
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', 5)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Advertisements by Tenure');

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);
    d3.scaleBand
    var yAxis = svg.append("g").call(d3.axisLeft(y));

    // Add y-axis label
    svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .attr("font-size", "15px")
    .text('Advertisements');
    

    // PLOT 
    // Create a function to update the plot based on the selected year
    bar_graph_tenure.updatePlot = function (selectedorganization) {
        // Data
        const filteredData = data.filter(d => d.organization === selectedorganization);

        // Format the tenure counts into an array for D3
        const indeterminate_sum = filteredData.reduce((accumulator, currentValue) => {return accumulator + (currentValue.indeterminate === '1' ? 1 : 0)}, 0);
        const specified_term_sum  = filteredData.reduce((accumulator, currentValue) => {return accumulator + (currentValue.specified_term === '1' ? 1 : 0)}, 0);
        const acting_sum  = filteredData.reduce((accumulator, currentValue) => {return accumulator + (currentValue.acting === '1' ? 1 : 0)}, 0);
        const assignment_sum  = filteredData.reduce((accumulator, currentValue) => {return accumulator + (currentValue.assignment === '1' ? 1 : 0)}, 0);
        const deployment_sum  = filteredData.reduce((accumulator, currentValue) => {return accumulator + (currentValue.deployment === '1' ? 1 : 0)}, 0);
        const secondment_sum  = filteredData.reduce((accumulator, currentValue) => {return accumulator + (currentValue.secondment === '1' ? 1 : 0)}, 0);

        var tenure_value = [indeterminate_sum, specified_term_sum, acting_sum, assignment_sum, deployment_sum, secondment_sum];
        var tenure_name = ['Indeterminate','Specified-Term', 'Acting', 'Assignment', 'Deployment', 'Secondment'];
        const tenure_maxValue = Math.max(...tenure_value);

        // In-line Text for 'Advertisement Trends'
        const tenure_with_highest_value = tenure_name[tenure_value.indexOf(tenure_maxValue)];
        document.getElementById('advertisement-tenure-max').innerText = tenure_with_highest_value;

        const organization_name = filteredData[0].organization;
        document.getElementById('org-name').innerText = organization_name;
        console.log(organization_name)

        const advertisement_count = filteredData.length;
        document.getElementById('org-advertisement-count').innerText = advertisement_count;
        console.log(advertisement_count)


        // X axis
        const x = d3.scaleBand()
        .range([0, width])
        .domain(tenure_name)
        .padding(0.2);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Update the y-axis
        y.domain([0, tenure_maxValue + 2]);
        yAxis.transition().call(d3.axisLeft(y));

        // Add Bars 
        const bars = svg.selectAll("rect")
            .data(tenure_value);
        bars.exit().remove(); // Remove bars not needed

        var nan_replace = 0; // Data suppression

        bars.enter().append("rect") // Create new bars
            .merge(bars) // Merge existing and new bars
            .attr("x", (d, i) => x(tenure_name[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d)) 
            .attr("fill", "#806c74");

    }

    // PLOT START
    // Run default plot
    bar_graph_tenure.updatePlot(uniqueorganizations[0])

}

document.addEventListener("DOMContentLoaded", bar_graph_tenure);

// Even Listener for Dropdowns
let dropdown_organization = [];
document.addEventListener("DOMContentLoaded", function () {
    // Access the dropdown element by ID
    const dropdown = document.getElementById("organization-select");
  
    // Attach an event listener to the dropdown element
    dropdown.addEventListener("change", function () {
        dropdown_organization = dropdown.value;
        bar_graph_tenure.updatePlot(dropdown_organization);
    });
  });