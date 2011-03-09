/*	Copyright 2007-2009 by Marco Pivetta (ocramius@gmail.com)
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
/************************************************************************************************************************************************
//THIS OBJECT IS USED TO GET DATA FROM STOGAME WITHOUT ANY WAY TO INTERACT WITH MOZILLA FIREFOX
//EVERY INTERFACE ALLOWS LIMITED ACTIONS SUCH AS GETTING A PLAYER LIST OR SAVING A SR TO DB
************************************************************************************************************************************************/

function OgameAccount(language,universe,ogameid)
{
	this.language	=	language;
	this.universe	=	universe;
	this.ogameid	=	ogameid;
}

//FOR TEST PURPOSES ONLY!!! DON'T ENABLE IT IN FINAL VERSION!!!
/*
OgameAccount.prototype.run=function(code)
{
	eval(code);
}
*/
//FOR TEST PURPOSES ONLY!!! DON'T ENABLE IT IN FINAL VERSION FOR NOW!!!
/*
OgameAccount.prototype.setFullscreen=function(bool_flag)
{
	window.fullScreen=(1&&bool_flag);
}
*/

OgameAccount.prototype.getLanguage=function()
{
	return this.account.language;
}

OgameAccount.prototype.getUniverse=function()
{
	return this.account.universe;
}

OgameAccount.prototype.getVersion=function()
{
	return this.account.version;
}

OgameAccount.prototype.getOgameid=function()
{
	return this.account.ogameid;
}

OgameAccount.prototype.getLanguageLocalizationString=function(type,name)
{
	return localization.getLocalizationString(this.language,type,name);
}

OgameAccount.prototype.getLocalizationString=function(type,name)
{
	var language=this.getOption("stogame_texts","language");
	if(!language)
	{
		this.setOption("stogame_texts","language",this.language);
		language=this.getOption("stogame_texts","language");
	}
	if(language.value!=this.language)
	{
		localization.retrieveLocalizationStrings(language.value);
	}
	return localization.getLocalizationString(language.value,type,name);
}

OgameAccount.prototype.getGidByString=function(name)
{
	return localization.getGidByString(this.language,name);
}

OgameAccount.prototype.setLocalizationString=function(type,name,value)
{
	return localization.setLocalizationString(this.language,type,name,value);
}

OgameAccount.prototype.getUniverseDomain=function()
{
	return localization.unis[this.language][this.universe]["domain"];
}

OgameAccount.prototype.getUniverseSpeed=function()
{
	return localization.unis[this.language][this.universe]["speed"];
}


//FROM ACCOUNT

//NOT WORKING ANYMORE?
OgameAccount.prototype.getNickName=function()
{
	return this.account.nickname;
}

//NOT WORKING ANYMORE?
OgameAccount.prototype.getUserAlliance=function()
{
	return this.account.alliance;
}

OgameAccount.prototype.getEmail=function()
{
	return this.account.email;
}

OgameAccount.prototype.getCommander=function()
{
	return this.account.commander;
}

OgameAccount.prototype.getAdmiral=function()
{
	return this.account.admiral;
}

OgameAccount.prototype.getEngineer=function()
{
	return this.account.engineer;
}

OgameAccount.prototype.getGeologist=function()
{
	return this.account.geologist;
}

OgameAccount.prototype.getTechnocrat=function()
{
	return this.account.technocrat;
}

OgameAccount.prototype.getSkin=function()
{
	return this.account.skin;
}

OgameAccount.prototype.getOgameSession=function()
{
	return this.account.lastsessionid;
}

OgameAccount.prototype.getAccountUpdateTimestamp=function()
{
	return this.account.updated;
}

OgameAccount.prototype.getDarkMatter=function()
{
	return this.account.darkmatter;
}

//FROM TECHNOLOGIES
OgameAccount.prototype.getTechnology=function(gid)
{
	return ST_parseInt(this.account.technologies.technology[gid]);
}

OgameAccount.prototype._getTechnology=function(gid)
{
	return {
		"level":	ST_parseInt(this.account.technologies.technology[gid]),
		"update":	ST_parseInt(this.account.technologies.technologyupdates[gid])
	};
}

