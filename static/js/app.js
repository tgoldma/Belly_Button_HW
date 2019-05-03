function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadataSamp = `/metadata/${sample}`;
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(metadataSamp).then(function(sample){
    var sampleMetaData = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
    sampleMetaData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]){
      var row = sampleMetaData.append("p");
      row.text(`${key}:${value}`)
      })
    });
}
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartData = `/samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(chartData).then(function(data){
      var xVal = data.otu_ids;
      var yVal = data.sample_values;
      var textVal = data.otu_labels;
      var size = data.sample_values;
      var markColor = data.otu_ids;
  
      var trace1 = {
        x: xVal,
        y: yVal,
        text: textVal,
        mode: 'markers',
        marker: {
          size: size,
          color: markColor
        }
      };
    
      var data = [trace1];
      var layout = {
        title: "Belly Button Bacteria",
        xaxis: {title: "OTU ID"}
      };
  
      Plotly.newPlot("bubble", data, layout);
  
    // @TODO: Build a Pie Chart
    d3.json(chartData).then(function(data){
      var values = data.sample_values.slice(0, 10); 
      var labels = data.otu_ids.slice(0, 10);
      var display = data.otu_labels.slice(0, 10); 
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieChart = [{
      values: values,
      labels: labels,
      hovertext: display,
      type: "pie"
    }];
    Plotly.newPlot("pie", pieChart);
    });
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
