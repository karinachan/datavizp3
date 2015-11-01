var GLOBAL = { data: [],
                countries:["United States", "Japan", "Germany","Britain","South Korea"],
                questions: [
                  {number: "Q27", answers: ["Number 1", "Number 2", "Not a problem", "Don't know", "Refused"]},
                  {number: "Q129", answers: ["Morally unacceptable", "Not a moral issue", "Refused", "Don't know"]}
                ]}
    var count = new Array(); // create an empty array

    var total_count = 0;

function run_viz1()
{
  console.log("run");
 var question = "Q27";
  var dat= getDataRows(function(data)
  {
    
    GLOBAL.data = data;
   
       //for every country, count up the things
  updateOverview(question);
  drawCircles(GLOBAL.countries);
  });
  

}




function updateOverview(question){

  GLOBAL.data.forEach(function(r) {  //for each row
  total_count += 1;
  GLOBAL.countries.forEach(function() { //for each country in data
  answer = r[question];
  country = r["COUNTRY"];
             

    if ("Number 1 – Homosexuality should be accepted by society".indexOf(answer) && (GLOBAL.countries.indexOf(country) !== -1)) { 

  if (country in count){ //if doesn't exist
   // console.log(count[r["COUNTRY"]]);
        num = count[country]+1; //increment value
        //console.log(num); 
         count[country]= num; //put back in
       
     } else {
      count[country]=1; //initialize as 1
      
     }
 
    }

      });
    
          
    });


}
  var numberIndex=0;

function drawCircles(selected_countries){
  console.log("hello");

 
  var svg = d3.select("#viz_1");
 
  var originX = 100;
var originY = 200;




  var index =0;
GLOBAL.countries.forEach(function(d){
 // console.log(d);
  var votes= count[d];
  //console.log(votes);
  var circles = svg.append("circle");
      circles.attr("cx",originX)
           .attr("cy", originY)
           .attr("r", votes*.008)
           .on("click", function(){seeCountryView(d)});
     
  originX+=(150);
  console.log("index"+index);
  index+=1;
});

} 




//add scale bar to see what the max response would be 
function seeCountryView(number){

  console.log(number);
 
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
          GLOBAL.data+=data;
    }});

}



// Read data from csv
function getDataRows(f)
{

loadCSV("america.csv", f);
loadCSV("apac.csv", f);
loadCSV("africa.csv",f);
loadCSV("europe.csv",f);
console.log("global" + GLOBAL.data);

}