OgameAccount.prototype.getTechnologyUpdateTimestamp=function(gid)
{
	return ST_parseInt(this.account.technologies.technologyupdates[gid]);
}

OgameAccount.prototype.getTechnologyChangesHistory=function(gid)
{
	return this.account.technologies.getLog(gid);
}

//FROM PLANETS
OgameAccount.prototype.getPlanetsNumber=function()
{
	return this.account.planets.planetids.length;
}

OgameAccount.prototype.getCurrentPlanet=function()
{
	return this.account.planets.currentplanet;
}

OgameAccount.prototype.getPlanetCp=function(planetid)
{
	return this.account.planets.planetids[planetid];
}

OgameAccount.prototype.getPlanetId=function(planetcp)
{
	return this.account.planets.planets[planetcp].id;
}

OgameAccount.prototype.getPlanetCpByCoords=function(x,y,z,ismoon)
{
	return this.account.planets.planetids[this.getPlanetIdByCoords(x,y,z,ismoon)];
}

OgameAccount.prototype.getPlanetIdByCoords=function(x,y,z,ismoon)
{	
	return this.account.planets.getPlanetIdByCoords(x,y,z,ismoon);
}

OgameAccount.prototype.getPlanetX=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].x;
}

OgameAccount.prototype.getPlanetY=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].y;	
}

OgameAccount.prototype.getPlanetZ=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].z;
}

OgameAccount.prototype.getPlanetIsMoon=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].ismoon;
}

OgameAccount.prototype.getPlanetGroup=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].group;
}

OgameAccount.prototype.getPlanetType=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].type;
}

OgameAccount.prototype.getPlanetName=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].name;
}

OgameAccount.prototype.getPlanetDiameter=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].diameter;
}

OgameAccount.prototype.getPlanetMaxSpaces=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getMaxSpaces();
}

OgameAccount.prototype.getPlanetCurrentSpaces=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getCurrentSpaces();
}

OgameAccount.prototype.getPlanetFilledSpaces=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getFilledSpaces();
}

OgameAccount.prototype.getPlanetFreeSpaces=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getFreeSpaces();
}

OgameAccount.prototype.getPlanetExpandedSpaces=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getExpandedSpaces();
}

OgameAccount.prototype.getPlanetMaxTemp=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].maxtemp;
}

OgameAccount.prototype.getPlanetMinTemp=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].mintemp;
}

OgameAccount.prototype.getPlanetFirstAppearanceTimestamp=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].creation;
}

OgameAccount.prototype.getPlanetMet=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getMet();
}

OgameAccount.prototype.getPlanetCry=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getCry();
}

OgameAccount.prototype.getPlanetDeu=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getDeu();
}

OgameAccount.prototype.getPlanetSolTheoricalProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getSolTheoricalProduction();
}

OgameAccount.prototype.getPlanetFusTheoricalProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getFusTheoricalProduction();
}

OgameAccount.prototype.getPlanetSatTheoricalProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getSatTheoricalProduction();
}

OgameAccount.prototype.getPlanetSolProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getSolProduction();
}

OgameAccount.prototype.getPlanetFusProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getFusProduction();
}

OgameAccount.prototype.getPlanetSatProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getSatProduction();
}

OgameAccount.prototype.getPlanetFusTheoricalConsumption=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getFusTheoricalConsumption();
}

OgameAccount.prototype.getPlanetFusConsumption=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getFusConsumption();
}

OgameAccount.prototype.getPlanetTheoricalEnergyProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getTheoricalEnergyProduction();
}

OgameAccount.prototype.getPlanetEnergyProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getEnergyProduction();
}

OgameAccount.prototype.getPlanetEnergyConsumption=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getEnergyConsumption();
}

OgameAccount.prototype.getPlanetProductionRatio=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getProductionRatio();
}

OgameAccount.prototype.getPlanetMetCapacity=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getMetCapacity();
}

