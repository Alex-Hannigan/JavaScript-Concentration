let name;
let gameOver;
let cardOriginX;
let cardOriginY;
let canvasWidth;
let canvasHeight;
let cardX;
let cardY;
let cardSpaceWidth;
let cardSpaceHeight;
let cardWidth;
let cardHeight;
let cards;
let cardAspectRatio;
let widerThanTall;
let faceUpCards;
let cardsForCurrentGame;
let indexOfNextCardToAdd;
let scoreLabelX;
let scoreLabelY;
let highScoreLabelX;
let highScoreLabelY;
let spaceForCardsMarginWidth;
let spaceForCardsMarginHeight;
let newGameButton;
let newGameButtonX;
let newGameButtonY;
let newGameButtonWidth;
let newGameButtonHeight;
let score;
let input;
let button;
let highScore;
let highScorePlayerName;
let nameHasBeenInput;
const spaceForCardsRatioToCanvasSize = 0.8;
const strokeWeightToCardSmallestDimensionRatio = 0.01;
const canvasToWindowSizeRatio = 1;
const cornerRadiusToCardSmallestDimensionRatio = 0.2;
const numberOfCardsPerRow = 4;
const numberOfCardsPerColumn = 4;
const numberOfCards = numberOfCardsPerRow * numberOfCardsPerColumn;
const cardSizeToAvailableSpaceRatio = 0.8;
const cardStripeSpacingToCardSmallestDimensionRatio = 0.05;
const textSizeToCardSmallestDimensionRatio = 0.5;
const textSizeToButtonLargestDimensionRatio = 0.15;
const textSizeToCanvasSmallestDimensionRatio = 0.05;
const gameOverTextSizeToCanvasSizeRatio = 0.1;
const faceChoices = ['🤡', '👴🏻', '😡', '🤑', '😬', '😲', '🤐', '🙀'];

function setSizes() {
  canvasWidth = windowWidth * canvasToWindowSizeRatio;
  canvasHeight = windowHeight * canvasToWindowSizeRatio;
  cardSpaceWidth = canvasWidth * spaceForCardsRatioToCanvasSize / numberOfCardsPerRow;
  cardSpaceHeight = canvasHeight * spaceForCardsRatioToCanvasSize / numberOfCardsPerColumn;
  cardWidth = cardSpaceWidth * cardSizeToAvailableSpaceRatio;
  cardHeight = cardSpaceHeight * cardSizeToAvailableSpaceRatio;
  spaceForCardsMarginWidth = (canvasWidth - (canvasWidth * spaceForCardsRatioToCanvasSize)) / 2;
  spaceForCardsMarginHeight = (canvasHeight - (canvasHeight * spaceForCardsRatioToCanvasSize)) / 2;
  cardOriginX = 0 + (spaceForCardsMarginWidth) + (cardSpaceWidth - cardWidth) / 2;
  cardOriginY = 0 + (spaceForCardsMarginHeight) + (cardSpaceHeight - cardHeight) / 2;
  scoreLabelX = 0 + spaceForCardsMarginWidth / 2;
  scoreLabelY = 0 + spaceForCardsMarginHeight * 0.3;
  scoreLabelWidth = spaceForCardsMarginWidth / 2;
  scoreLabelHeight = spaceForCardsMarginHeight / 2;
  highScoreLabelX = canvasWidth - spaceForCardsMarginWidth / 2;
  highScoreLabelY = 0 + spaceForCardsMarginHeight * 0.3;
  newGameButtonWidth = spaceForCardsMarginWidth;
  newGameButtonHeight = spaceForCardsMarginHeight / 2;
  newGameButtonX = (canvasWidth / 2 - newGameButtonWidth / 2);
  newGameButtonY = canvasHeight - spaceForCardsMarginHeight / 2 - newGameButtonHeight * 0.75;
  cardX = cardOriginX;
  cardY = cardOriginY;
  cardAspectRatio = cardWidth / cardHeight;
  if (cardAspectRatio > 1) {
    widerThanTall = true;
  }
  else {
    widerThanTall = false;
  }
}

