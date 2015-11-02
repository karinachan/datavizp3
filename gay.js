var GLOBAL1 = { data: [],
                countries:["Japan","Malaysia","South Korea", "Britain","Germany"],
                current:"Q84D",
                questions: [{"Q27": ["Number 1 � Homosexuality should be accepted by society", "Number 2 � Homosexuality should not be accepted by society", "Don't know", "Refused"]},
                {"Q84D": ["Morally acceptable","Morally unacceptable", "Not a moral issue", "Depends on the situation","Refused", "Don't know"]}]};
               //   {"Q27": ["Number 1 – Homosexuality should be accepted by society", "Number 2 – Homosexuality should not be accepted by society", "Don't know", "Refused"]},
                 // 
              //  ]}
    var count = new Array(); // create an empty array

    var activeQ = 1; //swap this out when you switch to Q84d
    var curr_question = "Q84D";
function run_viz1()
{ 
  GLOBAL1.data="";
  count=new Array();
  console.log("run");
  question=curr_question.toString();
//  question = "Q84D";
  var dat= getDataRows(function(data)
  {
    
    GLOBAL1.data = data;
    
       //for every country, count up the things
  updateOverview(question);
  drawCircles(question);
  });
  

}

function changeQuestion(){
  if (activeQ==0){
    activeQ=1;
    var prevQ="Q27";
    var nextQ="Q84D";
  } else if (activeQ==1){
    activeQ=0;
    var prevQ="Q84D";
    var nextQ="Q27";
  }

  console.log(document.getElementById("question_select1").value);
  curr_question=document.getElementById("question_select1").value;
  document.getElementById("question_select1").innerHTML="Switch to "+prevQ;
  console.log("the next question"+nextQ);
  document.getElementById("question_select1").value=prevQ;
  console.log("changed?"+document.getElementById("question_select1").value);
  run_viz1();
}
function updateOverview(question){

  GLOBAL1.data.forEach(function(r) {  //for each row

  GLOBAL1.countries.forEach(function() { //for each country in data
  answer = r[question];
  country = r["COUNTRY"];
  //console.log("what is question"+question);
  yeskey= GLOBAL1.questions[activeQ][question][0]; //accessing the correct column
  //stupid symbols for - :( 

    
if ((GLOBAL1.countries.indexOf(country) !== -1)) {

 
 
//if the country is in the list of selected countries, log the count of votes
if (country in count){ //if count exists already for a country
  if (answer in count[country]){
    var num = count[country][answer]+1;
    count[country][answer]=num;
    var num = count[country]["total"]+1;
count[country]["total"]=num;
  } else {
count[country][answer]=1;
var num = count[country]["total"]+1;
count[country]["total"]=num;
}
} else {
  count[country]=new Array();
  count[country][answer]=1;
  count[country]["total"]=1;
}
    }

      });
    
          
    });


}
  var numberIndex=0;