OgameAccount.prototype.getPlanetCryCapacity=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getCryCapacity();
}

OgameAccount.prototype.getPlanetDeuCapacity=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getDeuCapacity();
}

OgameAccount.prototype.getPlanetMetTheoricalProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getMetTheoricalProduction();
}

OgameAccount.prototype.getPlanetCryTheoricalProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getCryTheoricalProduction();
}

OgameAccount.prototype.getPlanetDeuTheoricalProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getDeuTheoricalProduction();
}

OgameAccount.prototype.getPlanetMetProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getMetProduction();
}

OgameAccount.prototype.getPlanetCryProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getCryProduction();
}

OgameAccount.prototype.getPlanetDeuProduction=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].getDeuProduction();
}

OgameAccount.prototype.getPlanetResourcesUpdateTimestamp=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].resourcesupdate;
}

OgameAccount.prototype.getPlanetMetPercentage=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].metpercentage;
}

OgameAccount.prototype.getPlanetCryPercentage=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].crypercentage;
}

OgameAccount.prototype.getPlanetDeuPercentage=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].deupercentage;
}

OgameAccount.prototype.getPlanetSolPercentage=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].solpercentage;
}

OgameAccount.prototype.getPlanetFusPercentage=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].fuspercentage;
}

OgameAccount.prototype.getPlanetSatPercentage=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].satpercentage;
}

OgameAccount.prototype.getPlanetPercentagesUpdateTimestamp=function(planetid)
{	
	return this.account.planets[this.account.planets.planetids[planetid]].percentagesupdate;
}

OgameAccount.prototype.getPlanetBuilding=function(planetid,gid)
{
	return this.account.planets[this.account.planets.planetids[planetid]]["building_"+ST_parseInt(gid)];
}

OgameAccount.prototype.getMoonBuilding=function(planetid,gid)
{
	return this.account.planets[this.account.planets.planetids[planetid]]["moonbuilding_"+ST_parseInt(gid)];
}

OgameAccount.prototype.getPlanetBuildingsUpdateTimestamp=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].buildingsupdate;
}

OgameAccount.prototype.getPlanetShips=function(planetid,gid)
{
	return this.account.planets[this.account.planets.planetids[planetid]]["ships_"+ST_parseInt(gid)];
}

OgameAccount.prototype.getPlanetShipsUpdateTimestamp=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].shipsupdate;
}

OgameAccount.prototype.getPlanetDefenses=function(planetid,gid)
{
	return this.account.planets[this.account.planets.planetids[planetid]]["defense_"+ST_parseInt(gid)];
}

OgameAccount.prototype.getPlanetRockets=function(planetid,gid)
{
	return this.account.planets[this.account.planets.planetids[planetid]]["rockets_"+ST_parseInt(gid)];
}

OgameAccount.prototype.getPlanetDefensesUpdateTimestamp=function(planetid)
{
	return this.account.planets[this.account.planets.planetids[planetid]].defensesupdate;
}

OgameAccount.prototype.getPlanetLoggedVariable=function(planetid,loggedvarname)
{
	return this.account.planets[this.account.planets.planetids[planetid]].getLog(String(loggedvarname));
}

//EVENTS
OgameAccount.prototype.getPlanetBuildingsEvents=function(planetid)
{
	return this.account.events.getPlanetsBuildingsEvents(this.account.planets.planetids[planetid]);
}

OgameAccount.prototype.getPlanetsShipyardEvents=function(planetid)
{
	return this.account.events.getPlanetsShipyardEvents(this.account.planets.planetids[planetid]);
}

OgameAccount.prototype.getResearchEvents=function()
{
	return this.account.events.getResearchEvents();
}

//UPCOMING: EVENTS - NOTES
//COMBATREPORTS
OgameAccount.prototype.getCombatReports=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.combatreports.get(filter);
}

//CIRCULAR MAILS
OgameAccount.prototype.getCircularMails=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.circularmails.get(filter);
}

//MESSAGES
OgameAccount.prototype.getPrivateMessages=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.messages.get(filter);
}

