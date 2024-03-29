function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var url = `metadata/${sample}`;
  d3.json(url).then(function(data) {
    test_metadata = data;
    var metadata_id = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata_id.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    for (let [key, value] of Object.entries(test_metadata)) {
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`)
    }
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `samples/${sample}`;
  d3.json(url).then(function(data){
    var test_data = data;
    // @TODO: Build a Bubble Chart using the sample data
    var bubble_trace = {
      x: test_data["otu_ids"],
      y: test_data["sample_values"],
      text: test_data["otu_labels"],
      mode: 'markers',
      marker: {
        size: test_data["sample_values"],
        color: test_data["otu_ids"]}
    };
    var bubble_data = [bubble_trace];
    var bubble_layout = {
      title: "OTU ID and Sample Values",
      autosize: true,
      xaxis: {
        title: {
          text: "OTU ID"
        }
      },
      yaxis: {
        title: {
          text: "Sample Value"
        }
      }
    };
    Plotly.newPlot('bubble', bubble_data, bubble_layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    var top_10_ids = test_data["otu_ids"].slice(0,10);
    var top_10_values = test_data["sample_values"].slice(0,10);
    var top_10_labels = test_data["otu_labels"].slice(0,10);
    var pie_trace = {
      labels: top_10_ids, 
      values: top_10_values,
      hovertext: top_10_labels,
      type: "pie"
    };
    var pie_data = [pie_trace];
    var pie_layout = {
      title: "Pie Chart of Sample's Top 10 Values",
    };
    Plotly.newPlot("pie", pie_data, pie_layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();