// console.log("linked");
var deck = [];
var playerBank = 0;
var bankOutput = $('.bank');
var bet = 0;
var sBet = 0;
var betButton = $('.betButton');
var hit = $('.hit');
var stand = $('.stand');
var dbl = $('.double');
var split = $('.split');
hit.prop('disabled',true);
stand.prop('disabled',true);
dbl.prop('disabled',true);
betButton.prop('disabled',true);
var playerTotal;
var playerTotal2;
var dealerTotal;
var playerCards = [];
var playerCards2 = []; //split hand
var dealerCards = [];
var dealerHand = $('.dealerHand'); //output of .png area
var playerHand = $('.playerHand');
var playerHand2 = $('.splitArea');
var splitArea = $('.splitArea');
var betAmt = $('.betAmt');
var comment = $('.comment');
var dealAreas = $('.dealArea');
var splitTurn = false;
//initState();
/////////////////	INITIAL STUFF


betButton.click(function() {
	initState();
	// console.log("bet clicked");
	bet = parseInt(betAmt.val());
	if (bet > playerBank) {
		comment.text("You don't have that much money.");
	}
	// Start the round
	else if (bet > 0) {
		playerBank -= bet;
		bankOutput.text(playerBank);
		deal(0); 
		toggleButtons(false);
		checkSplit();
		checkBJ();
	}
	else {
		comment.text("Please enter a valid bet.");
	}
})


hit.click(function() {
	// console.log("hit button clicked");
	split.css('visibility','hidden');
	
	if (!playerTotal2) {		//no split
		dbl.prop('disabled',true);
		deal(1);
		if (playerTotal > 21) { 	//if over 21, check for aces
			playerTotal = checkAce(playerCards, playerTotal);
		}
		comment.text(handValues());
		if (playerTotal > 21) { 	// player is still over 21? end game
			// console.log("player busted");
			winner();
		}
		if ((playerCards.length === 5) && (playerTotal < 22)) {
			deal(2);
		}
	}

	else {		//split exists
		if (!splitTurn) {
			deal(1);
			if (playerTotal > 21) { 	//if over 21, check for aces
				playerTotal = checkAce(playerCards, playerTotal);
			}
			comment.text(handValues());
			if (playerTotal > 21) { 	// player is still over 21? end game
				// console.log("player busted");
				splitTurn = true;
				playAreaHighlight();
			}
			if ((playerCards.length === 5) && (playerTotal < 22)) {
				splitTurn = true;
				playAreaHighlight();
			}
		}
		else {
			deal(3);
			if (playerTotal2 > 21) { 	//if over 21, check for aces
				playerTotal2 = checkAce(playerCards2, playerTotal2);
			}
			comment.text(handValues());
			if (playerTotal2 > 21) { 	// player is still over 21? end game
				// console.log("player busted");
				winner();
			}
			if ((playerCards2.length === 5) && (playerTotal2 < 22)) {
				deal(2);
			}
		}
	}
});

dbl.click(function() {
	// console.log("double button clicked");
	if (bet > playerBank) {
		comment.text("You don't have enough money");
	}
	else {
		split.css('visibility','hidden');
		if (!playerTotal2) {		//no split hand
			playerBank -= bet;
			bet *=2;
			bankOutput.text(playerBank);
			deal(1);
			if (playerTotal > 21) {
					playerTotal = checkAce(playerCards, playerTotal);	//update playerTotal
				}
			if (playerTotal > 21) {
					winner();
				}
			else { // player is still good with aces
					deal(2);
				}
		}
		else {		//split exists
			if (!splitTurn) {		//left field
				playerBank -= bet;
				bet *=2;
				bankOutput.text(playerBank);
				deal(1);
				if (playerTotal > 22) {
					playerTotal = checkAce(playerCards, playerTotal);	//update playerTotal
				}
				splitTurn = true;
				playAreaHighlight();
				comment.text(handValues());
			}

			else {					//right field
				if (bet > playerBank) {
					comment.text("You don't have enough money");
				}
				else {
					playerBank -= sBet;
					sBet *=2;
					bankOutput.text(playerBank);
					deal(3);
					if (playerTotal2 > 21) {
						playerTotal2 = checkAce(playerCards2, playerTotal2);	//update playerTotal						
					}
					if (playerTotal2 > 21) {
						deal(2);
					}
					else {
						deal(2);
					}
				}
			}
		}
	}
})