//SENT MESSAGES
OgameAccount.prototype.getSentMessages=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.sentmessages.get(filter);
}


//SPYLOGS
OgameAccount.prototype.getSpyLogs=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.sightedmessages.get(filter);
}

//SPYREPORTS
OgameAccount.prototype.getSpyReports=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.spyreports.getSpyReports(filter);
}

//PLAYER SPYED RESEARCHES
OgameAccount.prototype.getSpyResearches=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.messages.spyreports.getSpyResearches(filter);
}

//PLANETS IN GALAXY
OgameAccount.prototype.getPlanets=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.galaxy.getPlanets(filter);
}

//ACTIVITIES OF GALAXY
OgameAccount.prototype.getActivities=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.galaxy.getActivities(filter);
}

//ALLIANCES
OgameAccount.prototype.getAlliances=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.ranks.getAlliances(filter);
}

//PLAYERS
OgameAccount.prototype.getPlayers=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.ranks.getPlayers(filter);
}

//TOTAL PLAYERS
OgameAccount.prototype.getTotalPlayers=function()
{
	return this.account.ranks.getTotalPlayers();
}

//GALAXY
OgameAccount.prototype.getSystem=function(x,y)
{
	return this.account.galaxy.getSystem(x,y);
}

//NOTES
OgameAccount.prototype.setGalaxyNote=function(x,y,z,ismoon,note)
{
	return this.account.notes.setGalaxyNote(x,y,z,ismoon,0,note);
}

OgameAccount.prototype.getGalaxyNotes=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.notes.getGalaxyNotes(filter);
}

OgameAccount.prototype.setPlayerNote=function(ogameid,note)
{
	return this.account.notes.setPlayerNote(ogameid,0,note);
}

OgameAccount.prototype.getPlayerNotes=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.notes.getPlayerNotes(filter);
}

OgameAccount.prototype.setAllianceNote=function(allyid,note)
{
	return this.account.notes.setAllianceNote(allyid,0,note);
}

OgameAccount.prototype.getAllianceNotes=function(filter)
{
	if(typeof filter!="object"){filter={};}
	return this.account.notes.getAllianceNotes(filter);
}








OgameAccount.prototype.getPlanetsByName=function(name)
{
	return this.account.galaxy.getPlanetsByName(name);
}

OgameAccount.prototype.getPlanetsByOgameid=function(ogameid)
{
	return this.account.galaxy.getPlanetsByOgameid(ogameid);
}


//RANKS
OgameAccount.prototype.getPlayer=function(ogameid)
{
	return this.account.ranks.getPlayer(ogameid);
}

OgameAccount.prototype.getPlayersByNickname=function(nickname)
{
	return this.account.ranks.getPlayersByNickname(nickname);
}


OgameAccount.prototype.getAlliance=function(id)
{
	return this.account.ranks.getAlliance(ST_parseInt(id));
}

OgameAccount.prototype.getAllianceByTag=function(tag)
{
	return this.account.ranks.getAllianceByTag(tag);
}

OgameAccount.prototype.getAlliancesBySimilarTag=function(tag)
{
	return this.account.ranks.getAlliancesBySimilarTag(tag);
}

//SPY REPORTS
OgameAccount.prototype.getSpyReport=function(x,y,z,ismoon)
{
	return this.account.messages.spyreports.getPlanet(x,y,z,ismoon);
}

//STOGALAXY
OgameAccount.prototype.getStOGalaxyStatus=function()
{
	return this.account.stogalaxy.status;
}

OgameAccount.prototype.getStOGalaxySession=function()
{
	return this.account.stogalaxy.sessionid;
}

OgameAccount.prototype.getStOGalaxyPassword=function()
{
	return this.account.stogalaxy.password;
}

OgameAccount.prototype.setStOGalaxyPassword=function(password)
{
	return this.account.stogalaxy.setPassword(password);
}

OgameAccount.prototype.getStOGalaxyEmail=function()
{
	return this.account.stogalaxy.email;
}

