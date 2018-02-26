var incorrectAudio = new Audio('prism-1.mp3');
var correctAudio = new Audio('suspension.mp3');

var speechBtn = document.querySelector("#speech-btn");
var soundBtn = document.querySelector("#sound-btn")
var modeBtns = document.querySelectorAll(".mode");
var numberBaseBtns = document.querySelectorAll(".number-base-btn");
var messageDisplayElement = document.querySelector("#message");
var squares = document.querySelectorAll(".square");
var heading = document.querySelector("#heading");
var colorDisplay = document.querySelector("#color-display");
var resetButton = document.querySelector("#reset-button");

var modes = {
  "easy": {
    difficultyLevel: 3
  },
  "medium": {
    difficultyLevel: 6
  },
  "hard": {
    difficultyLevel: 9
  },
  "insane": {
    difficultyLevel: 12
  }
};

var praises = [
  "Yes!",
  "Excellent!",
  "Nice!"
];

var insults = [
  "Nope!",
  "Nada!",
  "Really!"
];

var speak = function(message) {
  var msg = new SpeechSynthesisUtterance(message);
  var voices = window.speechSynthesis.getVoices();
  var randomVoice = genRandomNumber(0, voices.length - 1);
  msg.voice = voices[randomVoice];
  window.speechSynthesis.speak(msg);
};

speechBtn.addEventListener("click", function() {
  this.classList.toggle("selected");
});

soundBtn.addEventListener("click", function() {
  this.classList.toggle("selected");
});

var resetColors = function() {
  squares.forEach((v, i, a) => {
    if (colors[i]) {
      v.style.backgroundColor = colors[i];
      v.style.display = "block";
    }
    else {
      v.style.display = "none";
    }
  });
};


var difficultyLevel = function(level) {
  colors = generateRandomColors(level);
  pickedColor = pickRandomColor();
  numberBaseBtns.forEach(btn => {
    if (btn.textContent.toLowerCase() === 'hex' && btn.classList.contains("selected")) {
      colorDisplay.textContent = toHex();
    }
    else {
      colorDisplay.textContent = pickedColor;
    }
  });
  heading.style.backgroundColor = 'steelblue';
  resetButton.textContent = "New Colors";
  resetColors();
};


modeBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    modeBtns.forEach(function(b) {
      b.classList.remove("selected");
    });
    this.classList.add("selected");
    if (modes[this.textContent.toLowerCase()]) {
      console.log(this.textContent);
      difficultyLevel(modes[this.textContent.toLowerCase()].difficultyLevel);
    };
  });
});

var toHex = () => {
  var channels;
  var hexCode = "#";
  channels = pickedColor.split(",");
  channels.forEach((channel, i) => {
    if (i === 0) {
      channels[i] = parseInt(channel.split("(")[1]);
    }
    else {
      channels[i] = parseInt(channel);
    }
  })
  channels.forEach(c => {
    c = c.toString(16);
    hexCode += c.length === 1 ? "0" + c : c;
  });
  return hexCode;
};




var setBackgroundColors = (color) => {
  squares.forEach((v, i, a) => {
    v.style.backgroundColor = color;
    v.style.border = "2px solid #fff";
  });
}


var displayMessage = (txt) => {
  messageDisplayElement.textContent = txt;
};


var genRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};





var generateRandomColors = (numColors) => {
  var r, g, b;
  var colorString;
  var arrayOfColors = [];

  for (var i = 0; i < numColors; i++) {
    r = genRandomNumber(0, 255);
    g = genRandomNumber(0, 255);
    b = genRandomNumber(0, 255);

    colorString = "rgb(" + r + ", " + g + ", " + b + ")";

    arrayOfColors.push(colorString);
  }

  return arrayOfColors;
}


var colors = generateRandomColors(6);


var pickRandomColor = () => {
  var randomColor = genRandomNumber(0, colors.length - 1);
  return colors[randomColor];
};


var pickedColor = pickRandomColor();


colorDisplay.textContent = pickedColor;


var setUpEventHandlers = (el) => {
  el.addEventListener("click", function() {
    var clickedColor = this.style.backgroundColor;
    if (clickedColor == pickedColor) {
      setBackgroundColors(pickedColor);
      displayMessage("You got it!");
      heading.style.backgroundColor = clickedColor;
      resetButton.textContent = "Play Again?";
      if (soundBtn.classList.contains("selected")) {
        correctAudio.currentTime = 0;
        correctAudio.play();
      }
      if (speechBtn.classList.contains("selected")) {
        speak(praises[genRandomNumber(0, praises.length - 1)]);
      }

    }
    else {
      displayMessage("Sorry, try again!");
      this.style.backgroundColor = "#232323";
      this.style.borderColor = "#232323";
      if (soundBtn.classList.contains("selected")) {
        incorrectAudio.currentTime = 0;
        incorrectAudio.play();
      }
      if (speechBtn.classList.contains("selected")) {
        speak(insults[genRandomNumber(0, insults.length - 1)]);
      }
    }
  });
};


squares.forEach((v, i, a) => {
  resetColors();
  setUpEventHandlers(v);
});

resetButton.addEventListener("click", function() {
  colors = generateRandomColors(colors.length);
  pickedColor = pickRandomColor();
  colorDisplay.textContent = pickedColor;
  heading.style.backgroundColor = 'steelblue';
  resetButton.textContent = "New Colors";
  displayMessage("Let's Play A Game!");
  resetColors();
});

numberBaseBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    var channels;
    numberBaseBtns.forEach(function(b, i) {
      b.classList.remove("selected");
    });
    this.classList.add("selected");
    if (this.textContent.toLowerCase() == 'hex') {
      colorDisplay.textContent = toHex();
    }
    else {
      colorDisplay.textContent = pickedColor;
    };
  });
});