function setup() {
  name = "?"
  gameOver = false;
  cards = [];
  cardsForCurrentGame = [];
  indexOfNextCardToAdd = 0;
  score = 0;
  highScore = 0;
  nameHasBeenInput = false;

  // Retrieve the high score from the database
  fetch('/score', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      if(data) {
        highScore = data.score;
        highScorePlayerName = data.playerName;
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  setSizes();
  createCanvas(canvasWidth, canvasHeight);
  setupNameInputScreen();
}

function setupNameInputScreen() {
  nameHasBeenInput = false;
  widthChange = 1;
  heightChange = 1;
  button = createButton('submit');
  button.mousePressed(setupCards);
  input = createInput(name, text);
  textAlign(LEFT);
  textSize(max(canvasWidth, canvasHeight) * textSizeToCanvasSmallestDimensionRatio);
  greeting = createElement('h2', 'What is your name?');
  score = 0;
}

function setupCards() {
  nameHasBeenInput = true;
  name = input.value();
  input.remove();
  button.remove();
  greeting.remove();
  cards = [];
  cardsForCurrentGame = [];
  indexOfNextCardToAdd = 0;
  cardX = cardOriginX;
  cardY = cardOriginY;
  for(let pairCount = 0; pairCount < numberOfCards / 2; pairCount++) {
    cardsForCurrentGame.push(faceChoices[pairCount]);
    cardsForCurrentGame.push(faceChoices[pairCount]);
  }
  cardsForCurrentGame = shuffleCards(cardsForCurrentGame);
  createCanvas(canvasWidth, canvasHeight);
  background(0, 144, 81);
  for(let columnCount = 0; columnCount < numberOfCardsPerColumn; columnCount++) {
    cardX = cardOriginX;
    for(let rowCount = 0; rowCount < numberOfCardsPerRow; rowCount++) {
      cards.push(new Card(cardX, cardY, cardWidth, cardHeight, cardsForCurrentGame[indexOfNextCardToAdd]));
      cardX += cardSpaceWidth;
      indexOfNextCardToAdd++;
    }
    cardX = cardOriginX;
    cardY += cardSpaceHeight;
  }
}

// Redraw the game screen if the browser window is resized
function windowResized() {
  widthChange = windowWidth * canvasToWindowSizeRatio / canvasWidth;
  heightChange = windowHeight * canvasToWindowSizeRatio / canvasHeight;
  setSizes();
  resizeCanvas(canvasWidth, canvasHeight);
  for(cardIndex = 0; cardIndex < cards.length; cardIndex++) {
    cards[cardIndex].width = cardWidth;
    cards[cardIndex].height = cardHeight;
    cards[cardIndex].x *= widthChange;
    cards[cardIndex].y *= heightChange;
    cards[cardIndex].cornerRadius = min(cardWidth, cardHeight) * cornerRadiusToCardSmallestDimensionRatio;
  }
  newGameButton.width = newGameButtonWidth;
  newGameButton.height *= heightChange;
  newGameButton.x *= widthChange;
  newGameButton.y *= heightChange;
  newGameButton.cornerRadius = min(newGameButtonWidth, newGameButtonHeight) * cornerRadiusToCardSmallestDimensionRatio;
  newGameButton.buttonText

  redraw();
}

function draw() {
  // Draw the score label
  background(0, 144, 81);
  textSize(min(scoreLabelWidth, scoreLabelHeight) * 0.8);
  strokeWeight(min(this.width, this.height) * strokeWeightToCardSmallestDimensionRatio * 0.5);
  stroke(0);

  // Draw the current score label
  fill(203, 25, 31);
  textAlign(LEFT, CENTER);
  text('Score: ' + score, scoreLabelX, scoreLabelY);

  // Draw the player name
  text('Player: ' + name, scoreLabelX, scoreLabelY + scoreLabelHeight);

  // Draw the high score label
  fill(145, 116, 86);
  textAlign(RIGHT, CENTER);
  text('High score: ' + highScore, highScoreLabelX, highScoreLabelY);

  // Draw the high score record holder's name
  text('By: ' + highScorePlayerName, highScoreLabelX, highScoreLabelY + scoreLabelHeight);

  if(!nameHasBeenInput) {
    input.position(canvasWidth / 2 - input.width / 2 - button.width / 2, canvasHeight / 2);
    button.position(input.x + input.width, input.y);
    greeting.size(greeting.size.width * widthChange, greeting.size.height * heightChange);
    greeting.position((canvasWidth / 2 - greeting.size.width), (canvasHeight / 2 - canvasHeight * 0.2));
    greeting.style('font-size', (min(canvasWidth, canvasHeight) * textSizeToCanvasSmallestDimensionRatio) + 'pt');
    input.size(input.size.width *= widthChange, input.size.height *= heightChange);
    button.size(button.size.width *= widthChange, button.size.height *= heightChange);
  }

  // Draw the 'Game Over' screen
  else if(gameOver) {
    strokeWeight(min(this.width, this.height) * strokeWeightToCardSmallestDimensionRatio);
    stroke(0);
    fill(255, 0, 0);
    textSize(min(canvasWidth, canvasHeight) * gameOverTextSizeToCanvasSizeRatio);
    textAlign(CENTER, CENTER);
    text('🤡Well done!🤡', this.width/2, this.height/2);
  }
  // Draw the cards
  else {
    for(let index = 0; index < cards.length; index++) {
      if(!cards[index].isMatched) {
        cards[index].draw();
      }
    }
  }
  // Draw the 'New Game' button
  newGameButton = new gameButton(newGameButtonX, newGameButtonY, newGameButtonWidth, newGameButtonHeight, 'New Game');
  newGameButton.draw();
}

class Card {
  constructor(x, y, width, height, face) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.face = face;
    this.cornerRadius = min(width, height) * cornerRadiusToCardSmallestDimensionRatio;
    this.isFaceUp = false;
    this.isMatched = false;
  }

  // Draw the card
  draw() {
    strokeWeight(min(this.width, this.height) * strokeWeightToCardSmallestDimensionRatio);
    fill(255);
    stroke(0);
    rect(this.x, this.y, this.width, this.height, this.cornerRadius);

    // If the card is face up, draw the front of the card
    if(this.isFaceUp) {
      textSize(min(this.width, this.height) * textSizeToCardSmallestDimensionRatio);
      textAlign(CENTER, CENTER);
      text(this.face, this.x + this.width/2, this.y + this.height/2);
    }

    // If the card is face down, draw the back of the card
    else {
      stroke(0, 0, 255);
      strokeWeight(min(this.width, this.height) * strokeWeightToCardSmallestDimensionRatio);
      let lineSpacing = min(this.width, this.height) * cardStripeSpacingToCardSmallestDimensionRatio;
      let lineMinX = this.x + this.cornerRadius;
      let lineMinY = this.y + this.cornerRadius;
      let lineMaxX = this.x + this.width - this.cornerRadius;
      let lineMaxY = this.y + this.height - this.cornerRadius;
      let lineStartX = lineMinX;
      let lineStartY = lineMinY;
      let lineEndX = lineMaxX;
      let lineEndY = lineMaxY;
      let carryOnFromHereX;
      let carryOnFromHereY;
      let carryOnFromHereEndX;
      let carryOnFromHereEndY;
      let distanceFromEndXToMaxX;
      let distanceFromEndYToMaxY;

      // Draw back of card (if it's wider than it is tall)
      if(widerThanTall) {
        lineEndX -= (cardWidth - cardHeight);
        for(let offset = 0; lineEndX + offset < lineMaxX; offset += lineSpacing) {
          line(lineStartX + offset, lineStartY, lineEndX + offset, lineEndY);
          carryOnFromHereX = lineStartX + offset;
          carryOnFromHereEndX = lineEndX + offset;
        }
        carryOnFromHereX += lineSpacing;
        distanceFromEndXToMaxX = lineMaxX - carryOnFromHereEndX;
        lineEndY -= (lineSpacing - distanceFromEndXToMaxX);
        for(let offset = 0; lineEndY - offset > lineMinY; offset += lineSpacing) {
          line(carryOnFromHereX + offset, lineStartY, lineMaxX, lineEndY - offset);
        }
        lineEndY = lineMaxY;
        for(let offset = lineSpacing; lineStartY + offset < lineMaxY; offset += lineSpacing) {
          line(lineStartX, lineStartY + offset, lineEndX - offset, lineEndY);
        }
      }

      // Draw back of card (if it's taller than it is wide)
      else {
        lineEndY -= (cardHeight - cardWidth);
        for(let offset = 0; lineStartX + offset < lineMaxX; offset += lineSpacing) {
          line(lineStartX + offset, lineStartY, lineEndX, lineEndY - offset);
        }
        for(let offset = lineSpacing; lineEndY + offset < lineMaxY; offset += lineSpacing) {
          line(lineStartX, lineStartY + offset, lineEndX, lineEndY + offset);
          carryOnFromHereY = lineStartY + offset;
          carryOnFromHereEndY = lineEndY + offset;
        }
        carryOnFromHereY += lineSpacing;
        distanceFromEndYToMaxY = lineMaxY - carryOnFromHereEndY;
        lineEndX -= (lineSpacing - distanceFromEndYToMaxY);
        for(let offset = 0; lineEndX - offset > lineMinX; offset += lineSpacing) {
          line(lineMinX, carryOnFromHereY + offset, lineEndX - offset, lineMaxY);
        }
      }
    }
  }
}

class gameButton {
  constructor(x, y, width, height, buttonText) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.buttonText = buttonText;
    this.cornerRadius = min(width, height) * cornerRadiusToCardSmallestDimensionRatio;
  }

  // Draw the button
  draw() {
    strokeWeight(min(this.width, this.height) * strokeWeightToCardSmallestDimensionRatio);
    fill(255);
    stroke(0);
    rect(this.x, this.y, this.width, this.height, this.cornerRadius);
    textSize(max(this.width, this.height) * textSizeToButtonLargestDimensionRatio);
    textAlign(CENTER, CENTER);
    fill(0);
    text(this.buttonText, this.x + this.width/2, this.y + this.height/2);
  }
}