OgameAccount.prototype.setStOGalaxyEmail=function(email)
{
	return this.account.stogalaxy.setEmail(email);
}

OgameAccount.prototype.registerStOGalaxyAccount=function()
{
	return this.account.stogalaxy.registerNewAccount();
}

OgameAccount.prototype.getNewStOGalaxySession=function()
{
	return this.account.stogalaxy.getNewSession();
}

OgameAccount.prototype.checkStOGalaxyStatus=function()
{
	return this.account.stogalaxy.checkStatus();
}

OgameAccount.prototype.requestNewStOGalaxyPassword=function()
{
	return this.account.stogalaxy.requestNewPassword();
}

OgameAccount.prototype.enableStOGalaxy=function()
{
	return this.account.stogalaxy.enable();
}

OgameAccount.prototype.disableStOGalaxy=function()
{
	return this.account.stogalaxy.disable();
}

//OPTIONS
OgameAccount.prototype.getOption=function(type,name)
{
	return this.account.options.getOption(type,name);
}

OgameAccount.prototype.setOption=function(type,name,value)
{
	this.account.options.setOption(type,name,value);
}

OgameAccount.prototype.removeOption=function(type,name)
{
	this.account.options.removeOption(type,name);
}

OgameAccount.prototype.updateOption=function(type,name,index,value)
{
	this.account.options.updateOption(type,name,index,value);
}

OgameAccount.prototype.getOptionStack=function(type,name)
{
	return this.account.options.getOptionStack(type,name);
}

OgameAccount.prototype.stackOption=function(type,name,value)
{
	this.account.options.stackOption(type,name,value);
}

OgameAccount.prototype.unstackOption=function(type,name,index)
{
	this.account.options.unstackOption(type,name,index);
}

//GLOBAL OPTIONS
OgameAccount.prototype.getGlobalOption=function(type,name)
{
	return st_globaloptions.getOption(type,name);
}

OgameAccount.prototype.setGlobalOption=function(type,name,value)
{
	st_globaloptions.setOption(type,name,value);
}

OgameAccount.prototype.removeGlobalOption=function(type,name)
{
	st_globaloptions.removeOption(type,name);
}

OgameAccount.prototype.updateGlobalOption=function(type,name,index,value)
{
	st_globaloptions.updateOption(type,name,index,value);
}

OgameAccount.prototype.getGlobalOptionStack=function(type,name)
{
	return st_globaloptions.getOptionStack(type,name);
}

OgameAccount.prototype.stackGlobalOption=function(type,name,value)
{
	st_globaloptions.stackOption(type,name,value);
}

OgameAccount.prototype.unstackGlobalOption=function(type,name,index)
{
	st_globaloptions.unstackOption(type,name,index);
}

/* SIMULATOR
 Data_structure for normal shipVars:
  { data: window.location.search }
 Data_structure for modified shipVars:
  { data: window.location.search, shipsStats: MODIFIED_GLOBALVARS }
*/
OgameAccount.prototype.simulate=function(data,callback)
{
	var worker=new Worker("chrome://stogame/content/includes/SimulatorWorker.js");
  var self=this;
  var $_GET = eval("({"+data.data.split("?")[1].replace(/=/g,":'").replace(/&/g,"',")+"'})");
  function getShipsFromURL(urla,t) {
    var shpList = {};
    for (var i=202;i<216;i++) {
      if (urla[t+i]) shpList[i] = Number(urla[t+i]);
    }
    if (t=="d") {
      for (var i=401;i<409;i++) {
        if (urla[t+i]) shpList[i] = Number(urla[t+i]);
      }
    }
    return shpList;
  }
  var sData = {
    attRsp: $_GET.attRsp,
    attSht: $_GET.attSht,
    attWap: $_GET.attWap,
    attacker: getShipsFromURL($_GET,"a"),
    defRsp: $_GET.defRsp,
    defSht: $_GET.defSht,
    defWap: $_GET.defWap,
    defender: getShipsFromURL($_GET,"d")
  };
	worker.onmessage=function(event){
		worker.onworkermessage.call(self, event);  
	};
	worker.onworkermessage=function(event){
		callback({data:event.data,event:event});
	}
  if (data.shipStats) {
  	worker.postMessage({data:sData,shipStats:data.shipStats});
  } else {
  	worker.postMessage({data:sData,shipStats:GlobalVars});
  }
}

