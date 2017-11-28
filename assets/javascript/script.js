// opens and configs firebase database
var config = {
	apiKey: "",
	authDomain: "trainstrainstrains-187402.firebaseapp.com",
	databaseURL: "https://trainstrainstrains-187402.firebaseio.com",
	projectId: "trainstrainstrains-187402",
	storageBucket: "trainstrainstrains-187402.appspot.com",
	messagingSenderId: "694101263935"
};

firebase.initializeApp(config);

var database = firebase.database();


// Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(),"HH:MM").format("X");
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    freq: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.start);
  console.log(newTrain.freq);

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

  // Prettify the train start
  var trainStartPretty = moment.unix(trainStart).format("HH:MM");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainStartPretty + "</td><td>" + trainFreq + "</td></tr>");
});


// dynamically updating date line
var datetime = null;
var    date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format("ddd, MMM DD 'YY, h:mm:ss a"));
};

$(document).ready(function(){
    datetime = $("h2")
    update();
    setInterval(update, 1000);
});