function drawCircles(question, answercheck){
  console.log("hello");
  console.log("asnwercheck"+ answercheck);
  if (answercheck!==undefined) {yeskey= answercheck;}

  var svg = d3.select("#viz_1");
svg.selectAll("*").remove();
  // Margins
  var height = svg.attr("height");
  var width = svg.attr("width");
  var margin_y = 100;
  var margin_x = 100;
  // Wedge size variables
  var radius = (height - 2*margin_y) / 2;
  var theta_prev = 0;

  // Title
  svg.append("text")
    .attr("id","title")
    .attr("x", width/2)
    .attr("y", margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text(question +" for "+GLOBAL1.countries.join(", "));

  // Caption
  var caption = svg.append("text")
    .attr("x", width/2)
    .attr("y", height - margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text("Click to see more information about a particular country.");
  var originX = 100;
var originY = 200;

  var index =0;
//  console.log(count);
//title
 svg.append("text")
    .attr("id","title")
    .attr("x", width/2)
    .attr("y", margin_y/2+50)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text("Total percentage of answers for "+yeskey);


GLOBAL1.countries.forEach(function(d){
  if (count[d]===undefined){
    //console.log("skipped");
  } else {
  var votes= count[d][yeskey]/count[d]["total"];

  console.log(votes);

var scale = 50;

 // Title
 

var labels = svg.append("text")
  labels.attr("x", originX-25)
    .attr("y", originY+75)
    .attr("dy", ".35em")
    .text(function() {return d; });


var bigcircles = svg.append("circle"); //for reference, if 100% all believed 
      bigcircles.attr("cx",originX)
           .attr("cy", originY)
           .attr("r", scale)
           .attr("stroke","black")
        .attr("fill", "white")
        .on("click", function(){svg.selectAll("*").remove(); seeCountryView(d)});

  var circles = svg.append("circle");
      circles.attr("cx",originX)
           .attr("cy", originY)
           .attr("r", votes*scale)
           .attr("stroke","black")
        .attr("fill", "black")
           .on("click", function(){svg.selectAll("*").remove(); seeCountryView(d)});

  
     
  originX+=(150);
  console.log("index"+index);
  index+=1;}
});

} 


function create_viz(question, country, percentages)
{
  
console.log("pie chart here");
var svg = d3.select("#viz_1");
  console.log(percentages);
  // Margins
  var height = svg.attr("height");
  var width = svg.attr("width");
  var margin_y = 100;
  var margin_x = 100;
  // Wedge size variables
  var radius = (height - 2*margin_y) / 2;
  var theta_prev = 0;

  // Title
  svg.append("text")
    .attr("id","title")
    .attr("x", width/2)
    .attr("y", margin_y/2)
    .attr("dy","0.3em")
    .style("text-anchor","middle")
    .text(question +" for "+country);

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
      answer = d["answer"];
      console.log(answer+"answer");
      value = d["value"];
      console.log("value"+value);
      // Wedge shape
      var theta_new = value * Math.PI * 2 / 100;
      var center_x = width/2;
      var center_y = height/2;
      var x_0 = radius * Math.sin(theta_prev) + center_x;
      var y_0 = -1*radius * Math.cos(theta_prev) + center_y;
      var x_f = radius * Math.sin(theta_prev + theta_new) + center_x;
      var y_f = -1*radius * Math.cos(theta_prev + theta_new) + center_y;
      if (theta_new < Math.PI)
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 0,1 " + x_f + "," + y_f +
                          " L"+center_x+","+center_y;
      }
      else // path needs different of params for theta > 180 degrees
      {
        var path_string = "M"+x_0+","+y_0+
                          " A" + radius + "," + radius + " 0 1,1 " + x_f + "," + y_f +
                          " L"+center_x+","+center_y;
      }
      // This is to account for the offset of where to start subsequent wedges
      theta_prev += theta_new;
      return path_string;
    })
     .attr("fill", function(d){
      return '#'+Math.random().toString(16).substr(-6);
       //return GLOBAL.colors[d["index"]];
     })
    .attr("stroke", "#000000")
    .on("mouseover",function(d) {
      // When mouseover, change wedge color and display caption info
      //this.style.fill = "#778888";
      caption.text(d["answer"] + ": " + Math.round(d["value"]) + "%");
    })
    .on("click",function(d){svg.selectAll("*").remove(); console.log(d),drawCircles("Q27", d["answer"]);})
    .on("mouseout",function(d) {
      // Reset to standard color and reset caption
      //this.style.fill = GLOBAL.colors[d["index"]];
      //this.style.fill='#'+Math.random().toString(16).substr(-6);
      caption.text("Hover over wedges to see label and percentage information");
    });
   
}




//add scale bar to see what the max response would be 
function seeCountryView(country){
   
  if (activeQ===0){ var question = "Q27";}
  else if(activeQ==1){var question = "Q84D";}
 
  var percentages=[];
  for (i=0; i<GLOBAL1.questions[activeQ][question].length; i++){
  var value= GLOBAL1.questions[activeQ][question][i]; //accessing the correct column
  var valvotes=  (Math.ceil(count[country][value]/count[country]["total"] * 100) / 100)*100;
  if (isNaN(valvotes)){ //if percentage is pretty small, don't show
    valvotes=0; //NOT SURE WHY PIE CHART ISN'T FULL
}
  percentages[i]={"answer":value, "value":valvotes};}

//percentages 
console.log(percentages);

for (i in percentages){
  console.log("answer"+percentages[i]["answer"]);
  console.log("value"+percentages[i]["value"]);
}

  create_viz(question,country, percentages)
 
}


var loadCSV = function(file, f){
    d3.csv(file, function(error, data) {
        if (error)
        {
          //If error is not null, something went wrong.
           console.log(error);  //Log the error.
        }
        else
        {
           console.log(data);   //Log the data.
           f(data);
          GLOBAL1.data+=data;
    }});

}



// Read data from csv
function getDataRows(f)
{
//so slow
//loadCSV("america.csv", f);
loadCSV("apac.csv", f);
//loadCSV("africa.csv",f);
loadCSV("europe.csv",f);
console.log("global" + GLOBAL1.data);

}