//OTHER - MISC
OgameAccount.prototype.getPlanetImage=function(group,type)
{
	return (((group<0)||(type<0))?("mond"):(GlobalVars["planetgroups"][group]+"0"+type))+".jpg";
}

OgameAccount.prototype.getMetLevelUpgradeCost=function(gid,level)
{
	return GlobalVars["baselevelmetcosts"][String(gid)]*(Math.pow(GlobalVars["levelupgradecostincrements"][String(gid)],level-1));
}

OgameAccount.prototype.getCryLevelUpgradeCost=function(gid,level)
{
	return GlobalVars["baselevelcrycosts"][String(gid)]*(Math.pow(GlobalVars["levelupgradecostincrements"][String(gid)],level-1));
}

OgameAccount.prototype.getDeuLevelUpgradeCost=function(gid,level)
{
	return GlobalVars["baseleveldeucosts"][String(gid)]*(Math.pow(GlobalVars["levelupgradecostincrements"][String(gid)],level-1));
}

OgameAccount.prototype.getEneLevelUpgradeCost=function(gid,level)
{
	return GlobalVars["baselevelenecosts"][String(gid)]*(Math.pow(GlobalVars["levelupgradecostincrements"][String(gid)],level-1));
}

OgameAccount.prototype.getShipSpeed=function(gid)
{
	return (GlobalVars["shipspeed"][gid].upgradespeed>0)?((GlobalVars["shipspeed"][gid].upgradelevel<=this.getTechnology(GlobalVars["shipspeed"][gid].upgradetech))?(GlobalVars["shipspeed"][gid].upgradespeed*(1+(GlobalVars["shipspeed"][gid].upgradespeedincrement*this.getTechnology(GlobalVars["shipspeed"][gid].upgradetech)))):(GlobalVars["shipspeed"][gid].basespeed*(1+(GlobalVars["shipspeed"][gid].speedincrement*this.getTechnology(GlobalVars["shipspeed"][gid].tech))))):(GlobalVars["shipspeed"][gid].basespeed*(1+(GlobalVars["shipspeed"][gid].speedincrement*this.getTechnology(GlobalVars["shipspeed"][gid].tech))));
}

OgameAccount.prototype.getServerTimestamp=function()
{
	return this.account.getServerTimestamp();
}

OgameAccount.prototype.getClientTimestamp=function()
{
	return this.account.getClientTimestamp();
}

OgameAccount.prototype.StOGalaxyIframeURL=function(event,folder,page,width,height)
{
	return 	" "+event+"=\"return fwindow("+width+","+height+",\'http://standardogame.mozdev.org/ogamehtmlincludes/iframes/index.php?"
			+"folder="+folder
			+"&page="+page
			+"&language="+this.getLanguage()
			+"&universe="+this.getUniverse()
			+"&ogameid="+this.getOgameid()
			+"&session="+this.getStOGalaxySession()
			+"\')\" ";
}

OgameAccount.prototype.ST_parseInt=function(str)
{
	return ST_parseInt(str);
}

OgameAccount.prototype.ST_trim=function(str)
{
	return ST_trim(str);
}

OgameAccount.prototype.ST_number_format=function(n,c)
{
	return ST_number_format(n,c);
}

OgameAccount.prototype.ST_countdown_from_timestamp=function(a,b,c,d,e)
{
	return ST_countdown_from_timestamp(a,b,c,d,e);
}

OgameAccount.prototype.getGlobalVars=function()
{
	var globalvars=GlobalVars;
	return globalvars;
}

OgameAccount.prototype.ST_date_from_timestamp=function(a)
{
	return ST_date_from_timestamp(a);
}

