/*	Copyright 2007-2009 by K. Kraus (kk738@vr-web.de)
    This file is part of StOgame.

    StOgame is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    StOgame is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with StOgame.  If not, see <http://www.gnu.org/licenses/>. */

// Simulator
// test by zibi

var gbItgr = "unitsintegrity";
var gbShd = "unitsshields";
var gbWap = "unitsweapons";
var gbRF = "shipsrapidfire";
var gb = {};
var vgbRF = null;
var RF2 = {};
var rounds = [1,2,3,4,5,6];
var attDam, attShd, attN, debFld;

function aktuShipVars(ShipVars) {
  gb = ShipVars
  vgbRF = gb[gbRF];
  for (var t in vgbRF) {
    RF2[Number(t)] = {};
    for (var t2 in vgbRF[t]) {
      RF2[Number(t)][Number(t2)] = vgbRF[t][t2];
    }
  }
}
function addShips(flt,tp,n,rsp,st,wap) {
  var vrsp = 1+rsp/10;
  var vst = 1+st/10;
  var vwap = 1+wap/10;
  if (n > 0) {
    if (!flt[tp]) {
      flt[tp] = {
        hulMax: gb[gbItgr][tp]*0.1*vrsp,
        hulK: gb[gbItgr][tp]*0.07*vrsp,
        hulE: gb[gbItgr][tp]*0.03*vrsp,
        shdMax: gb[gbShd][tp]*vst,
        shd1p: gb[gbShd][tp]*0.01*vst,
        dam: gb[gbWap][tp]*vwap,
        cnt: 0,
        shp: new Array()
      };
    }
    for (var i=0;i<n;i++) {
      var p = flt[tp].cnt;
      flt[tp].cnt = p+1;
      flt[tp].shp[p] = [flt[tp].hulMax, flt[tp].shdMax];
    }
  }
  return flt;
}
function cntShips(flt) {
  var cnt = 0;
  for (var t in flt) {
    cnt += flt[t].cnt;
  }
  return cnt;
}
function getShip(flt, n) {
  var s = n;
  for (var t in flt) {
    if (s >= flt[t].cnt) {
      s -= flt[t].cnt;
    } else
      return [t, s]
  }
}
function Atting(fFleet, dFleet) {
  var dc = cntShips(dFleet)-1
  for (var ft in fFleet) {
    for (var f in fFleet[ft].shp) {
      var a = fFleet[ft].dam // Init 1
      while (true) {
        var shp = getShip(dFleet, Math.floor(Math.random()*dc)); // Init 2
        var t2 = shp[0];
        var s = shp[1];
        attN += 1;
        if ((dFleet[t2].shd1p <= a)||(dFleet[t2].shp[s][1]==0)) {
          dFleet[t2].shp[s][1] -= a; // Fire one shot onto the shield
          attDam += a;
          attShd += a;
          if (dFleet[t2].shp[s][1] < 0) { // Damage on hull?
            attShd += dFleet[t2].shp[s][1];
            dFleet[t2].shp[s][0] += dFleet[t2].shp[s][1];
            dFleet[t2].shp[s][1] = 0;
          }
        }
        if (dFleet[t2].shp[s][0] <= dFleet[t2].hulK) { // does it explode?
          if ((dFleet[t2].shp[s][0] <= dFleet[t2].hulE) || (Math.random()>dFleet[t2].shp[s][0]/dFleet[t2].hulMax)) {
            dFleet[t2].shp[s][0] = 0;
          }
        }
        if ((!RF2[ft]) || (!RF2[ft][t2])) break; // break if there is no rapidfire
        if ((RF2[ft][t2]-1)/RF2[ft][t2]<Math.random()) break; // break if rapidfire has failed
      }
    }
  }
  return dFleet;
}
function restoreShield(flt) {
  for (var ft in flt) {
    for (var f in flt[ft].shp) {
      flt[ft].shp[f][1] = flt[ft].shdMax;
    }
  }
  return flt;
}
function explodeShps(flt) {
  for (var ft in flt) {
    if (flt[ft].cnt > 0) {
      var nShp = new Array();
      var ftDestr = 0;
      for (var f in flt[ft].shp) {
        if (flt[ft].shp[f][0] > 0) {
          nShp[nShp.length] = flt[ft].shp[f];
        } else {
          flt[ft].cnt -= 1;
          ftDestr++;
        }
      }
      var ftc = Number(ft);
      //var DiDF = false;
      //if (DiDF || (ftc>201&&ftc<216)) // This line is for later use
      if (ftc>201&&ftc<216)
        debFld += (gb["unitsmetcost"][ft]+gb["unitscrycost"][ft])*ftDestr*0.3;
      flt[ft].shp = nShp;
    }
  }
  return flt;
}
function getShipList(flt) {
  var res = {};
  for (var i in flt) {
    res[i] = flt[i].cnt;
  }
  return res;
}

