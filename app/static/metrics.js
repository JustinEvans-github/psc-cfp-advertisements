import * as utils from './utils.js';

function text_metrics() {

    // Data
    const jsonData = window.chartData;

    // cConvert JSON data to an array of objects
    const data = Object.keys(jsonData["organization_e"]).map((key) => ({
    classifications: jsonData["classifications"][key],
    organization: jsonData["organization_e"][key],
    creation_date_month: jsonData["creation_date_month"][key],
    total_submitted: jsonData["total_submitted_sup"][key],
    fiscal_year: jsonData["fiscal_year"][key],
    }));

    // OVERALL PUBLIC SERVICE METRICS

    // advertisement count
    var advertisement_count = data.length;
    document.getElementById('advertisement-count').innerText = advertisement_count;

    // organization count
    const uniqueorganizations = [...new Set(data.map(d => d.organization))];
    var organization_count = uniqueorganizations.length;
    document.getElementById('organization-count').innerText = organization_count;

    // fiscal year
    const uniquefiscalyear = [...new Set(data.map(d => d.fiscal_year))];
    var fiscal_year = uniquefiscalyear[0];
    document.getElementById('fiscal-year').innerText = fiscal_year;

    // job postings per organization
    const applications_per_organization = {}; 
    uniqueorganizations.forEach(organization => {
        applications_per_organization[organization] = 0;
        });

    data.forEach((item) => {
        const organization = item.organization;
        if (applications_per_organization[organization]) {
            applications_per_organization[organization]++; 
        } else {
            applications_per_organization[organization] = 1;
        }
    });

    // data to pass to in-line text
    const organization_values = Object.values(applications_per_organization);
    const organization_values_max = Math.max(...organization_values);
    document.getElementById('organization-count-max').innerText = organization_values_max;

    const organization_count_median = utils.calculateMedian(organization_values);
    document.getElementById('organization-count-median').innerText = organization_count_median;

    const organization_count_max_id = utils.findKeyOfMaxValue(applications_per_organization)
    document.getElementById('organization-of-count-max').innerText = organization_count_max_id;


    // DROPDOWNS
    
    // organizations
    const org_Select = d3.select("#organization-select");
    org_Select.selectAll("option")
    .data(uniqueorganizations)
    .enter().append("option")
    .text(d => d);

    // fiscal years
    const fiscal_year_Select = d3.select("#fiscal-year-select");
    fiscal_year_Select.selectAll("option")
    .data(uniquefiscalyear)
    .enter().append("option")
    .text(d => d);

}

text_metrics()
