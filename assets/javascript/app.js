 
// Database Configuration

 var config = {
    apiKey: "AIzaSyCwdCh7xvqrJ2grSVKQXahQp9rV42Pe1uY",
    authDomain: "rockpaperscissor-63079.firebaseapp.com",
    databaseURL: "https://rockpaperscissor-63079.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "923834551924"
  };

  firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();
var ref = database.ref();
var playerRef = database.ref("players");
sessionStorage.setItem("thisPlayer", 0); 
sessionStorage.setItem("otherPlayer", 0);
var thisPlayerGV;
var otherPlayerGV;
var mydata = {};
var enemydata ={};
var myref;
var enemyref;
var mydivId;
var enemydivId;


$(document).ready(function() {

$("#submitbtn").on('click',adduser);

$('.ListPlayer').on('click','.answer-button', function(e){
	console.log("hahaha");

	buttonselected(e);
});

function adduser(){

	var newuser = $("#name").val().trim();
	console.log("user  "+newuser);

	//checking to see if there are more than two player playing
	//seting the players position
	playerRef.once("value", function(snapshot) {
		var length = snapshot.numChildren();
		var key;
		if(length == 1){ 
			snapshot.forEach(function(childSnapshot) {
    		key = childSnapshot.key;
   		});
   			if(key == 1){
   				sessionStorage.setItem("thisPlayer", 2); 
				sessionStorage.setItem("otherPlayer", 1);	
   			} else if(key == 2) {
   				sessionStorage.setItem("thisPlayer", 1);
				sessionStorage.setItem("otherPlayer", 2);
			}
		} else if(length == 0){
			sessionStorage.setItem("thisPlayer", 1);
			sessionStorage.setItem("otherPlayer", 2);
		}

		thisPlayerGV = sessionStorage.getItem("thisPlayer");
		otherPlayerGV = sessionStorage.getItem("otherPlayer");


		if (length > 1){
			alert("Already two players Playing");
			return;
		} else {

			playerRef.push({
        		name: newuser,
        		wins: 0,
        		losses: 0
    		});//set the value
    	$(".playerName").html("<h2> Welcome "+newuser+" You are player" + sessionStorage.getItem("thisPlayer") +" </h2>");
    	$("#NamePlayer"+sessionStorage.getItem("thisPlayer")).html(newuser + "ready");
		}
	});

}; //add user


// when a child is added removing the firebase generated key and assigning 
// either "1" or "2" 
playerRef.on("child_added", function(snapshot, prevChildKey)
{
	//debugger;
	var usersKey = snapshot.key;
	var Lthisplayer = sessionStorage.getItem("thisPlayer");

	if(!((usersKey == "1")  || (usersKey == "2")) ){ 

		//this if statement is to skip the inital run
		//change the key Firebase generated key 
	
		//debugger;

		if (prevChildKey == 1) { 
			var Vchild = playerRef.child(usersKey); 
			playerRef.child(2).set(snapshot.val());
			Vchild.remove();
			//var this player will be used 
			
		} else { 
			var Vchild = playerRef.child(usersKey); 
			playerRef.child(1).set(snapshot.val());
			Vchild.remove();		
		}

		playerRef.once("value", function(snapshot) {
			var length = snapshot.numChildren();
			if(length == 2){
				console.log("playgame");
				playgame();
			}
		});
	}

}); //on child added

//Capturing when window is closed and removing the object from firebase
window.onbeforeunload = confirmExit;
function confirmExit()
{
	var Lthisplayer = sessionStorage.getItem("thisPlayer");
  	//debugger;
  	if(Lthisplayer == 2 ){
  		playerRef.child(2).remove();
  	}
  	if(Lthisplayer == 1){
  		playerRef.child(1).remove();
  	}
}

function playgame()
{
	console.log("this  " + thisPlayerGV);
	console.log("other  "+ otherPlayerGV);
	mydivId = "Player"+thisPlayerGV;
	enemydivId = "Player"+otherPlayerGV;
	
	myref = database.ref("players/"+thisPlayerGV);
	enemyref = database.ref("players/"+otherPlayerGV);
		

	database.ref("turn").remove();
	database.ref("players/"+thisPlayerGV+'/display').remove();

	//get my Player information and populate my div
	myref.once("value", function(snapshot) {
		mydata = {
			name: snapshot.val().name,
			wins: snapshot.val().wins,
			losses: snapshot.val().losses
		}	
	});
	myref.child('choice').remove();
	
	$("#Name"+mydivId).html("You are " + mydata.name);
	$("#Score"+mydivId).html("Wins: " + mydata.wins + ", Losses: " +mydata.losses);
	$("#List"+mydivId).html('<button class="answer-button" id="button" data-name="Rock">' +"Rock" + '</button>');
	$("#List"+mydivId).append('<button class="answer-button" id="button" data-name="Paper">' +"Paper" + '</button>');
	$("#List"+mydivId).append('<button class="answer-button" id="button" data-name="Scissor">' +"Scissor" + '</button>')

	//get other Player information and populate enemydiv 
	enemyref.once("value", function(snapshot) {
		enemydata = {
			name: snapshot.val().name,
			wins: snapshot.val().wins,
			losses: snapshot.val().losses
		}	
	});

	$("#Name"+enemydivId).html("You are playing against "+enemydata.name);
	$("#Score"+enemydivId).html("Wins: " + enemydata.wins+", Losses: "+ enemydata.losses);

}

function buttonselected(e){
	console.log("Button Selecter");
	var answer = $(e.target).data("name");
	$("#List"+mydivId).html(answer);
	myref.update({
		choice: answer
	});

    //recording number of people who choose 
	ref.once("value", function(snapshot){
		if (snapshot.child("turn").exists()) {
			ref.update({
				turn:2,
			});
		} else {
			ref.update({
				turn:1,
			});
			$("#List"+mydivId).append("Waiting for the other");
		}
	});
} //button selected 


//eventlistener to see on turns to see if both have selected
database.ref("turn").on("value", function(snapshot) {
	console.log("turn"+snapshot.val());
	if (snapshot.val() == 2){ //if turn=2 then both the player selected 
		console.log("start comparing");
		
		enemyref.once("value", function(snapshot) {
			enemydata = {
			name: snapshot.val().name,
			choice: snapshot.val().choice
			}	
		});
		myref.once("value", function(snapshot) {
			mydata = {
				name: snapshot.val().name,
				wins: snapshot.val().wins,
				losses: snapshot.val().losses,
				choice: snapshot.val().choice
			}
		});	

	var winner = findwinner(mydata.choice, enemydata.choice);
	switch (winner){
	case 1:
		mydata.wins++;
		$('#result').html("You Won");
		break;
	case 2:
		mydata.losses++;
		$('#result').html("You Lost");
		break;
	case 3:
		ties=1;
		$('#result').html("It is a tie");
		break;
	}
	
	myref.update({
		wins:mydata.wins,
		losses:mydata.losses,
	});

	//myref.child("choice").remove();

	//make sure both the users have tir values displayed
	setTimeout(playgame(),500);
	}//end if statement
});

function findwinner(Guess1, Guess2){
	
		if ((Guess1 == 'Rock') && (Guess2 == 'Scissor')){
			return 1;
		}else if ((Guess1 == 'Rock') && (Guess2 == 'Paper')){
			return 2;
		}else if ((Guess1 == 'Scissor') && (Guess2 == 'Rock')){
			return 2;
		}else if ((Guess1 == 'Scissor') && (Guess2 == 'Paper')){
			return 1;
		}else if ((Guess1 == 'Paper') && (Guess2 == 'Rock')){
			return 1;
		}else if ((Guess1 == 'Paper') && (Guess2 == 'Scissor')){
			return 2;
		}else if (Guess1 == Guess2){
			return 0;
		}	
}




// enemyref.on('value', function(snapshot){
// 	if(snapshot.child('display').exists()){
// 		myref.once('value', function(snapshot){
// 			if(snapshot.child('display').exists()){
// 				console.log("hello");

// 			playgame();	
// 			}
// 		});
		
// 	}
// });


});//ondocument ready