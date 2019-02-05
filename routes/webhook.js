var express = require('express');
var firebase = require('firebase');

var router = express.Router();

var config = {
    apiKey: "AIzaSyCAVHyAObAk9kKAAuYeU4a4aggCUVQ6UHs",
    authDomain: "reena-webhooks.firebaseapp.com",
    databaseURL: "https://reena-webhooks.firebaseio.com",
    projectId: "reena-webhooks",
    storageBucket: "reena-webhooks.appspot.com",
    messagingSenderId: "608226426951"
  };
firebase.initializeApp(config);

router.get('/notifications', function (req, res) {
  
  console.log("HTTP Get Request");
	var webhookRef = firebase.database().ref("/reena-webhooks");
    var arr = [];
	//Attach an asynchronous callback to read the data
	webhookRef.orderByChild('create_time').on("value", 
			  function(snapshot) {
          snapshot.forEach((child) => {
              arr.push(child.val());
          });          
          var finalArr=  arr.slice().sort(function(a, b) {
              return (new Date(a.create_time) - new Date(b.create_time))*-1; 
          });

					res.json(finalArr);
					webhookRef.off("value");
				}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 })
});

router.post("/", function(req,res,next){
  console.log("incoming webhook at "+ new Date());

  var body = req.body;
  body.web_date = new Date();

  if(body)
    firebase.database().ref("/reena-webhooks").child(body.id).set(body);
  console.log("stored ");

  res.end();

});

module.exports = router;