function simulateCombat(data) {
  var aFlt = new Array(); // Init
  var vFlt = new Array();
  var cbArray = new Array();
  var crashed = false;
  
  // Daten einlesen
  try {
    postMessage({tp:"status",status:1}); // 1 = Init
    var Rsp = data.attRsp; // create Attackerfleet
    var Sht = data.attSht;
    var Wap = data.attWap;
    for (var e in data.attacker) {
      aFlt = addShips(aFlt,e,data.attacker[e],Rsp,Sht,Wap);
    }
    var Rsp = data.defRsp; // create Defenderfleet
    var Sht = data.defSht;
    var Wap = data.defWap;
    for (var e in data.defender) {
      vFlt = addShips(vFlt,e,data.defender[e],Rsp,Sht,Wap);
    }
    cbArray.push({
      attacker: { ships: getShipList(aFlt) },
      defender: { ships: getShipList(vFlt) }
    });
    var rsn = 1; // Nobody has won
    debFld = 0;
    for (var r in rounds) {
      postMessage({tp:"rounds",rounds:(Number(r)+1)});
      if (r != 0) {
        aFlt = restoreShield(aFlt);
        vFlt = restoreShield(vFlt);
      }
      var CBObj = {attacker: {}, defender: {}}; // Initialise the protocol object
      attDam = 0; attShd = 0; attN = 0; // Start attack from attacker
      vFlt = Atting(aFlt,vFlt); // attack
      CBObj.attacker = { // save the current data about the attacker
        timeShot: attN,
        createdDamage: attDam,
        absorbedDamage: attShd
      };
      attDam = 0; attShd = 0; attN = 0; // Start attack from defender
      aFlt = Atting(vFlt,aFlt); // attack
      CBObj.defender = { // save the current data about the defender
        timeShot: attN,
        createdDamage: attDam,
        absorbedDamage: attShd
      };
      aFlt = explodeShps(aFlt); // destroy the ships which have to much damage
      vFlt = explodeShps(vFlt);
      CBObj.attacker.ships = getShipList(aFlt); // Save shiplist
      CBObj.defender.ships = getShipList(vFlt);
      cbArray.push(CBObj); // Push into the result Array
      if (cntShips(vFlt) <= 0) { // Has anyone one?
        rsn = 2; // The atacker has won
        break;
      }
      if (cntShips(aFlt) <= 0) {
        rsn = 0; // The defender has won
        break;
      }
    }
  }
  catch (e) {
    postMessage({tp:"error",error:e.message,line:e.lineNumber}); // report the error
    crashed = true;
  }
  finally {
    if (!crashed) { // the battle was fought (that means: completion without errors)
      var m = {
        tp: "result",
        rounds: (Number(r)+1),
        result: rsn,
        debrisField: debFld,
        combat: cbArray
      };
      postMessage(m);
    }
    aFlt = null; // free used memory
    vFlt = null;
  }
}

onmessage = function (event) {
  if (event.data) {
    aktuShipVars(event.data.shipStats);
    simulateCombat(event.data.data);
  } else {
    postMessage({tp:"error",error:"No data to simulate!"});
    throw "No data to simulate!";
  }
}