// Respond to mouse clicks on cards or the 'New Game' button
function mouseClicked() {
  if((mouseX >= newGameButton.x) && (mouseX <= newGameButton.x + newGameButton.width) && (mouseY >= newGameButton.y) && (mouseY <= newGameButton.y + newGameButton.height)) {
    gameOver = false;
    if(!nameHasBeenInput) {
      input.remove();
      button.remove();
      greeting.remove();
    }
    setupNameInputScreen();
  }
  else {
  function cardsAreFaceUp(card) {
    return card.isFaceUp;
  }
  function cardsAreNotMatched(card) {
    return !card.isMatched;
  }
  for(let index = 0; index < cards.length; index++) {
    if((mouseX >= cards[index].x) && (mouseX <= cards[index].x + cards[index].width) && (mouseY >= cards[index].y) && (mouseY <= cards[index].y + cards[index].height) && !cards[index].isMatched) {
      if(cards[index].isFaceUp) {
        cards[index].isFaceUp = false;
        score -= 1;
        document.getElementById("currentScoreText").innerHTML = "Score: " + score;
      }
      else {
        faceUpCards = cards.filter(cardsAreFaceUp);
        if(faceUpCards.length === 2) {
          if(faceUpCards[0].face === faceUpCards[1].face) {
            for(let i = 0; i < cards.length; i++) {
              if(cards[i].isFaceUp) {
                cards[i].isMatched = true;
                cards[i].isFaceUp = false;
              }
            }
            score += 2;
          }
          else {
            for(let i = 0; i < cards.length; i++) {
              if(cards[i].isFaceUp) {
                cards[i].isFaceUp = false;
                score -= 0.5;
              }
            }
          }
        }
        cards[index].isFaceUp = true;
      }
      faceUpCards = cards.filter(cardsAreFaceUp);
      unmatchedCards = cards.filter(cardsAreNotMatched);
      if(faceUpCards.length === unmatchedCards.length) {
        gameOver = true;
        score += 2;
        if(score > highScore) {
          updateHighScore();
        }
      }
      clear();
      redraw();
    }
  }
  // prevent default
  return false;
}
}

function shuffleCards(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffleCards...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function updateHighScore() {
  highScore = score;
  highScorePlayerName = name;
  fetch('/score', {
    method: 'PUT',
    body: JSON.stringify({score: highScore, playerName: name}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      if(response.ok) {
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
}
