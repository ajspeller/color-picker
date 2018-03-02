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
  "Nice!",
  "Good Eye!",
  "Correct"
];

var insults = [
  "Nope!",
  "Nada!",
  "Really!",
  "Incorrect!",
  "Sorry!"
];

var speak = function(message) {
  var msg = new SpeechSynthesisUtterance(message);
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[17];
  window.speechSynthesis.speak(msg);
};

speechBtn.addEventListener("click", function() {
  this.classList.toggle("selected");
});

soundBtn.addEventListener("click", function() {
  this.classList.toggle("selected");
});

var resetColors = function() {
  var channels;
  squares.forEach((v, i, a) => {
    if (colors[i]) {
      channels = darkenColor(getChannels(colors[i]));
      v.style.backgroundColor = colors[i];
      v.style.boxShadow = "0px 6px rgb(" + channels[0] + ", " + channels[1] + ", " + channels[2] + ")";
      v.style.display = "block";
    }
    else {
      v.style.display = "none";
    }
  });
};

var showSelectedMode = () => {
  numberBaseBtns.forEach(btn => {
    if (btn.textContent.toLowerCase() === 'hex' && btn.classList.contains("selected")) {
      colorDisplay.textContent = toHex();
    }
    if (btn.textContent.toLowerCase() === 'hsl' && btn.classList.contains("selected")) {
      colorDisplay.textContent = toHsl().str;
    }
    if (btn.textContent.toLowerCase() === 'rgb' && btn.classList.contains("selected")) {
      colorDisplay.textContent = pickedColor;
    }
  });
};


var difficultyLevel = function(level) {
  colors = generateRandomColors(level);
  pickedColor = pickRandomColor();
  showSelectedMode();
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
      difficultyLevel(modes[this.textContent.toLowerCase()].difficultyLevel);
    };
  });
});

var getChannels = (rgbColor) => {
  var channels;
  channels = rgbColor.split(",");
  channels.forEach((channel, i) => {
    if (i === 0) {
      channels[i] = parseInt(channel.split("(")[1]);
    }
    else {
      channels[i] = parseInt(channel);
    }
  });
  return channels;
};

var darkenColor = (rgbChannels) => {
  rgbChannels.forEach((channel, i) => {
    rgbChannels[i] = (channel - 30) > 0 ? (channel - 30) : 0;
  });
  return rgbChannels;
};

var toHex = () => {
  var channels;
  var hexCode = "#";
  channels = getChannels(pickedColor);
  channels.forEach(c => {
    c = c.toString(16);
    hexCode += c.length === 1 ? "0" + c : c;
  });
  return hexCode;
};

// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
var toHsl = () => {
  var channels;
  var r, g, b;
  channels = getChannels(pickedColor);
  
  r = channels[0];
  g = channels[1];
  b = channels[2];

  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if(max == min)
  {
      h = s = 0; 
  }
  else
  {
    var d = max - min;
    s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

    if(max == r && g >= b)
    {
        h = 1.0472 * (g - b) / d ;
    }
    else if(max == r && g < b)
    {
        h = 1.0472 * (g - b) / d + 6.2832;
    }
    else if(max == g)
    {
        h = 1.0472 * (b - r) / d + 2.0944;
    }
    else if(max == b)
    {
        h = 1.0472 * (r - g) / d + 4.1888;
    }
  }
  return {
      str: 'hsl(' + parseInt(h / 6.2832 * 360.0 + 0.5) + ', ' + parseInt(s * 100.0 + 0.5) + '%, ' + parseInt(l * 100.0 + 0.5) + '%)',
      obj: { h: parseInt(h / 6.2832 * 360.0 + 0.5), s: parseInt(s * 100.0 + 0.5), l: parseInt(l * 100.0 + 0.5) }
  };
};


var setBackgroundColors = (color) => {
  var channels;
  squares.forEach((v, i, a) => {
    v.style.backgroundColor = color;
    channels = darkenColor(getChannels(color));
    v.style.boxShadow = "0px 6px rgb(" + channels[0] + ", " + channels[1] + ", " + channels[2] + ")";
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

var correctGuess = (el, clickedColor) => {
  squares.forEach(function(s) {
    if (s.style.boxShadow = "none") {
      s.style.top = "-3px";
    }
  });
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
};

var incorrectGuess = (el) => {
  displayMessage("Sorry, try again!");
  el.style.top = "3px";
  el.style.boxShadow = "none";
  if (soundBtn.classList.contains("selected")) {
    incorrectAudio.currentTime = 0;
    incorrectAudio.play();
  }
  if (speechBtn.classList.contains("selected")) {
    speak(insults[genRandomNumber(0, insults.length - 1)]);
  }
};

var setUpEventHandlers = (el) => {
  el.addEventListener("click", function() {
    var clickedColor = this.style.backgroundColor;
    if (clickedColor == pickedColor) {
      correctGuess(el, clickedColor);
    }
    else {
      incorrectGuess(el);
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
  showSelectedMode();
  heading.style.backgroundColor = 'steelblue';
  resetButton.textContent = "New Colors";
  displayMessage("Let's Play A Game!");
  resetColors();
});

numberBaseBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    numberBaseBtns.forEach(function(b, i) {
      b.classList.remove("selected");
    });
    this.classList.add("selected");
    showSelectedMode();
  });
});
