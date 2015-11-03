// Javascript file for handling old people visualization
// Must use server: python -m SimpleHTTPServer 8080

var GLOBAL = { data: [],

                colors: ["#3DCFFF", "#06C1FF", "#0099CC", "#006587", "#01394B", "#00171F", "#000000"],
                america_countries: ["United States", "Brazil", "Argentina"],
                // europe_countries: ["Britain", "France", "Germany", "Italy", "Russia", "Spain", "Turkey"],
                // asia_countries: ["China", "Indonesia", "Japan", "Pakistan", "South Korea"],
                country_options: ["China", "Pakistan", "South Korea", "Germany", "Russia", "Turkey"],
                selected_countries: [],
                question: "Q128",
              }

// Initialize the visualization
// Load data and initialize event listeners
function initialize_viz2()
{
  // Initialize listener for dropdown menu
  var selected_question = document.getElementById("question_select2");
  selected_question.addEventListener("change", function() {
    clear_viz();
    // Update the variable that store the selected question
    GLOBAL.question = selected_question.value;
    // Update the visualization
    update_viz2()
  });

  // Load the data

  readCSV(function(data) {  });

}

// Read data from csv
function readCSV(f)
{
  // Get europe and asia data
  d3.csv("europe.csv", function(error1, data1) {
    d3.csv("apac.csv", function(error2, data2) {
      if (error2)
      {
        //If error is not null, something went wrong.
         console.log(error2);  //Log the error.
      }
      else
      {
        // add the new data to GLOBAL.data
         GLOBAL.data.push.apply(GLOBAL.data, data2)
      }
    });
    if (error1)
    {
      //If error is not null, something went wrong.
       console.log(error1);  //Log the error.
    }
    else
    {
      // add the new data to GLOBAL.data
       GLOBAL.data.push.apply(GLOBAL.data, data1)
     }
  });

}

// Clear the existing visualization
function clear_viz()
{
  var svg = document.getElementById("viz_2");
  // Delete all elements in the svg
  while (svg.lastChild)
  {
      svg.removeChild(svg.lastChild);
  }
}

// Checks whenever a checkbox has been clicked
// and updates the viz accordingly
function check_changed()
{
  clear_viz()

  // Reset the list of selected countries
  GLOBAL.selected_countries = [];

  // Fill the list up with all countries that are checked
  for (country_index in GLOBAL.country_options)
  {
    var country = GLOBAL.country_options[country_index]
    if (document.getElementById(country).checked === true)
    {
      GLOBAL.selected_countries.push(country)
    }
  }

  // Update the visualization
  update_viz2()
}

// Calculates percentages and builds graph
// based on the variables stored in the GLOBAL variable.
// Called every time it should be updated
function update_viz2()
{
  percentages = run_calculations(GLOBAL.question, GLOBAL.selected_countries);
  create_viz(GLOBAL.question, percentages)
}

// Returns an array of percentages for each of the answers
function run_calculations(question, selected_countries)
{
  var country_data = {}

  // Counts number of each answer for each of the selected countries
  for (var country_index in selected_countries)
  {
    var country = selected_countries[country_index];
    country_data[country] = count_answers(question, country);
  }

  // Add up numbers for all countries and find total number of responces
  var totals = {}
  var total = 0;
  var counter = 0;
  for (country in country_data)
  {
    for (answer in country_data[country])
    {
      var num_answers = country_data[country][answer]
      total += num_answers;
      if (answer in totals)
      {
        totals[answer]["value"] += num_answers;
      }
      else
      {
        // Store all information necessary for displaying later
        totals[answer] = {}
        totals[answer]["answer"] = answer;
        totals[answer]["value"] = num_answers;
        totals[answer]["index"] = counter;
        counter++;
      }
    }
  }

  // Calculate percentages by dividing by total
  percentages = []
  for (answer in totals)
  {
    totals[answer]["value"] = totals[answer]["value"] * 100 / total;
    percentages.push(totals[answer])
  }

  //  return array instead of json, so that we can bind the data
  return percentages;
}

// Count up the number of each answer for the specified question,
// for the given country
function count_answers(question, country)
{
  var total_counts = {}
  GLOBAL.data.forEach(function(r)
  {
    // If the country of the data row is the desired country
    if (r.COUNTRY == country)
    {
      var answer = r[question];
      if (answer in total_counts)
      {
        total_counts[answer]++; // increment counter
      }
      else
      {
        total_counts[answer] = 1; // initialize category
      }
    }
  });
  // total_counts is a json where the answer is the key
  // and the total number of the particular answer is the value
  return total_counts;
}

// Draw the pie chart for the given question,
// passing in an array of percentages and other answer properties
function create_viz(question, percentages)
{
  var svg = d3.select("#viz_2");

  // Margins
  var height = svg.attr("height");
  var width = svg.attr("width");
  var margin_y = 100;
  var margin_x = 100;
  // Wedge size variables
  var radius = (height - 2*margin_y) / 2;
  var radius_in = radius/2;
  var theta_prev = 0;

  // Title
  svg.append("text")
    .attr("id","title")
    .attr("x", width/2)
    .attr("y", margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text(question);

  // Caption
  var caption = svg.append("text")
    .attr("x", width/2)
    .attr("y", height - margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text("Hover over wedges to see label and percentage information");

  // Create wedges
  var wedges = svg.selectAll("path")
    .data(percentages) // bind data
    .enter()
    .append("path") // Make wedge out of path objects
    .attr("d", function(d){
      // Function to calculate wedge shape based on data
      value = d["value"];
      // Wedge shape
      var theta_new = value * Math.PI * 2 / 100;
      var center_x = width/2;
      var center_y = height/2;
      var x_0 = radius * Math.sin(theta_prev) + center_x;
      var y_0 = -1*radius * Math.cos(theta_prev) + center_y;
      var x_0_in = radius_in * Math.sin(theta_prev) + center_x;
      var y_0_in = -1*radius_in * Math.cos(theta_prev) + center_y;
      var x_f = radius * Math.sin(theta_prev + theta_new) + center_x;
      var y_f = -1*radius * Math.cos(theta_prev + theta_new) + center_y;
      var x_f_in = radius_in * Math.sin(theta_prev + theta_new) + center_x;
      var y_f_in = -1*radius_in * Math.cos(theta_prev + theta_new) + center_y;
      if (theta_new < Math.PI)
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 0,1 " + x_f + "," + y_f +
                          " L"+x_f_in+","+y_f_in +
                          " A" + radius_in + "," + radius_in + " 0 0,0 " + x_0_in + "," + y_0_in;
      }
      else // path needs different of params for theta > 180 degrees
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 1,1 " + x_f + "," + y_f +
                          " L"+x_f_in+","+y_f_in +
                          " A" + radius_in + "," + radius_in + " 0 1,0 " + x_0_in + "," + y_0_in;
      }
      // This is to account for the offset of where to start subsequent wedges
      theta_prev += theta_new;
      return path_string;
    })
    .attr("fill", function(d){
      return GLOBAL.colors[d["index"]];
    })
    .attr("stroke", "#000000")
    .on("mouseover",function(d) {
      // When mouseover, change wedge color and display caption info
      this.style.fill = "#778888";
      caption.text(d["answer"] + ": " + Math.round(d["value"]) + "%");
  	})
    .on("mouseout",function(d) {
      // Reset to standard color and reset caption
      this.style.fill = GLOBAL.colors[d["index"]];
      caption.text("Hover over wedges to see label and percentage information");
    });
}
