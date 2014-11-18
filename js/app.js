/* app.js
* main script file for our little application
* */

var board = $('#board');
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
var imgArray = new Array();
var tileArray = new Array();
var count = 0; //counts number of clicks
var memoryValue = new Array(); //keep track of tile's info for comparison
var listTiles = new Array();
var noMatch = 0;
var match = 0;
var start;
var timer;
var elapsedSeconds;

function onReady(){
	hideGame();
	hideWin();

	imgArray = shuffleCards();


	$('#playButton').click(function(){
		$('.instructions').hide();
		$('.game').show();
		drawBoard();
	})

	$('#newGame').click(function(){
		location.reload();
	})
}

function hideGame() {
	$('.game').hide();
}

function hideWin() {
	$('.win').hide();
}


function shuffleCards(){
	console.log(numbers);
	var shuffledNumbers = _.shuffle(numbers); //shuffles the numbers array
	console.log(shuffledNumbers);

	//finds the associated shuffledNumbers and stores 8 numbers into an array
	for (var i = 0; i < 8; i++){
		imgArray[i] = shuffledNumbers[i];
	}

	//duplicates the 8 arrays to create 16 tiles with pairs
	for (var dup = 0; dup < 8; dup++){
		var current = imgArray[dup];
		imgArray.push(current);
	}

	imgArray = _.shuffle(imgArray);	//shufles the 16 tiles
	console.log(imgArray);
	return imgArray;
}

function drawBoard(){
	//creates and stores 8 tiles into an array
	//creates the associated sourc and alt tags for the images
	for (var i = 0; i < imgArray.length; i++){
		var tile = 'img/tile'+imgArray[i]+'.jpg';	//creates tile with image
		var newTile = $(document.createElement('img'));
		
		newTile.data('assocTile', tile);
		newTile.data('info', imgArray[i]);

		newTile.attr('src', 'img/tile-back.png');	//face down tile image
		//newTile.attr('src', 'img/tile'+imgArray[i]+'.jpg'); //img tile up
		newTile.attr('alt', 'tile image');
		newTile.attr('width', '250px');
		
		tileArray.push(newTile);
	}

	//creates a table with the tiles
	var num = 0;
	for (var row = 1; row <= 4; row++){
		for (var col = 1; col <= 4; col++){
			$('#row'+[row]).append("<td>");
			$('#row'+[row]).append(tileArray[num]);
			$('#row'+[row]).append("</td>");
			num++;
		}
	}

	//click event function. when a tile is clicked, 
	//the tile flips over and reveals the image
	$('#board img').click(function(){
		var clickedImage = $(this);
		var tileData = clickedImage.data('assocTile');
		var tileInfo = clickedImage.data('info');

		clickedImage.attr('src', tileData);
		$(this).addClass('border');
		count++;

		//var start;
		if (count == 1){
			start = _.now();
		}

		$("#counter").html(count + " Clicks");
		checkTile(clickedImage, tileInfo);

	})//flips the card upward

	//creates a timer
	startTime();

}

//checks whether or not two tiles are the same
//or if the game is over
function checkTile(tile, val){
	if (memoryValue.length < 2){
		listTiles.push(tile);
		memoryValue.push(val);

		if (memoryValue.length == 2){
			if (memoryValue[0] == memoryValue[1]){ //if there's a match
				match++;
				if (match == 8){
					setTimeout(winGame, 500);
				}
				$('#matches').html(match + " pairs found!");
				listTiles[0].fadeTo(1000,0.4);
				listTiles[1].fadeTo(1000,0.4);
				memoryValue = [];
				listTiles = [];
			} else  {	//there's no match
				noMatch++;
				$('#nomatches').html(noMatch + " failed attempts...")
				setTimeout(function () {delayTiles(listTiles)}, 500);
			}
		}
	}
}

//Timer for the game. It doesn't start until
//the user has clicked an image.
function startTime(){
	timer = window.setInterval(onTimer, 1000);
	function onTimer() {
		elapsedSeconds = Math.floor((_.now() - start) / 1000);
		if (elapsedSeconds > 0){
			$('#timer').html("Time Lapsed: " + elapsedSeconds + " seconds");
		}
	}
}

//when the game is game over, this function is called
//and creates a message for the user
function winGame() {
	$('#feedback').html("You solved the game in " + noMatch + " attempts! ");
	$('#feedback').append("It took you " + elapsedSeconds +" seconds! ");
	$('#feedback').append("You solved it in " + count + " clicks.")
	$('.game').empty();
	window.clearInterval(timer);
	$('.win').fadeIn(500);
	$('#playAgain').click(function(){
		location.reload();
	})	
}

//when there is no match, this function is called
//and flips the images back down
function delayTiles(currentTiles){
	for (var i = 0; i < 2; i++){
		listTiles[i].attr('src', 'img/tile-back.png');
		listTiles[i].removeClass('border');	
	}
	memoryValue = [];
	listTiles = []
}


$(onReady)






