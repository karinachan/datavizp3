var GLOBAL = { data: [],
                countries: ["UNITED STATES"],
                questions: [
                  {number: "Q128", answers: ["Major problem", "Minor problem", "Not a problem", "Don't know", "Refused"]},
                  {number: "Q129", answers: ["Very confident", "Somewhat confident", "Not too confident", "Not confident at all", "Don’t know", "Refused"]}
                ]}

function run_viz2()
{
  console.log("run");

  getDataRows(function(data)
  {
    console.log("question");
    GLOBAL.data = data;
    var question = "Q128";
    var selected_countries = ["United States", "Argentina"]

    percentages = run_calculations(question, selected_countries);
    console.log(percentages);

    create_viz(question, percentages)
  });
}

// Draw the pie chart
function create_viz(question, percentages)
{
  console.log("create_viz");

  var svg = d3.select("#viz_2");

  // Margins
  var height = svg.attr("height");
  var width = svg.attr("width");
  var margin_y = 100;
  var margin_x = 100;

  // Title
  svg.append("text")
    .attr("id","title")
    .attr("x", width/2)
    .attr("y", margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text(question);

  // Wedges
  // svg.append("path")
    // .attr("d", "M100,0 C100,0 200,50 200,100 L100, 100")

  var counter = 0;
  var radius = (height - 2*margin_y) / 2;
  var theta_prev = 0;
  for (answer in percentages)
  {
    value = percentages[answer];

    // Wedge shape
    var theta_new = value * Math.PI * 2 / 100;
    var center_x = width/2;
    var center_y = height/2;
    var x_0 = radius * Math.sin(theta_prev) + center_x;
    var y_0 = -1*radius * Math.cos(theta_prev) + center_y;
    var x_m = radius * Math.sin(theta_prev + (theta_new/2)) + center_x;
    var y_m = -1*radius * Math.cos(theta_prev + (theta_new/2)) + center_y;
    var x_f = radius * Math.sin(theta_prev + theta_new) + center_x;
    var y_f = -1*radius * Math.cos(theta_prev + theta_new) + center_y;
    var path_string = "M"+x_0+","+y_0+
                      " C"+x_0+","+y_0+" "+x_m+","+y_m+" "+x_f+","+y_f+
                      " L"+center_x+","+center_y;
    // var path_string = "M"+x_0+","+y_0+
    //                   " A" + x_0 + "," + y_0 + " 0 0,1 " + x_f + "," + y_f +
    //                   " L"+center_x+","+center_y;

    svg.append("path")
      .attr("d", path_string);

    theta_prev += theta_new;
    // return
  }

}

// Read data from csv
function getDataRows(f)
{
  console.log("get data");
  d3.csv("america.csv", function(error, data){
        if (error)
        {
          //If error is not null, something went wrong.
          // console.log(error);  //Log the error.
        }
        else
        {
          //If no error, the file loaded correctly. Yay!
          console.log(data);   //Log the data.
          f(data);
        }
  });
  console.log("end of data");
}

// Returns an array of percentages for each of the answers
function run_calculations(question, selected_countries)
{
  console.log("run Calculate");

  var country_data = {}

  for (var country_index in selected_countries)
  {
    // console.log(question + " , " + selected_countries[country]);
    var country = selected_countries[country_index];
    country_data[country] = count_answers(question, country);
  }

  // console.log(country_data);

  var percentages = {}
  var total = 0;
  for (country in country_data)
  {
    // console.log(country);
    for (answer in country_data[country])
    {
      var num_answers = country_data[country][answer]
      total += num_answers;
      if (answer in percentages)
      {
        percentages[answer] += num_answers;
      }
      else
      {
        percentages[answer] = num_answers;
      }
    }
  }
  for (answer in percentages)
  {
    percentages[answer] = percentages[answer] * 100 / total;
  }

  return percentages;
}


// Count up the number of each answer for the specified question,
// for the given country
function count_answers(question, country)
{
  console.log("count answers");
  var total_counts = {}
  GLOBAL.data.forEach(function(r)
  {
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

  return total_counts;

}
