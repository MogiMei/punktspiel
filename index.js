let players = [];
let points = [];
let connections = [];
let turns = [];
let spacing = 50;
let currentplayer;

function setup() {
  document.addEventListener("keydown", keyHandler, false);
  colorMode(RGB);
	let canvas = createCanvas(1000, 1000);
  canvas.parent("sketch-holder");
  canvas.topBorder = spacing * 3;
  players.push(new Player("Mogi", 255, 0, 0));
  players.push(new Player("Daniel", 0, 255, 0));
  currentplayer = 0;
  turns.push(new Turn());
  document.getElementById("button1").addEventListener("click", function() {
    nextPlayer();
  });
}

function keyHandler(e) {
  let keyCode = e.keyCode;
  console.log(keyCode);
  if(keyCode == 13) {
    nextPlayer();
  } else if(keyCode == 87) {
    turns[turns.length - 1].mouseMove = false;
    if(!(turns[turns.length - 1].y - spacing < canvas.topBorder)) {
      turns[turns.length - 1].y -= spacing;
    } else {
      showAnnouncement("You are already at the top!", true);
    }
  } else if(keyCode == 83) {
    turns[turns.length - 1].mouseMove = false;
    if(!(turns[turns.length - 1].y + spacing > height)) {
      turns[turns.length - 1].y += spacing;
    } else {
      showAnnouncement("You are already at the bottom!", true);
    }
  } else if(keyCode == 65) {
    turns[turns.length - 1].mouseMove = false;
    if(!(turns[turns.length - 1].x - spacing < 0)) {
      turns[turns.length - 1].x -= spacing;
    } else {
      showAnnouncement("You are already at the left!", true);
    }
  } else if(keyCode == 68) {
    turns[turns.length - 1].mouseMove = false;
    if(!(turns[turns.length - 1].x + spacing > width)) {
      turns[turns.length - 1].x += spacing;
    } else {
      showAnnouncement("You are already at the right!", true);
    }
  } else if(keyCode == 81) {
    mouseClicked(undefined, true);
  }
}

function draw() {
	background(255);
  noStroke();
  textAlign(LEFT);
  textSize(25);
  text("Player: " + players[currentplayer].name, 20, 22.5);
  checkMouseMovement();
	drawGrid();
  drawConnection();
  drawPoints();
  showAnnouncement();
  noFill();
  stroke(0);
  ellipse(60, 80, 100, 100);
  turns[turns.length - 1].update();
  turns[turns.length - 1].elpse();
  turns[turns.length - 1].show();
}


function checkMouseMovement() {
  let that = turns[turns.length - 1];
  if(!turns[turns.length - 1].mouseMove) {
    turns[turns.length - 1].mouseMove = (mouseX != that.mX || mouseY != that.mY);
    if(turns[turns.length - 1].mouseMove) {
      turns[turns.length - 1].mX = mouseX;
      turns[turns.length - 1].mY = mouseY;
    }
  }
}

function Turn() {
  let that = this;
  this.x = Math.round(mouseX / spacing) * spacing;
  this.y = Math.round(mouseY / spacing) * spacing;
  this.mX = mouseX;
  this.mY = mouseY;
  this.mouseMove = true;
  this.name = players[currentplayer].name;
  this.drawPoint = false;
  this.time = 30; //Not Implemented yet but an idea for the future...
  this.arcstart = 0 - HALF_PI;
  this.arcstop = PI + PI /2 - 1 / 1000;
  this.timer = function() {
    if(that.time > 0) {
      that.time--;
      that.arcstop = map(that.time, 30, 0, Math.PI + Math.PI / 2, that.arcstart);
    }
  }
  this.show = function() {
    if(that.time != 0) {
      stroke(0);
      players[currentplayer].color();
      arc(60, 80, 100, 100, this.arcstart, this.arcstop - 1 / 1000, PIE);
    } else {
      clearInterval(this.interval);
      nextPlayer(true);
    }
    textAlign(CENTER);
    textSize(25);
    fill(0);
    noStroke();
    text(this.time, 140, 86.25);
  }

  this.update = function() {
    if(that.mouseMove) {
      this.x = Math.round(mouseX / spacing) * spacing;
      this.y = Math.round(mouseY / spacing) * spacing;
    }
  }

  this.elpse = function() {
    if(insideCanvas()) {
      players[currentplayer].color();
      stroke(0);
      ellipse(that.x, that.y, spacing / 4, spacing / 4);
    }
  }
  this.interval = setInterval(this.timer, 1000);
}