OgameAccount.prototype.getTotalMetValue=function(gid,level)
{
	return GlobalVars.baselevelmetcosts[gid]*(1-Math.pow(GlobalVars.levelupgradecostincrements[gid],level))/(1-GlobalVars.levelupgradecostincrements[gid]);
}

OgameAccount.prototype.getTotalCryValue=function(gid,level)
{
	return GlobalVars.baselevelcrycosts[gid]*(1-Math.pow(GlobalVars.levelupgradecostincrements[gid],level))/(1-GlobalVars.levelupgradecostincrements[gid]);
}

OgameAccount.prototype.getTotalDeuValue=function(gid,level)
{
	return GlobalVars.baseleveldeucosts[gid]*(1-Math.pow(GlobalVars.levelupgradecostincrements[gid],level))/(1-GlobalVars.levelupgradecostincrements[gid]);
}

//XMPP

OgameAccount.prototype.getChat=function()
{
	return this.account.stogalaxy.xmpp.getChat();
}

OgameAccount.prototype.sendStanza=function(stanza,callbackfunction)
{
	this.account.stogalaxy.xmpp.send(stanza,callbackfunction);
}

OgameAccount.prototype.get=function()
{
	var o=this;
	//code to check if current domain is allowed to use StOGalaxy on this account
	return {
		"getLanguage":						function()							{return o.getLanguage();									},
		"getUniverse":						function()							{return o.getUniverse();									},
		"getOgameid":						function()							{return o.getOgameid();										},
		"getVersion":						function()							{return o.getVersion();										},
		"getLanguage":						function()							{return o.getLanguage();									},
		"getLocalizationString":			function(type,name)					{return o.getLocalizationString(type,name);					},
		"getLanguageLocalizationString":	function(type,name)					{return o.getLanguageLocalizationString(type,name);			},
		"setLocalizationString":			function(type,name,value)			{return o.setLocalizationString(type,name,value);			},
		"getGidByString":					function(name)						{return o.getGidByString(name);								},
		"getUniverseDomain":				function()							{return o.getUniverseDomain();								},
		"getUniverseSpeed":					function()							{return o.getUniverseSpeed();								},
		"getCommander":						function()							{return o.getCommander();									},
		"getAdmiral":						function()							{return o.getAdmiral();										},
		"getEngineer":						function()							{return o.getEngineer();									},
		"getGeologist":						function()							{return o.getGeologist();									},
		"getGeologist":						function()							{return o.getGeologist();									},
		"getTechnocrat":					function()							{return o.getTechnocrat();									},
		"getOgameSession":					function()							{return o.getOgameSession();								},
		"getAccountUpdateTimestamp":		function()							{return o.getAccountUpdateTimestamp();						},
		"getDarkMatter":					function()							{return o.getDarkMatter();									},
		"getTechnology":					function(gid)						{return o._getTechnology(gid);								},
		"getTechnologyHistory":				function(gid)						{return o.getTechnologyChangesHistory(gid);					},
		"getOwnPlanetsCount":				function()							{return o.getPlanetsNumber();								},
		"getOwnCurrentPlanetId":			function()							{return o.getCurrentPlanet();								},
		"getOwnPlanetId":					function(planetcp)					{return o.getPlanetId(planetcp);							},
		"getOwnPlanetIdByCoords":			function(x,y,z,ismoon)				{return o.getPlanetCpByCoords(x,y,z,ismoon);				},
		"getOwnPlanetIdByCoords":			function(x,y,z,ismoon)				{return o.getPlanetIdByCoords(x,y,z,ismoon);				},
		"getOwnPlanet":						function(planetid)					{return o.getOwnPlanet(planetid);							},
		"getCombatReports":					function(filter)					{return o.getCombatReports(filter);							},
		"getCircularMails":					function(filter)					{return o.getCircularMails(filter);							},
		"getPrivateMessages":				function(filter)					{return o.getPrivateMessages(filter);						},
		"getSentMessages":					function(filter)					{return o.getSentMessages(filter);							},
		"getSpyLogs":						function(filter)					{return o.getSpyLogs(filter);								},
		"getSpyReports":					function(filter)					{return o.getSpyReports(filter);							},
		"getSpyResearches":					function(filter)					{return o.getSpyResearches(filter);							},
		"getPlanets":						function(filter)					{return o.getPlanets(filter);								},
		"getActivities":					function(filter)					{return o.getActivities(filter);							},
		"getAlliances":						function(filter)					{return o.getAlliances(filter);								},
		"getPlayers":						function(filter)					{return o.getPlayers(filter);								},
		"getTotalPlayers":					function()							{return o.getTotalPlayers(filter);							},
		"getStOGalaxyStatus":				function()							{return o.getStOGalaxyStatus();								},
		"getStOGalaxySession":				function()							{return o.getStOGalaxySession();							},
		"getStOGalaxyPassword":				function()							{return o.getStOGalaxyPassword();							},
		"setStOGalaxyPassword":				function(password)					{return o.setStOGalaxyPassword(password);					},
		"getStOGalaxyEmail":				function()							{return o.getStOGalaxyEmail();								},
		"setStOGalaxyEmail":				function(email)						{return o.setStOGalaxyEmail(email);							},
		"registerStOGalaxyAccount":			function()							{return o.registerStOGalaxyAccount();						},
		"getNewStOGalaxySession":			function()							{return o.getNewStOGalaxySession();							},
		"checkStOGalaxyStatus":				function()							{return o.checkStOGalaxyStatus();							},
		"requestNewStOGalaxyPassword":		function()							{return o.requestNewStOGalaxyPassword();					},
		"enableStOGalaxy":					function()							{return o.enableStOGalaxy();								},
		"disableStOGalaxy":					function()							{return o.disableStOGalaxy();								},
		
		"getOption":						function(type,name)					{return o.getOption(type,name);								},
		"setOption":						function(type,name,value)			{return o.setOption(type,name,value);						},
		"removeOption":						function(type,name)					{return o.removeOption(type,name);							},
		"updateOption":						function(type,name,index,value)		{return o.updateOption(type,name,index,value);				},
		"getOptionStack":					function(type,name)					{return o.getOptionStack(type,name);						},
		"stackOption":						function(type,name,value)			{return o.stackOption(type,name,value);						},
		"unstackOption":					function(type,name,index)			{return o.unstackOption(type,name,index);					},
		
		"getGlobalOption":					function(type,name)					{return o.getGlobalOption(type,name);						},
		"setGlobalOption":					function(type,name,value)			{return o.setGlobalOption(type,name,value);					},
		"removeGlobalOption":				function(type,name)					{return o.removeGlobalOption(type,name);					},
		"updateGlobalOption":				function(type,name,index,value)		{return o.updateGlobalOption(type,name,index,value);		},
		"getGlobalOptionStack":				function(type,name)					{return o.getGlobalOptionStack(type,name);					},
		"stackGlobalOption":				function(type,name,value)			{return o.stackGlobalOption(type,name,value);				},
		"unstackGlobalOption":				function(type,name,index)			{return o.unstackGlobalOption(type,name,index);				},
		
		"getServerTimestamp":				function()							{return o.getServerTimestamp();								},
		"getClientTimestamp":				function()							{return o.getClientTimestamp();								},
		"getChat":							function()							{return o.getChat();										},
		"sendStanza":						function(stanza,callback)			{return o.sendStanza(stanza,callback);						},
		
		"setGalaxyNote":					function(x,y,z,ismoon,note)			{return o.setGalaxyNote(x,y,z,ismoon,note);					},
		"getGalaxyNotes":					function(filter)					{return o.getGalaxyNotes(filter);							},
		"setAllianceNote":					function(id,note)					{return o.setAllianceNote(id,note);							},
		"getAllianceNotes":					function(filter)					{return o.getAllianceNotes(filter);							},
		"setPlayerNote":					function(ogameid,note)				{return o.setPlayerNote(ogameid,note);						},
		"getPlayerNotes":					function(filter)					{return o.getPlayerNotes(filter);							},
		
		"simulate":							function(data,callback)				{return o.simulate(data,callback);							}
	};
}