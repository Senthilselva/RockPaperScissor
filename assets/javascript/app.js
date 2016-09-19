 
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
	ref.once("value", function(snapshot) {
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

			database.ref().push({
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
database.ref().on("child_added", function(snapshot, prevChildKey) {
	//debugger;
	var usersKey = snapshot.key;
	var Lthisplayer = sessionStorage.getItem("thisPlayer");

	if(!((usersKey == "1")  || (usersKey == "2")) ){ 

		//this if statement is to skip the inital run
		//change the key Firebase generated key 
	    //console.log(prevChildKey);
		//debugger;

		if (prevChildKey == 1) { 
			var Vchild = ref.child(usersKey); 
			ref.child(2).set(snapshot.val());
			Vchild.remove();
			//var this player will be used 
			
		} else { 
			var Vchild = ref.child(usersKey); 
			ref.child(1).set(snapshot.val());
			Vchild.remove();
			
		}

		ref.once("value", function(snapshot) {
			var length = snapshot.numChildren();
			if(length == 2){
				console.log("playgame");
				playgame();
			}
		});
	}

	

	// console.log(sessionStorage.getItem("thisPlayer"));
	// console.log(sessionStorage.getItem("otherPlayer"));

}); //on child added

//Capturing when window is closed and removing the object from firebase
window.onbeforeunload = confirmExit;
function confirmExit()
{
	var Lthisplayer = sessionStorage.getItem("thisPlayer");
  	//debugger;
  	if(Lthisplayer == 2 ){
  		ref.child(2).remove();
  	}
  	if(Lthisplayer == 1){
  		ref.child(1).remove();
  	}
}

function playgame(){
	console.log("this  " + thisPlayerGV);
	console.log("other  "+ otherPlayerGV);
	var mydivId = "#Player"+thisPlayerGV;
	var enemydivId = "#Player"+otherPlayerGV;
	// $(mydivId+"Name").html("You");
	// $(enemydivId+"Name").html("Your enemy");
	myref = database.ref(thisPlayerGV);
	enemyref = database.ref(otherPlayerGV);
	//get my Player information and populate my divref.once("value", function(snapshot) {
	
	myref.once("value", function(snapshot) {
		mydata = {
			name: snapshot.val().name,
			wins: snapshot.val().wins,
			losses: snapshot.val().losses
		}	
	});

	$(mydivId+"Name").html("You are " + mydata.name);

	//get other Player information and populate enemydiv 

	enemyref.once("value", function(snapshot) {
		enemydata = {
			name: snapshot.val().name,
			wins: snapshot.val().wins,
			losses: snapshot.val().losses
		}	
	});

	$(enemydivId+"Name").html("You are playing against "+enemydata.name);


}

// if (snapshot.child("").exists() && snapshot.child("highPrice").exists()) {

// }
});//ondocument ready