function drawGrid() {
	try {
    stroke(0);
		for(var i =  2; i < height / spacing; i++) {
			line(0, i * spacing + spacing, width, i * spacing + spacing);
		}
		for(var i = 0; i < width / spacing; i++) {
			line(i * spacing + spacing, spacing * 3, i * spacing + spacing, height);
		}
		return true;
	} catch(e) {
		console.log(e);
		return false;
	}
}

function drawPoints() {
  for(let i = 0; i < players.length; i++) {
    players[i].color();
    for(let j = 0; j < players[i].points.length; j++) {
      stroke(0);
      ellipse(players[i].points[j].x, players[i].points[j].y, spacing / 4, spacing / 4);
    }
  }
}

function drawConnection() {
  for(let i = 0; i < connections.length; i++) {
    stroke(connections[i].r, connections[i].g, connections[i].b);
    strokeWeight(4);
    line(connections[i].x1, connections[i].y1, connections[i].x2, connections[i].y2);
    strokeWeight(1);
  }
}

function Point(x, y, r, g, b) {
  if(x % spacing != 0 || y % spacing != 0) {
    alert("The point was not set correctly!");
  }
  this.x = x;
  this.y = y;
  this.color = color;
  this.neighbours = [];
}

function Player(name, r, g, b, id = players.length) {
  let that = this;
  this.name = name;
  this.r = r;
  this.g = g;
  this.b = b;
  this.color = function() {
    fill(r, g, b);
  };
  this.id = id;
  this.points = [];
  this.cps = [];
  this.score = 0;
  this.fails = 0;
  this.maxfails = 2;
  this.addFail = function() {
    if(that.fails + 1 != that.maxfails) {
      that.fails++;
    } else {
      showAnnouncement(players[currentplayer].name + " lost because he ran out of time twice!", true);
      noLoop();
    }
  }
}

function Connection(x1, y1, x2, y2, r, g, b) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.r = r;
  this.g = g;
  this.b = b;
}

function Cp(x, y) {
  this.x = x;
  this.y = y;
}

function nextPlayer(bool = false) {
  if(bool) {
    announcement = players[currentplayer].name + " ran out of time!";
    players[currentplayer].addFail();
  } else {
    announcement = "";
  }
  if(turns[turns.length - 1].drawPoint || bool) {
    if(currentplayer != players.length - 1) {
      currentplayer++;
    } else if(currentplayer >= players.length) {
      alert("An error occured!");
    } else {
      currentplayer = 0;
    }
    turns.push(new Turn());
  } else {
    alert("You have to place a point!");
  }
}

function mouseClicked(e, bool = false) {
  if(insideCanvas() || bool) {
    if(!turns[turns.length - 1].drawPoint) {
      let ok = addPoint();
      searchNear();
    } else{
      alert("You already placed a point! Please press END TURN if you want to end your turn.");
    }
  }
}

function addPoint() {
  let ok = true;
  let x = turns[turns.length - 1].x;
  let y = turns[turns.length - 1].y;
  for(let i = 0; i < points.length; i++) {
    if(points[i].x == x && points[i].y == y) {
      ok = false;
    }
  }
  let color = players[currentplayer].color;
  if(ok) {
    turns[turns.length - 1].drawPoint = true;
    let point = new Point(x, y, color);
    points.push(point);
    players[currentplayer].points.push(point);
    return true;
  } else {
    alert("There's already a point here!");
    return false;
  }
}

