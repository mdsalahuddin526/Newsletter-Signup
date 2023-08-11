const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const { request } = require("http");
const app =express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    const data = {
      members : [
        {
          email_address : email,
          status : "subscribed",
          merge_fields : {
            FNAME: firstName,
	          LNAME: lastName
          }
        }
      ] 
    };
    const jsonData = JSON.stringify(data);
    const url= "https://us10.api.mailchimp.com/3.0/lists/e250ca14d3";
    const options ={
      methods: "POST",
      auth : "salahuddin:5aae16feb57d11fe75a2ecbcd4393a8c-us10",
    } 
    const request = https.request(url, options, function(response){
      if (response.statusCode===200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })
    request.write(jsonData);
    request.end();

    console.log(firstName, lastName, email);
})

app.post("/failure", function(req,res){
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});





