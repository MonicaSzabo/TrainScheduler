$(document).ready(function() {
	var fb = new Firebase("https://itsatrain.firebaseio.com/");

	//Variables for the initial case, will hold user data
	var name = "";
	var destination = "";
	var firstTrainTime = "";
	var frequency = 0;

	var trainIDs = [];		//Holds the keys for each train to be used in removal and edits
	var globalIndex = 0;	//Used to keep track of which element for removal and editing

	//Displays the current time
	var currentTime = moment().format('h:mm A');
	$('#currentTime').html("The time is now: " + currentTime)

	//When you add a train to the database
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
		});

		//Reload needed for the removal to work on last element
		location.reload();
		return false;
	})

	//When you click on the remove buttons, it gets the row it's on and deletes it from the database
	$(document.body).on('click', '.remove', function(){

		var num = $(this).attr('data-indexNum');
		fb.child(trainIDs[num]).remove();

		//Must reload to show the database changes on the page
		location.reload();
	});

	//When you click on the edit button, it asks you for each item again and sets it to the database
	$(document.body).on('click', '.edit', function(){

		var num = $(this).attr('data-indexNum');

		name = prompt("What do you want the name to be?");
		destination = prompt("What do you want the destination to be?");
		firstTrainTime = prompt("What time did the first train arrive? (HH:mm)");
		frequency = prompt("How often does it arrive?");


		fb.child(trainIDs[num]).set({
			name: name,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency
		});

		//Must reload to show the database changes on the page
		location.reload();
	});

	//Will display changes when there are children added to the database
	fb.on("child_added", function(snapshot) {
		console.log("Train Name: " + snapshot.val().name);
		console.log("Destination: " + snapshot.val().destination);
		console.log("First Train: " + snapshot.val().firstTrainTime);
		console.log("Frequency: " + snapshot.val().frequency);

		//Calculating the next train arrival time and the minutes until it arrives
		var firstTrainMoment = moment(snapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
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
			"</td><td id='minutesAwayDisplay'>" + minUntilTrain + " minutes until arrival" +
			"</td><td id='editbuttons'><button class='remove' data-indexNum=" + globalIndex + " title='Remove Train?'><div class='glyphicon glyphicon-trash'></div></button> " +
			"<button class='edit' data-indexNum=" + globalIndex + " title='Edit Train?'><div class='glyphicon glyphicon-pencil'></div></button></td>");

		globalIndex++;

	}, function (errorObject) {

	  	console.log("The read failed: " + errorObject.code);

	});

	//Gets the train IDs in an Array
	fb.once('value', function(dataSnapshot){ 
    	var indexofTrains = 0;

        dataSnapshot.forEach(
            function(childSnapshot) {
                trainIDs[indexofTrains++] = childSnapshot.key();
            }
        );
    });


});