function searchNear() {
  let i = players[currentplayer].points.length - 1;
  for(let j = 0; j < players[currentplayer].points.length; j++) {
    if(j == i) {
      continue;
    } else {
      let thisx = players[currentplayer].points[i].x;
      let thisy = players[currentplayer].points[i].y;
      let otherx = players[currentplayer].points[j].x;
      let othery = players[currentplayer].points[j].y;
      stroke(players[currentplayer].r, players[currentplayer].g, players[currentplayer].b);
      /**
      EXAMPLE:
      if(thisx == otherx && thisy == othery) {
        connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
      }
      **/
      let pcc = players[currentplayer].cps;
      if(thisx + spacing == otherx && thisy == othery) {
        //mid right
        connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
        pcc.push(new Cp(thisx, thisy));
      }
      if(thisx + spacing == otherx && thisy - spacing == othery) {
        //top right
        if(!checkForConnection(thisx, thisy  - spacing, thisx + spacing, thisy)) {
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
      }
      if(thisx == otherx && thisy - spacing == othery) {
        //top mid
        connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
        pcc.push(new Cp(thisx, thisy));
      }
      if(thisx - spacing == otherx && thisy - spacing == othery) {
        //top left
        if(!checkForConnection(thisx - spacing, thisy, thisx, thisy - spacing)) {
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
      }
      if(thisx - spacing == otherx && thisy == othery) {
        //mid left
        connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
        pcc.push(new Cp(thisx, thisy));
      }
      if(thisx - spacing == otherx && thisy + spacing == othery) {
        //bottom left
        if(!checkForConnection(thisx - spacing, thisy, thisx, thisy + spacing)) {
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
      }
      if(thisx == otherx && thisy + spacing == othery) {
        //bottom mid
        connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
        pcc.push(new Cp(thisx, thisy));
      }
      if(thisx + spacing == otherx && thisy + spacing == othery) {
        //bottom right
        if(!checkForConnection(thisx, thisy + spacing, thisx + spacing, thisy)) {
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
      }
    }
  }
}

function checkForConnection(x1, y1, x2, y2) {
  let found = {
    first: false,
    second: false
  };
  for(let i = 0; i < players.length; i++) {
    if(i == currentplayer) {
      continue;
    } else {
      for(let j = 0; j < players[i].points.length; j++) {
        //console.log(x1, y1, players[i].points[j].x, players[i].points[j].y);
        if(x1 == players[i].points[j].x && y1 == players[i].points[j].y) {
          found.first = true;
        }
        if(x2 == players[i].points[j].x && y2 == players[i].points[j].y) {
          found.second = true;
        }
        if(found.first && found.second) {
          return true;
        }
      }
    }
  }
  return false;
}

function searchSurrounding() {
  for(let i = 0; i < connections.length; i++) {
    let startx = connections[i].x1;
    let starty = connections[i].y1;
    for(let j = 0; j < connections[i].cps.length; j++) {

    }
  }
}

function insideCanvas() {
  return (mouseX >= 0 && mouseX <= width && mouseY >= spacing * 3 && mouseY <= height);
}

let announcement = "";
let anw;


function showAnnouncement(txt = announcement, bool = false) {
  textAlign(CENTER);
  textSize(30);
  if(bool && anw != undefined) {
    fill(255);
    noStroke();
    rect(width  / 2 - anw / 2, spacing * 3 / 2 - 30, anw, 33);
  }
  fill(255, 0, 0);
  stroke(255, 0, 0);
  text(txt, width / 2, spacing * 3 / 2);
  anw = textWidth(txt);
}

let path;

function searchSur() {
  for(let i = 0; i < points.length; i++) {

  }
}

function pathPoint(x, y) {
  this.x = x;
  this.y = y;
  this.checkedNeighbours = [];
}
