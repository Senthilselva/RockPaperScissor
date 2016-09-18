 
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



$(document).ready(function() {

$("#submitbtn").on('click',adduser);

function adduser(){

	var newuser = $("#name").val().trim();
	console.log("user  "+newuser);

	ref.once("value", function(snapshot) {
		var length = snapshot.numChildren();
		if (length > 1){
			alert("Already two players Playing");
			return;
		} else {
			database.ref().push({
        		name: newuser,
        		wins: 0,
        		losses: 0
    		});//set the value
		}
	});


	

}; //add user


database.ref().on("child_added", function(snapshot, prevChildKey) {
	// console.log(snapshot.val());
	// var noOfUsers = snapshot.numChildren();
	// console.log("length" + noOfUsers);s
	//debugger;
	var usersKey = snapshot.key;
	if(!((usersKey == "1")  || (usersKey == "2"))){
		//change the key Firebase generated key 
	    console.log(prevChildKey);
		debugger;
		//var serialKey
		if (prevChildKey == 1) { 
			var Vchild = ref.child(usersKey); 
			ref.child(2).set(snapshot.val());
			Vchild.remove(); 
		} else { 
			var Vchild = ref.child(usersKey); 
			ref.child(1).set(snapshot.val());
			Vchild.remove();
		}	
	}


}); //on value change



// if (snapshot.child("").exists() && snapshot.child("highPrice").exists()) {

// }
});//ondocument ready