stand.click(function() {
	// console.log("stand button clicked");
	split.css('visibility','hidden');
	if (!playerTotal2) {		//no split
			deal(2);
		}

	else {		//split exists
		if (!splitTurn) {
			splitTurn = true;
			playAreaHighlight();
		}
		else {
			deal(2);
		}
	}
})

split.click(function() {
	split.css('visibility','hidden');
	$('.playerHand img:last-child').remove()
	sBet = bet;
	playerBank -= sBet;
	bankOutput.text(playerBank);

	playerCards2.push(playerCards.pop());
	playerCards.push(deck.shift());
	playerCards2.push(deck.shift());
	
	playerTotal = playerCards[0].value + playerCards[1].value;
	playerTotal2 = playerCards2[0].value + playerCards2[1].value;
	comment.text(handValues());

	playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[1].image +'">'));
	splitArea.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards2[0].image +'">'));
	splitArea.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards2[1].image +'">'));

	playAreaHighlight();
});




///////////////////////////  FUNCTIONS
function initState() {
	dealAreas.empty();
	$('.animated').removeClass('flash animated slideInRight faceInDown');
	$('.deck').empty();
	split.css('visibility','hidden')
	splitTurn = false;
	playerHand2.removeClass('red');
	playerCards = [];
	playerCards2 = [];
	dealerCards = [];
	deck = [];
	newDeck();
	// shuffle();
	comment.text('');
	bet = sBet = 0;
	playerTotal = playerTotal2 = dealerTotal = 0;
	
	// console.log("init ran");
}




function newDeck() {
	// push each card into deck[]
	for (var i = 0; i < 4; i++) {
	    for (var j = 0; j < 13; j++) {
		// image: value info
		// if 3 digits, last 2 values = card rank + 1
		// if 2 digits, first value = suit and last value = rank
		// 010.png = diamond 11
		// 01.png = diamond 2
		// remember that card 00 is diamond ACE and +13 is club ACE
		if (j === 0) {
			var card = {
		    	rank: j+1, 
		    	suit: i+1,
				value: 11,
				image: "img/deckimg/"+ i.toString()+j.toString() +".png"
			}
		}
		else if (j >= 10) {
			var card = {
		    	rank: j+1, 
		    	suit: i+1,
				value: 10,
				image: "img/deckimg/"+ i.toString()+j.toString() +".png"
			};
		}
	   	else {
	   		var card = {
		    	rank: j+1, 
		    	suit: i+1,
				value: j+1,
				image: "img/deckimg/"+ i.toString()+j.toString() +".png"
			};
		}
	    deck.push(card);  //puts newly created card(assoArray) into the deck array
	    }
	}
	// console.log("deck of "+deck.length+" has been created");

	//shuffle the deck
	for (var i = 0; i < deck.length; i++) {
		var randomIndex = Math.floor(Math.random()*deck.length);
		var moveThis = deck[randomIndex];
		deck[randomIndex] = deck[i];
		deck[i] = moveThis;
	}
	// console.log("deck has been shuffled");
	
	
	// //displays imgs of the shuffled deck
	// for (var i = 0; i < deck.length; i++) {
		// console.log("rank: "+deck[i].rank + "  suit: "+ deck[i].suit);
	// 	$('.deck').append($('<img class="smallImg" src="'+ deck[i].image +'">'));
	// }
}


