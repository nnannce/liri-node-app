require("dotenv").config();
//dependencies
var keys = require('./keys.js');
var twitter = require("twitter");
var Spotify = require('node-spotify-api');	
var request = require("request");
var fs = require('fs');


//capturing user input, and informing user of what to type in.
console.log("Type my-tweets , spotify-this-song , movie-this , or do-what-it-says to get started!");
//process[2] choses action, process[3] as search parameter for spotify or movie.
var userCommand = process.argv[2];
var secondCommand = process.argv[3];
//process multiple words. Triggers if user types anything more than the above console logged options and first parameter.
	for(i=4; i<process.argv.length; i++){
	    secondCommand += '+' + process.argv[i];
	}

function theGreatSwitch(){
	//action statement, switch statement to declare what action to execute.
	switch(userCommand){

		case 'my-tweets':
		fetchTweets();
		break;

		case "spotify-this-song":
		spotifySong(secondCommand);
		break;

		case 'movie-this':
		aMovieForMe();
		break;

		case 'do-what-it-says':
		followTheTextbook();
		break;
		
	}
};
//functions/options
function fetchTweets(){
	console.log("Tweets headed your way!");
	//new variable for instance of twitter, load keys from imported keys.js
	var client = new twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
  		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	//parameters for twitter function.
	var parameters = {
		screen_name: 'ReginPhalangee',
		count: 20
	};

	//GET method
	client.get('statuses/user_timeline', parameters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};

//SPOTIFY

function spotifySong(song) {
	song = (song || "The Sign");
	console.log("Please wait while I find that song.\n");
	var spotify = new Spotify({
   id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});
	spotify.search({ type: 'track', query: "track:" + song, limit: 20 })
	.then(function(response) {
		var foundSong = false;
		for (var i = 0; i < response.tracks.items.length; i++) {
			if (response.tracks.items[i].name.toLowerCase() === song.toLowerCase()) {
				console.log("I think I found the song you were looking for. Here's some information on it:\n");
				if (response.tracks.items[i].artists.length > 0) {
					var artists = response.tracks.items[i].artists.length > 1 ? "  Artists: " : "  Artist: ";
					for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
						artists += response.tracks.items[i].artists[j].name;
						if (j < response.tracks.items[i].artists.length - 1) {
							artists += ", ";
						}
					}
					console.log(artists);
				}
				console.log("  Song: " + response.tracks.items[i].name);
				console.log("  Album: " + response.tracks.items[i].album.name);
				console.log(response.tracks.items[i].preview_url ? "  Preview: " + response.tracks.items[i].preview_url : "  No Preview Available");

				foundSong = true;
				break;
			}
		}
		if (!foundSong) {
			console.log("I'm Sorry, I couldn't find any songs called '" + song + "' on Spotify.");
		}
	})
	.catch(function(err) {
	    console.log("I'm sorry, but I seem to have run into an error.\n  " + err);
	});
};

//MOVIE
function aMovieForMe(){
	console.log("Movies");

	//same as above, test if search term entered
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json&apikey=trilogy';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};

//RANDOM

function followTheTextbook(){
	console.log("Looking at random.txt now");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data, declare variables
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        //run action
		theGreatSwitch();
		
    	};//end else

    });//end readfile

};//end followTheTextbook

theGreatSwitch();