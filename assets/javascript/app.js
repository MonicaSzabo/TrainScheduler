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

		console.log(snapshot.val().name);
		console.log(snapshot.val().destination);
		console.log(moment(snapshot.val().firstTrainTime).format('HH:mm'));
		console.log(snapshot.val().frequency);

		$('#display').append("<tr><td id='nameDisplay'>" + snapshot.val().name +
			"</td><td id='destinationDisplay'>" + snapshot.val().destination +
			"</td><td id='frequencyDisplay'>" + "Every " + snapshot.val().frequency + " mins" +
			"</td><td id='nextArrivalDisplay'>" +
			"</td><td id='minutesAwayDisplay'></td>");


	}, function (errorObject) {

	  	console.log("The read failed: " + errorObject.code);

	});
});