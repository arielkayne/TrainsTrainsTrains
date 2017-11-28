// reloads page every 10 seconds...hacky to get stuff to work
setTimeout(function(){
   window.location.reload(1);
}, 10000);


// opens and configs firebase database
var config = {
	apiKey: "AIzaSyB4GgSO2B1F3nSxCAxL5LSA6Xr0Kc_wSD8",
	authDomain: "trainstrainstrains-187402.firebaseapp.com",
	databaseURL: "https://trainstrainstrains-187402.firebaseio.com",
	projectId: "trainstrainstrains-187402",
	storageBucket: "trainstrainstrains-187402.appspot.com",
	messagingSenderId: "694101263935"
};
firebase.initializeApp(config);
var database = firebase.database();


// dynamically updating date line
var dateTimeJumbotron = null;
var date = null;
var update = function () {
    date = moment(new Date())
    dateTimeJumbotron.html(date.format("ddd, MMM DD 'YY, h:mm:ss a"));

};
$(document).ready(function(){
    dateTimeJumbotron = $("h2")
    update();
    setInterval(update, 1000);
});


// Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(),"HH:mm").format("X");
  var trainFreq = $("#frequency-input").val().trim();


  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    freq: trainFreq,
    next: nextTrain
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.dest);
  // console.log(newTrain.start);
  // console.log(newTrain.freq);
  // console.log(newTrain.next);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

  // want to take current time, start time...eliminate which "day" matters and use to calculate next train
  var thisTime = moment(); 


  // if first train is in future, then simple subtraction...need to figure out how to get rid of the "date"

  // else you do repeating math to come up with answer and use nextCalc as var that updates the table

  var nextCalc = "";
  var currTime = moment().unix();
  console.log(currTime);

// current time-start time...this gives elapsed time
// take answer and divide by frequency...this leaves a remainder
// divide remainder into frequency...this gives minutes elapsed since last train
// subtract minutes elapsed from frequency...gives minutes remaining till next train
  
  var elapsedTime = moment(currTime - trainStart);
  console.log("elapsedTime: "+elapsedTime);

  var remainderTime = (elapsedTime%(trainFreq*60));
  console.log("remainderTime: "+remainderTime);

  var elapsedMinutes = remainderTime/(trainFreq*60);
  console.log("elapsedMinutes: "+elapsedMinutes);

  var timeLeft = (trainFreq*60)-(trainFreq*elapsedMinutes*60);
  console.log("timeLeft: "+timeLeft+" seconds");

  var minLeft = Math.floor(timeLeft/60);
  console.log("minLeft: "+minLeft+" minutes");

  nextCalc=minLeft;

  // Prettify the train start
  var trainStartPretty = moment.unix(trainStart).format("HH:mm");
  console.log(trainStartPretty);
  console.log(trainStart);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainStartPretty + "</td><td>" + trainFreq + "</td><td>"+ nextCalc +"</tr>");
});
