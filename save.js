function searchNear() {
  for(let i = 0; i < players[currentplayer].points.length; i++) {
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
          if(!checkForConnection(thisx - spacing, thisy, thisx, thisy + spacing)) {
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
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
        if(thisx - spacing == otherx && thisy == othery) {
          //mid left
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
        if(thisx - spacing == otherx && thisy + spacing == othery) {
          //bottom left
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
        if(thisx == otherx && thisy + spacing == othery) {
          //bottom mid
          connections.push(new Connection(thisx, thisy, otherx, othery, players[currentplayer].r, players[currentplayer].g, players[currentplayer].b));
          pcc.push(new Cp(thisx, thisy));
        }
      }
    }
  }
}
