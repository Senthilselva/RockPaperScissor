 
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



$(document).ready(function() {

$("#submitbtn").on('click',adduser);

function adduser(){

	var newuser = $("#name").val().trim();
	console.log("user  "+newuser);

	//checking to see if there are more than two player playing.
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
	// console.log(snapshot.val());
	// var noOfUsers = snapshot.numChildren();
	// console.log("length" + noOfUsers);s
	//debugger;
	var usersKey = snapshot.key;
	var Lthisplayer = sessionStorage.getItem("thisPlayer");

	if(!((usersKey == "1")  || (usersKey == "2")) ){ //this if statement is to skip the inital run
		//change the key Firebase generated key 
	    //console.log(prevChildKey);
		debugger;

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
	}



console.log(sessionStorage.getItem("thisPlayer"));
console.log(sessionStorage.getItem("otherPlayer"));

}); //on value change

//Capturing when window is closed and removing the object from firebase
window.onbeforeunload = confirmExit;
function confirmExit()
{
	var Lthisplayer = sessionStorage.getItem("thisPlayer");
  	debugger;
  	if(Lthisplayer == 2 ){
  		ref.child(2).remove();
  	}
  	if(Lthisplayer == 1){
  		ref.child(1).remove();
  	}
}

// if (snapshot.child("").exists() && snapshot.child("highPrice").exists()) {

// }
});//ondocument ready