function deal(num) {
	if (num === 0) {
		// console.log("dealing...");
		playerCards.push(deck.shift());
		playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[0].image +'">'));
		
		dealerCards.push(deck.shift());
		dealerHand.append($('<img class="fadeInDown animated smallImg" src="'+ dealerCards[0].image +'">'));
		
		playerCards.push(deck.shift());
		playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[1].image +'">'));

		//hole card
		dealerCards.push(deck.shift());
		dealerHand.append($('<img class="fadeInDown animated smallImg" src="img/deckimg/hole.png">')); // hole card img
		
		for (var t = 0; t < 2; t++) {
			playerTotal += playerCards[t].value;
			dealerTotal += dealerCards[t].value;
		}
		//playerTotal += playerCards[0].value;
		//dealerTotal += dealerCards[0].value;
		//playerTotal += playerCards[1].value;
		//dealerTotal += dealerCards[1].value;

		// console.log("PlayerTotal: "+playerTotal);
		// console.log("DealerTotal: "+dealerTotal);

		comment.text(handValues());
	}

	if (num === 1) {
		playerCards.push(deck.shift());
		playerTotal += playerCards[playerCards.length-1].value;
		playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[playerCards.length-1].image +'">'));
		comment.text(handValues());
	}
	if (num === 2) {
		// replaces hold card src with actual index 1 card in dealerHand
		dealerHand[0].lastChild.src = dealerCards[1].image;
		// document.querySelector('.dealerHand').lastChild.src = '';
		
		// Dealer draws cards
		var z = 2;
		while (dealerTotal < 17) {
			dealerCards.push(deck.shift());
			dealerTotal += dealerCards[z].value;
			dealerHand.append($('<img class="fadeInDown animated smallImg" src="'+ dealerCards[z].image +'">'));
			// console.log("Dealer Got: "+dealerCards[z].value);
			if (dealerTotal > 21) {
				dealerTotal = checkAce(dealerCards, dealerTotal);
			}
			z++;
		}
		// console.log("Dealer has a total of: "+dealerTotal);
		winner();
	}
	if (num === 3) {
		playerCards2.push(deck.shift());
		playerTotal2 += playerCards2[playerCards2.length-1].value;
		playerHand2.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards2[playerCards2.length-1].image +'">'));
	}
}


// deactivate bet button and activate others
function toggleButtons(bool) {

		hit.prop('disabled',bool);
		stand.prop('disabled',bool);
		dbl.prop('disabled',bool);
		betButton.prop('disabled',!bool);
	
}

// ONLY CALL WHEN PLAYER CAN'T HIT OR GET ANY MORE CARDS
function winner() {  //checks for bust and compares hands
	if (playerTotal > 21) {
		comment.text("Player Bust");
		dealerHand[0].lastChild.src = dealerCards[1].image;
		dealerHand.addClass('flash animated');
	}
	else if (dealerTotal > 21) {
		comment.text("Dealer Bust. You win: "+bet*2);
		playerBank += bet*2;
		bankOutput.text(playerBank);
		playerHand.addClass('flash animated');
	}
	else if (playerTotal > dealerTotal) {
		comment.text("You win: $"+bet*2);
		playerBank += bet*2;
		bankOutput.text(playerBank);
		playerHand.addClass('flash animated');
	}
	else if (dealerTotal > playerTotal) {
		comment.text("Dealer Wins");
		dealerHand.addClass('flash animated');
	}
	else if (dealerTotal === playerTotal) {
		comment.text("Push");
		playerBank += bet;
		bankOutput.text(playerBank);
	}
	else {
		comment.text("Error?");
	}


	if (playerTotal2) {		//calculate for split hand
		if (playerTotal2 > 21) {
			console.log("split bust");
			//comment.text("Player Bust");
			dealerHand[0].lastChild.src = dealerCards[1].image;
			dealerHand.addClass('flash animated');
		}
		else if (dealerTotal > 21) {
			console.log("split win");
			comment.text("Dealer Bust. You win: "+sBet*2);
			playerBank += sBet*2;
			bankOutput.text(playerBank);
			playerHand2.addClass('flash animated');
		}
		else if (playerTotal2 > dealerTotal) {
			console.log("split win");
			comment.text("You win: $"+sBet*2);
			playerBank += sBet*2;
			bankOutput.text(playerBank);
			playerHand2.addClass('flash animated');
		}
		else if (dealerTotal > playerTotal2) {
			comment.text("Dealer Wins");
			dealerHand.addClass('flash animated');
		}
		else if (dealerTotal === playerTotal2) {
			comment.text("Push");
			playerBank += sBet;
			bankOutput.text(playerBank);
		}
		else {
			comment.text("Error?");
		}
		comment.text("[Player: "+playerTotal+"]" + " [Split Hand: "+playerTotal2+"]"+ " [Dealer: "+dealerTotal+"]");
	}
	toggleButtons(true);
	if (playerBank <= 0) {
		retry();
	}
}

