$(document).ready(function() {
	var fb = new Firebase("https://itsatrain.firebaseio.com/");

	var name = "";
	var destination = "";
	var firstTrainTime = "";
	var frequency = 0;

	var currentTime = moment().format('h:mm A');

	$('#currentTime').html("The time is now: " + currentTime)

	$("#addTrain").on("click", function() {
		name = $('#nameinput').val().trim();
		destination = $('#destinationinput').val().trim(); 
		firstTrainTime = $('#firstTraininput').val().trim();
		frequency = $('#frequencyinput').val().trim(); 

		fb.push({
			name: name,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency,
			dateAdded: Firebase.ServerValue.TIMESTAMP
		})

		return false;
	})

	fb.on("child_added", function(snapshot) {

		console.log("Train Name: " + snapshot.val().name);
		console.log("Destination: " + snapshot.val().destination);
		console.log("First Train: " + snapshot.val().firstTrainTime);
		console.log("Frequency: " + snapshot.val().frequency);

		var firstTrainMoment = moment(snapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
		var currentMoment = moment();
		var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
		var remainder = diffTime % snapshot.val().frequency;
		var minUntilTrain = snapshot.val().frequency - remainder;
		var nextTrain = moment().add(minUntilTrain, "minutes");

		console.log("Next Train Time: " + moment(nextTrain).format("hh:mm A"));
		console.log("Minutes Until: " + minUntilTrain);
		console.log("====================");

		$('#display').append("<tr><td id='nameDisplay'>" + snapshot.val().name +
			"</td><td id='destinationDisplay'>" + snapshot.val().destination +
			"</td><td id='frequencyDisplay'>" + "Every " + snapshot.val().frequency + " mins" +
			"</td><td id='nextArrivalDisplay'>" + moment(nextTrain).format("hh:mm A") +
			"</td><td id='minutesAwayDisplay'>" + minUntilTrain + " minutes until arrival</td>");


	}, function (errorObject) {

	  	console.log("The read failed: " + errorObject.code);

	});
});