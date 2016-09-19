 
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
var playerRef = database.ref("players");
sessionStorage.setItem("thisPlayer", 0); 
sessionStorage.setItem("otherPlayer", 0);
var thisPlayerGV;
var otherPlayerGV;
var mydata = {};
var enemydata ={};

$(document).ready(function() {

$("#submitbtn").on('click',adduser);

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
	    //console.log(prevChildKey);
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
	var mydivId = "Player"+thisPlayerGV;
	var enemydivId = "Player"+otherPlayerGV;
	
	myref = database.ref("players/"+thisPlayerGV);
	enemyref = database.ref("players/"+otherPlayerGV);
	

	//get my Player information and populate my div
	myref.once("value", function(snapshot) {
		mydata = {
			name: snapshot.val().name,
			wins: snapshot.val().wins,
			losses: snapshot.val().losses
		}	
	});
	$("#Name"+mydivId).html("You are " + mydata.name);
	$("#Score"+mydivId).html("Wins: " + mydata.wins + ", Losses: " +mydata.losses);

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


// if (snapshot.child("").exists() && snapshot.child("highPrice").exists()) {

// }


});//ondocument ready