function checkBJ() {
	if ((playerTotal === 21) && (dealerTotal === 21)) {
		dealerHand[0].lastChild.src = dealerCards[1].image;
		winner();
	}
	else if (playerTotal === 21) {
		comment.text("Blackjack! You win: $"+bet*2.5);
		comment.addClass('slideInRight animated');
		dealerHand[0].lastChild.src = dealerCards[1].image;
		playerBank += bet*2.5;
		bankOutput.text(playerBank);
		toggleButtons(true);
	}
	else if (dealerTotal === 21) {
		comment.text("Dealer won with Blackjack.");
		dealerHand[0].lastChild.src = dealerCards[1].image;
		toggleButtons(true);
	}
}

// checks for any aces and RETURNS ADJUSTED TOTAL when below 22
function checkAce(hand, total) {  //hand = playerCards or dealerCards     //total = playerTotal or dealerTotal
	//WHAT IF I HAD TWO ACES?  probably can use a for loop for this
	
	var i = 0;
	while (total > 21) {  //while the playerTotal is greater than 21  //what if there are no aces? it never turns false
		
		if (hand[i].value === 11) {	 
			hand[i].value = 1;	//decrease the ace value to 1
			total -= 10; // manually adjust the playerTotal
			// console.log("ace found");
		}
		i++;
		if (i === hand.length) {	// if all cards are checked and no ace found, stop loop using return;
			return total;
		}
	}
	// console.log('new total'+total);
	return total;	// return when total < 22
}

function checkSplit() {
	if (playerCards[0].value === playerCards[1].value && playerBank >= bet) {
		split.css('visibility', 'visible');
	}
}


// outputs the total value of face up cards for each player
function handValues() {
	if (playerTotal2) {
		comment.text("[Player: "+playerTotal+"]" + " [Split Hand: "+playerTotal2+"]"+ " [Dealer: "+(dealerTotal-dealerCards[1].value)+"]");
	}
	else {
		comment.text("[Player: "+playerTotal+"]" + " [Dealer: "+(dealerTotal-dealerCards[1].value)+"]");
	}	
}

function playAreaHighlight() {
	if (!splitTurn) {
		playerHand.addClass('red');
	}
	else {
		playerHand.removeClass('red');
		playerHand2.addClass('red');
	}
}
/////////// Sit Down Modal
$('.submitBankroll').click(function() {
	if (parseInt($('.submitBankAmt').val()) > 0) {
		initState();
		playerBank = parseInt($('.submitBankAmt').val());
		bankOutput.text(playerBank);
		//close modal
		$('#sitDown').toggle();
		betButton.prop('disabled',false);
	}
});

function retry() {
	$('#sitDown').toggle();
	$('#howMuch').text("You lost all your money");
	$('.doYouHave').text("Would you like to play again?");
}


