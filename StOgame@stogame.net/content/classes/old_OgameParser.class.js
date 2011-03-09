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
function old_OgameParser(sandbox,OgameAccount){
	try
	{
		this.$=ST_jquery;
		this.sandbox=sandbox;
		this.OgameAccount=OgameAccount;
		this.language=OgameAccount.getLanguage();
		this.universe=OgameAccount.getUniverse();
		this.ogameid=OgameAccount.getOgameid();
		this.account=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]];
		if
		(
			this.sandbox.document.location
			&& this.sandbox.document.body
		)
		{
			if(typeof this.sandbox.unsafeWindow.session!="undefined")
			{
				this.account.setSessionid(this.sandbox.unsafeWindow.session);
			}
			else if(String(ST_getUrlParameter("session",this.sandbox.document.location.href)).length>0)
			{
				this.account.setSessionid(ST_getUrlParameter("session",this.sandbox.document.location.href));
			}
			/*if(typeof this.sandbox.unsafeWindow.TimezoneOffset!="undefined")
			{
				//SET TimezoneOffset?
			}*/
			/*if(typeof this.sandbox.unsafeWindow.localTS!="undefined")
			{
				//SET localTS?
			}*/
			if(typeof this.sandbox.unsafeWindow.timeDelta!="undefined")
			{
				this.account.setTimestampdiff(ST_parseInt(this.sandbox.unsafeWindow.timeDelta));
				//SET timeDelta?
			}
			/*var timedelta=this.sandbox.document.body.innerHTML.split("timeDelta =");
			if(typeof timedelta[1]!="undefined")
			{
				//SET server_page_load_timestamp
				//account.setServerTimestamp(ST_parseInt(timedelta[1])); //We'll use timeDelta
			}*/
			this.page=ST_getUrlParameter("page",this.sandbox.document.location.href);
			/*if(this.sandbox.document.getElementById("selectedplanet"))
			{
				//GET SELECTED PLANET...
			}*/
			this.parseplanetlist();
			this.parseheaders();
			if(this.sandbox.document.body)
			{
				try
				{
					this["parse_"+this.page]();
				}
				catch(e)
				{
					st_errors.adderror
					(
						e,
						"constructor",
						"see_how_to_retrieve_html",
						"page="+this.page
					);
				}
			}
			this.parsefooters();
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"constructor",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		);
	}
}

old_OgameParser.prototype.parseheaders=function(){
	if(this.$("#header_top center .header",this.sandbox.document).html())
	{
		var serverversion	=this.$("a[href*='page=changelog']",this.sandbox.document).html().split(" ")[1];
		var officersimgs	=this.$("a[href*='page=micropayment']>img",this.sandbox.document);
		var metal			=ST_parseInt(this.$("table#resources>tbody>tr:first-child+tr+tr>td:first-child>font",this.sandbox.document).html());
		var crystal		=ST_parseInt(this.$("table#resources>tbody>tr:first-child+tr+tr>td:first-child+td>font",this.sandbox.document).html());
		var deuterium		=ST_parseInt(this.$("table#resources>tbody>tr:first-child+tr+tr>td:first-child+td+td>font",this.sandbox.document).html());
		var energy		=ST_parseInt(this.$("table#resources>tbody>tr:first-child+tr+tr>td:first-child+td+td+td+td>font",this.sandbox.document).html());
//		var rank			=ST_parseInt(this.sandbox.document.getElementById("bar").textContent.split("(")[1]);
		this.account.setOfficiers
		(
			{
				"serverversion"	:	serverversion,
				"darkmatter"	:	ST_parseInt(this.$("table#resources>tbody>tr:first-child+tr+tr>td:first-child+td+td+td>font",this.sandbox.document).html()),
				"commander"		:	(officersimgs[0].src.indexOf("_ikon_un.gif")>0)?0:1,
				"admiral"		:	(officersimgs[1].src.indexOf("_ikon_un.gif")>0)?0:1,
				"engineer"		:	(officersimgs[2].src.indexOf("_ikon_un.gif")>0)?0:1,
				"geologist"		:	(officersimgs[3].src.indexOf("_ikon_un.gif")>0)?0:1,
				"technocrat"	:	(officersimgs[4].src.indexOf("_ikon_un.gif")>0)?0:1
			}
		);
		this.account.planets.setPlanetResources
		(
			{
				"met":metal,
				"cry":crystal,
				"deu":deuterium,
				"ene":energy
			}
		);
	}
}

old_OgameParser.prototype.parseplanetlist=function(){
	var planetlist=this.$("#header_top .header select",this.sandbox.document);
	var clean_planet_list=new Array();
	var selectedplanetindex=0;
	if(planetlist)
	{
		var moonlink="";
		var planets=this.$("option",planetlist);
		var moons=1;
		for(var i=0;i<planets.length;i++)
		{
			var planetlink=planets[i].value;
			var planetcoords=planets[i].innerHTML.split("[")[1];
			var planetname=ST_trim(planets[i].innerHTML.split("[")[0]);
			if (i<planets.length-1 && planets[i+1].innerHTML.split("[")[1]==planetcoords)
			{
				moonlink=planets[i+1].value;
			}
			var planetcp=ST_parseInt(ST_getUrlParameter("cp",planetlink));
			planetcoords=planetcoords.split(":");
			var planettype=0
			var planetgroup=0
			if(planetcoords.length==3)
			{
				var x=ST_parseInt(planetcoords[0]);
				var y=ST_parseInt(planetcoords[1]);
				var z=ST_parseInt(planetcoords[2]);
			}
			else
			{
				var x=0;
				var y=0;
				var z=0;
			}
			//WE NEED ALSO THE .ismoon VAR!
			clean_planet_list.push
			(
				{
					"index"	:	i+moons,
					"cp"	:	planetcp,
					"name"	:	planetname,
					"x"		:	x,
					"y"		:	y,
					"z"		:	z,
					"ismoon":	0,
					"group"	:	planetgroup,
					"type"	:	planettype
				}
			);
			var skip=false;
			if(moonlink!="")
			{
				//MANAGE MOON HERE
				var skip=true;
				moons++;
				var mooncp=ST_parseInt(ST_getUrlParameter("cp",moonlink));
				var moonname=ST_trim(planets[i+1].innerHTML.split("[")[0]);
				clean_planet_list.push
				(
					{
						"index"	:	i+moons,
						"cp"	:	mooncp,
						"name"	:	moonname,
						"x"		:	x,
						"y"		:	y,
						"z"		:	z,
						"ismoon":	1,
						"group"	:	0,
						"type"	:	0
					}
				);
				moonlink="";
			}
			if (planetlist.attr("selectedIndex")==i)
			{
				selectedplanetindex=i;
			}
			if (skip && planetlist.attr("selectedIndex")==i+1)
			{
				selectedplanetindex=i+1;
			}
			if(skip) i++;
		}
		this.account.planets.setPlanets(clean_planet_list,selectedplanetindex);
	}
}
old_OgameParser.prototype.parsefooters=function(){
	var buildingsboxes=this.sandbox.document.getElementsByClassName("content-box-s");
	for(var s in buildingsboxes)
	{
		var constructions=buildingsboxes[s].getElementsByClassName("construction")[0].getElementsByTagName("img");
		var queue=new Array()
		for(var i in constructions)
		{
			var constructiongid=constructions[i].src.split("/");
			queue[queue.length]=ST_parseInt(constructiongid[constructiongid.length-1].match(/[0-9]+/));
		}
		
		var currentbuildingscountdown=this.sandbox.document.body.innerHTML.split("new baulisteCountdown(getElementByIdWithCache('Countdown'),");
		if(currentbuildingscountdown.length==2)
		{
			var buildingscountdown=ST_parseInt(currentbuildingscountdown[1]);
		}
		var currentreseachescountdown=this.sandbox.document.body.innerHTML.split("new baulisteCountdown(getElementByIdWithCache('researchCountdown'),");
		if(currentreseachescountdown.length==2)
		{
			var researchescountdown=ST_parseInt(currentreseachescountdown[1]);
		}
		var currentshipyardcountdown=this.sandbox.document.body.innerHTML.split("new baulisteCountdown(getElementByIdWithCache('shipCountdown'),");
		if(currentshipyardcountdown.length==2)
		{
			var shipyardcountdown=ST_parseInt(currentshipyardcountdown[1]);
		}
		
		//alert(queue+"\n"+buildingscountdown+"\n"+researchescountdown+"\n"+shipyardcountdown);
		//SAVE QUEUES AND COUNTDOWNS... EVERY QUEUE IS A COUNTDOWN... ORDER IS
			//0->buildings
			//1->researches
			//2->shipyard
	}
}

old_OgameParser.prototype.parse_=function(){
	//parses pages without "?page=..." in the url
	//alert("parse_!");
}

old_OgameParser.prototype.parse_bewerben=function(){

}
old_OgameParser.prototype.parse_infos=function(){

}
old_OgameParser.prototype.parse_changelog=function(){
	//alert("parse_changelog!");
}

old_OgameParser.prototype.parse_techtree=function(){
	var links=this.$('#content a[href*="gid"]',this.sandbox.document);
	for (var i=0; i<links.length; i++)
		localization.setGidString(this.language,ST_parseInt(ST_getUrlParameter("gid",links[i].href)),ST_trim(links[i].innerHTML));
}

old_OgameParser.prototype.parse_notizen=function(){

}

old_OgameParser.prototype.parse_overview=function(){
	//DOES NOT YET SAVE!!!
	var planetname				=this.$("#content>center>table>tbody>tr:first-child>td>a",this.sandbox.document).html();
	planetname					=planetname.substring(planetname.indexOf('"')+1,planetname.length-1);
	if (this.$("#content>center>table>tbody>tr:first-child+tr>th+th",this.sandbox.document).html())
		var date					=this.$("#content>center>table>tbody>tr:first-child+tr>th+th",this.sandbox.document).html();
	else
		var date					=this.$("#content>center>table>tbody>tr:first-child+tr+tr>th+th",this.sandbox.document).html();
	date						=date.split(" ");
	var hour					=date[3].split(":");
	var dateobj				=new Date();
	dateobj.setDate(date[2]);
	dateobj.setHours(hour[0]);
	dateobj.setMinutes(hour[1]);
	dateobj.setSeconds(hour[2]);
	var time					=dateobj.getTime()+dateobj.getTimezoneOffset()*60000;
	var planetinfo				=this.$("#content>center>table>tbody",this.sandbox.document).children();
	var size					=this.$("#content>center>table>tbody>*",this.sandbox.document).size();
	var diameter				=ST_parseInt(planetinfo[size-4].getElementsByTagName("th")[1].innerHTML);
	var usedfields				=ST_parseInt(planetinfo[size-4].getElementsByTagName("th")[1].getElementsByTagName("a")[0].innerHTML);
	var totalfields				=ST_parseInt(planetinfo[size-4].getElementsByTagName("th")[1].getElementsByTagName("a")[1].innerHTML);
	var temperature				=planetinfo[size-3].getElementsByTagName("th")[1].innerHTML;
	var mintemp					=ST_parseInt(temperature.match(/[0-9-]+/));
	var maxtemp					=ST_parseInt(temperature.replace(/[0-9-]+/,"").match(/[0-9-]+/));
	var position				=planetinfo[size-2].getElementsByTagName("th")[1].getElementsByTagName("a")[0].innerHTML.substr(1).split(":");
	var x						=ST_parseInt(position[0]);
	var y						=ST_parseInt(position[1]);
	var z						=ST_parseInt(position[2]);
	var points					=ST_parseInt(planetinfo[size-1].getElementsByTagName("th")[1].innerHTML);
	var rank					=ST_parseInt(planetinfo[size-1].getElementsByTagName("th")[1].getElementsByTagName("a")[0].innerHTML);
	var totalplayers			=ST_parseInt(this.$("#content>center>table>tbody>tr:last-child>th:last-child",this.sandbox.document).html().split("</a>")[1].match(/[0-9]+/));
	this.account.ranks.setTotalPlayers(totalplayers);
	this.account.planets.setPlanetData
	(
		{
			"name"			:planetname,	//TO BE FIXED
			"diameter"		:diameter,
			"usedfields"	:usedfields,	//DEPRECATED
			"totalfields"	:totalfields,	//DEPRECATED
			"mintemp"		:mintemp,
			"maxtemp"		:maxtemp,
			"x"				:x,
			"y"				:y,
			"z"				:z,
			"ismoon"		:0,					//NOT YET ACTIVE!!!
			"group"			:0,					//NOT YET ACTIVE!!!
			"type"			:0					//NOT YET ACTIVE!!!
		}
	);
	
}


old_OgameParser.prototype.parse_b_building=function(){
	var tablebuildings			=this.$("table table[width=530] tr",this.sandbox.document);
	var buildingname			="";
	var buildinggid			="";
	var buildinglevel			="";
	var buildingsdata			=new Array();
	var storagesdata			=new Array();
	for (var i=0;i<tablebuildings.length;i++)
	{
		buildingname			=tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML;
		buildinggid			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].href.match(/gid=[0-9]+/)[0].substr(4));
		buildinglevel			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].innerHTML.split("</a>")[1].split("<br>")[0].match(/[0-9]+/))
		if (buildinggid>21 && buildinggid<25)
		{
			storagesdata[buildinggid]={
				"name"	:	buildingname,
				"level"	:	buildinglevel
			};
		}
		else
		{
			buildingsdata[buildinggid]={
				"name"	:	buildingname,
				"level"	:	buildinglevel
			};
		}
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	this.account.planets.setPlanetResourceBuildings
	(
		{
			"storages"		:	storagesdata,
			"buildings"		:	buildingsdata
		}
	);
	
}

old_OgameParser.prototype.parse_resources=function(){
	if (this.$("center center #ressourcen table",this.sandbox.document))
	{
		var metperc=this.sandbox.document.getElementsByName("last1")[0];
		var cryperc=this.sandbox.document.getElementsByName("last2")[0];
		var deuperc=this.sandbox.document.getElementsByName("last3")[0];
		var solperc=this.sandbox.document.getElementsByName("last4")[0];
		var fusperc=this.sandbox.document.getElementsByName("last12")[0];
		var satperc=this.sandbox.document.getElementsByName("last212")[0];
		metperc=metperc?metperc.value:0;
		cryperc=cryperc?cryperc.value:0;
		deuperc=deuperc?deuperc.value:0;
		solperc=solperc?solperc.value:0;
		fusperc=fusperc?fusperc.value:0;
		satperc=satperc?satperc.value:0;
		this.account.planets.setPlanetPercentages
		(
			{
				"met"	:	metperc,
				"cry"	:	cryperc,
				"deu"	:	deuperc,
				"sol"		:	solperc,
				"fus"	:	fusperc,
				"sat"	:	satperc
			}
		);
	}
}

old_OgameParser.prototype.parse_trader=function(){
	//NOTHING TO DO HERE
	//alert("parse_trader!");
}

old_OgameParser.prototype.parse_buildings=function(){
	mode=ST_getUrlParameter("mode",this.sandbox.document.location.href);
	if (mode=="Forschung")
	{
		var tablebuildings			=this.$("table table[width=530] tr",this.sandbox.document);
		var buildingname			="";
		var buildinggid			="";
		var buildinglevel			="";
		var tech					=new Array();
		for (var i=1;i<tablebuildings.length;i++)
		{
			buildingname			=tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML;
			buildinggid			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].href.match(/gid=[0-9]+/)[0].substr(4));
			buildinglevel			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].innerHTML.split("</a>")[1].split("<br>")[0].match(/[0-9]+/))
			tech[buildinggid]={
				"name"	:	buildingname,
				"level"	:	buildinglevel
			};
		localization.setGidString(this.language,buildinggid,buildingname);
		}
	this.account.technologies.update(tech);
	}
	
	if (mode=="Flotte")
	{
		var tablebuildings			=this.$("table table[width=530] tr",this.sandbox.document);
		var buildingname			="";
		var buildinggid			="";
		var buildinglevel			="";
		var ships					=new Array();
		for (var i=1;i<tablebuildings.length-1;i++)
		{
			buildingname			=tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML;
			buildinggid			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].href.match(/gid=[0-9]+/)[0].substr(4));
			buildinglevel			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].innerHTML.split("</a>")[1].split("<br>")[0].match(/[0-9]+/))
			ships[buildinggid]={
				"name"	:	buildingname,
				"amount"	:	buildinglevel
			};
			localization.setGidString(this.language,buildinggid,buildingname);
		}
		this.account.planets.setPlanetShips(ships);
	}

	if (mode=="Verteidigung")
	{
		var tablebuildings			=this.$("table table[width=530] tr",this.sandbox.document);
		var buildingname			="";
		var buildinggid			="";
		var buildinglevel			="";
		var defenses				=new Array();
		for (var i=1;i<tablebuildings.length-1;i++)
		{
			buildingname			=tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].innerHTML;
			buildinggid			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].href.match(/gid=[0-9]+/)[0].substr(4));
			buildinglevel			=ST_parseInt(tablebuildings[i].getElementsByTagName("td")[1].innerHTML.split("</a>")[1].split("<br>")[0].match(/[0-9]+/))
			defenses[buildinggid]={
				"name"	:	buildingname,
				"amount"	:	buildinglevel
			};
			localization.setGidString(this.language,buildinggid,buildingname);
		}
		this.account.planets.setPlanetDefenses(defenses);
	}
}

old_OgameParser.prototype.parse_flotten1=function(){
	var ships=new Array();
	if(this.$("#content center center table+form tr+tr+tr[height=20]",this.sandbox.document))
	{
		var tablebuildings			=this.$("#content center center table+form tr+tr+tr[height=20]",this.sandbox.document);
		var buildingname			="";
		var buildinggid			="";
		var buildinglevel			="";
		for (var i=0;i<tablebuildings.length-2;i++)
		{
			buildingname			=tablebuildings[i].getElementsByTagName("th")[0].getElementsByTagName("a")[0].innerHTML;
			buildinggid			=localization.getGidByString(this.language,buildingname);
			buildinglevel			=ST_parseInt(tablebuildings[i].getElementsByTagName("th")[1].innerHTML.match(/[0-9]+/)[0])
			ships[buildinggid]={
				"name"	:	buildingname,
				"amount"	:	buildinglevel
			};
		}
	}
	else
	{
		for(var i in GlobalVars.shipsids)
		{
			ships[GlobalVars.shipsids[i]]={
				"name"		:	"",
				"amount"	:	0
			};
		}
		//FILL IN ships WITH '0's
	}
	this.account.planets.setPlanetShips(ships);
}

old_OgameParser.prototype.parse_flotten2=function(){
	//NOTHING TO DO HERE
	//alert("parse_fleet1!");
}

old_OgameParser.prototype.parse_flotten3=function(){
	//alert("parse_fleet1!");
}

old_OgameParser.prototype.parse_flottenversand=function(){
	//alert("parse_fleet1!");
}

old_OgameParser.prototype.parse_galaxy=function(){
	cur_galaxy			=	ST_parseInt(this.sandbox.document.getElementsByName("galaxy")[0].value);
	cur_system			=	ST_parseInt(this.sandbox.document.getElementsByName("system")[0].value);
	cur_stamp			=	this.OgameAccount.getServerTimestamp();
	probes				=	ST_parseInt(this.OgameAccount.getPlanetShips(this.OgameAccount.getCurrentPlanet(),210));
	recyclers				=	ST_parseInt(this.OgameAccount.getPlanetShips(this.OgameAccount.getCurrentPlanet(),209));
	if (this.sandbox.document.getElementById("missiles"))
		rockets				=	ST_parseInt(this.sandbox.document.getElementById("missiles").innerHTML);
	else 
		rockets				=	0;
	var system={
		"galaxy"	:	cur_galaxy,
		"system"	:	cur_system,
		"planets"	:	new Array(),
		"probes"	:	probes,
		"recycler"	:	recyclers,
		"rockets"	:	rockets,
		"usedslots"	:	0,																		//GET FLEET SLOTS IN SOME WAY!!
		"freeslots"	:	1,
		"toString"	:	function()
		{
			return (
				"gal:"+this.galaxy
				+"|sys:"+this.system
				+"\nprobes:"+this.probes
				+"|recycler:"+this.recycler
				+"|rockets:"+this.rockets
				+"|usedslots:"+this.usedslots
				+"|freeslots:"+this.freeslots
				+"\nPlanets:\n_____________________\n"
				+this.planets.join("\n_____________________\n")
			);
		}
	}
	var rows			=this.$("#galaxy_form+table tr+tr+tr",this.sandbox.document);
	for(var i=0;i<rows.length-4;i++)
	{
		var planetname		="";
		var ogameid			=0;
		var inactive		=0;
		var loginactive		=0;
		var banned			=0;
		var vacation		=0;
		var noob			=0;
		var strong			=0;
		var nickname		="";
		var rank			=0;
		var allytag			=0;
		var allyrank		=0;
		var allymembers		=0;
		var allyid			=0;
		var moondiameter	=0;
		var moontemperature =0;
		var moonname		="";
		var debrismet		=0;
		var debriscry		=0;
		var planetgroup		=0;
		var planettype		=0;
		var planetindex				=i+1;
		var planetimagetd			=rows[i].getElementsByTagName("th")[1];
		var moontd				=rows[i].getElementsByTagName("th")[3];
		var debristd				=rows[i].getElementsByTagName("th")[4];
		var planetnametd			=rows[i].getElementsByTagName("th")[2];
		var playernametd			=rows[i].getElementsByTagName("th")[5];
		var allytagtd				=rows[i].getElementsByTagName("th")[6];
		var actiontd				=rows[i].getElementsByTagName("th")[7];
		var planetactivitydetails	=-1;
		if(planetimagetd.innerHTML!="\n\n ")
		{
			//PARSE EXISTING PLANET HERE
			var planetimage=planetimagetd.getElementsByTagName("img")[0].src.split("/");
			planetimage=planetimage[planetimage.length-1];
			planetgroup=ST_parseInt(GlobalVars["planetgroupsids"][planetimage.substring(0,planetimage.length-6).split("_")[1]]);
			planettype=ST_parseInt(planetimage.substring(planetimage.length-6,planetimage.length-4));
			if (planetnametd.innerHTML.indexOf("(")>0)
			{
				var activity=planetnametd.innerHTML.split("(")[1];
				activity=activity.substr(0,activity.length-1);
				planetactivitydetails=(activity=="*")?(0):(ST_parseInt(activity));
				planetname=ST_trim(planetnametd.innerHTML.split("(")[0]);
			}
			else
				planetname=ST_trim(planetnametd.innerHTML);
			var messageimages=actiontd.getElementsByTagName("a");
			var messageimage=messageimages[1];
			for(var j in messageimages)
			{
				if(messageimages[j].innerHTML.indexOf("/img/m.gif")>0)
				{
					messageimage=messageimages[j];
					break;
				}
			}
			var player=playernametd.getElementsByTagName("span")[0];
			var inactive=0;
			var loginactive=0;
			var banned=0;
			var vacation=0;
			var noob=0;
			var strong=0;
			if(player.innerHTML.indexOf("(")>0)
			{
				var nickname=ST_trim(player.innerHTML.split("(")[0]);
			}
			else
			{
				var nickname=ST_trim(player.innerHTML);
			}
			noob		=(playernametd.getElementsByClassName("noob")[0])?1:0;
			vacation	=(playernametd.getElementsByClassName("vacation")[0])?1:0;
			inactive	=(playernametd.getElementsByClassName("inactive")[0])?1:0;
			loginactive	=(playernametd.getElementsByClassName("longinactive")[0])?1:0;
			banned		=(playernametd.getElementsByClassName("banned")[0])?1:0;
			strong		=(playernametd.getElementsByClassName("strong")[0])?1:0;
			var rank=playernametd.innerHTML.match(/>[^<]+</)[0].match(/[0-9]+/g);
			rank=ST_parseInt(rank[rank.length-1]);
			if (messageimage)
				var ogameid=ST_parseInt(ST_getUrlParameter("messageziel",messageimage.href));
			else
				var ogameid=0;
			ogameid=(ST_trim(playernametd.textContent).length==0)?(-1):ogameid;
			ogameid=(ogameid==0)?this.ogameid:ogameid;
			var allytag="";
			var allyrank=0;
			var allymembers=0;
			var allyid=0;
			var ally=allytagtd.getElementsByTagName("a")[0];
			if(ally)
			{
				allytag=ST_trim(ally.innerHTML);
				allyrank=allytagtd.innerHTML.match(/>[^<]+</)[0].match(/[0-9]+/g);
				allymembers=ST_parseInt(allyrank[allyrank.length-1]);
				allyrank=ST_parseInt(allyrank[allyrank.length-2]);
				if(allytagtd.innerHTML.match(/allyid=[0-9]+/))
					allyid=ST_parseInt(allytagtd.innerHTML.match(/allyid=[0-9]+/)[0].match(/[0-9]+/));
				else
				{
					var allyids=this.OgameAccount.getAllianceByTag(allytag);
					if(allyids && allyids.length==1)
					{
						allyid=allyids[0].id;
					}
					else
					{
						allyid=-1;
					}
				}
				//ALLYID==-1 IF ALLIANCE IS NOT RECOGNIZED
			}
			/*alert(
				allytag
				+"\n"+allyid
				+"\n"+allyrank
				+"\n"+allymembers
			)*/
			var moondiameter=0;
			var moontemperature=0;
			var moonname="";
			var moonlink=moontd.getElementsByTagName("a")[0];
			if(typeof moonlink!="undefined")
			{
				moonname=ST_trim(moontd.innerHTML.match(/>[^<]+</)[0]);
				moonname=ST_trim(moonname.replace(moonname.split(" ")[0],"").split("[")[0])
				moondiameter=ST_parseInt(moonlink.getElementsByTagName("img")[0].alt.match(/[0-9]+/));
				moontemperature=ST_parseInt(moontd.innerHTML.match(/th>[^>]*<\/td/g)[3].match(/[0-9-]+/));
			}
/*			if (moondiameter)
			alert(
				moonname
				+"\n"+moondiameter
				+"\n"+moontemperature
			)
*/
			var debrisimage=debristd.getElementsByTagName("img")[0];
			var debrismet=0;
			var debriscry=0;
			if(debrisimage)
			{
				var debrisinfo=debristd.innerHTML.match(/th>[^<]+</g);
				var debrismet=ST_parseInt(debrisinfo[1].match(/[0-9\.]+/));
				var debriscry=ST_parseInt(debrisinfo[3].match(/[0-9\.]+/));
			}
		}
		else
		{
			//EMPTY PLACE
			//CHECK FOR DELETED PLANET HERE!!!
			//alert("empty space")
		}
		system.planets.push
		(
			{
				"planetindex"		:	planetindex,
				"planetname"		:	planetname,
				"activity"			:	planetactivitydetails,
				"ogameid"			:	ogameid,
				"inactive"			:	inactive,
				"loginactive"		:	loginactive,
				"banned"			:	banned,
				"vacation"			:	vacation,
				"noob"				:	noob,
				"strong"			:	strong,
				"nickname"			:	nickname,
				"rank"				:	rank,
				"allytag"			:	allytag,
				"allyrank"			:	allyrank,
				"allymembers"		:	allymembers,
				"allyid"			:	allyid,
				"moondiameter"		:	moondiameter,
				"moontemperature"	:	moontemperature,
				"moonname"			:	moonname,
				"debrismet"			:	debrismet,
				"debriscry"			:	debriscry,
				"planetgroup"		:	planetgroup,
				"planettype"		:	planettype,
				"toString"			: function()
				{
					return (
						"\"planetindex\"		:	"+this.planetindex+","
						+"\n\"planetname\"		:	"+this.planetname+","
						+"\n\"activity\"		:	"+this.activity+","
						+"\n\"ogameid\"		:	"+this.ogameid+","
						+"\n\"inactive\"			:	"+this.inactive+","+
						"\n\"loginactive\"		:	"+this.loginactive+","+
						"\n\"banned\"			:	"+this.banned+","+
						"\n\"vacation\"		:	"+this.vacation+","
						+"\n\"noob\"			:	"+this.noob+","
						+"\n\"strong\"			:	"+this.strong+","
						+"\n\"nickname\"		:	"+this.nickname+","
						+"\n\"rank\"			:	"+this.rank+","
						+"\n\"allytag\"			:	"+this.allytag+","
						+"\n\"allyrank\"			:	"+this.allyrank+","
						+"\n\"allymembers\"		:	"+this.allymembers+","
						+"\n\"allyid\"			:	"+this.allyid+","
						+"\n\"moondiameter\"	:	"+this.moondiameter+","
						+"\n\"moontemperature\"	:	"+this.moontemperature+","
						+"\n\"moonname\"		:	"+this.moonname+","
						+"\n\"debrismet\"		:	"+this.debrismet+","
						+"\n\"debriscry\"		:	"+this.debriscry+","
						+"\n\"planetgroup\"		:	"+this.planetgroup+","
						+"\n\"planettype\"		:	"+this.planettype+","
					);
				}
			}
		);
		//alert(system.planets[system.planets.length-1])
	}
	//ASYNC SAVING
	//NEEDS THREADS
	this.account.galaxy.setSystem(system);
}

old_OgameParser.prototype.parse_imperium=function(){
	//NOTHING TO DO HERE? MAYBE LATER...
	//alert("parse_galaxy!");
}

old_OgameParser.prototype.parse_allianzen=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkm!");
}
old_OgameParser.prototype.parse_micropayment=function(){
	//NOTHING TO DO HERE
	//alert("parse_premium!");
}

old_OgameParser.prototype.parse_options=function(){
	
	//alert("parse_preferences!");
}

old_OgameParser.prototype.parse_statistics=function(){
	var old_OgameParser			=	this;
	var cur_who=-1;
	var cur_type=-1;
	var cur_firstrank=-1;
	var cur_stamp=0;
	var who=(old_OgameParser.sandbox.document.getElementsByName('who')[0].value!="ally")?0:1;
	switch(old_OgameParser.sandbox.document.getElementsByName('type')[0].value)
	{
		case "ressources":
			var type=0;
		break;
		case "fleet":
			var type=1;
		break;
		case "research":
			var type=2;
		break;
		default:
			var type=0;
		break;
	}
	//var ranks=old_OgameParser.sandbox.document.getElementById("ranks").getElementsByTagName("tr");
	var ranks=this.$("table:last tr",old_OgameParser.sandbox.document);
	var cur_firstrank=ST_parseInt(this.$("th:first",ranks[1]).html());
	if
	(
		cur_type!=type
		|| cur_firstrank!=cur_firstrank
		|| cur_who!=who
		|| cur_stamp<(old_OgameParser.OgameAccount.getServerTimestamp()-1000)
	)
	{
		cur_type=type;
		cur_stamp=old_OgameParser.OgameAccount.getServerTimestamp();
		cur_who=who;
		cur_firstrank=cur_firstrank;
		if(who)
		{
			var alliances={
				"ranktype"			:	type,
				"sort_per_member"	:	false,
				"ranks"				:	new Array()
			};
			for(var i=1;i<ranks.length;i++)
			{
				var arank		=	this.$("th",ranks[i]);
				var variation	=	ST_parseInt(arank.html().split("ver=")[1].split(">")[1]);
				position		=	ST_parseInt(arank[0].innerHTML);
				var allytag		=	this.$("a",arank[1]);
				var allyid		=	allytag ? ST_parseInt(ST_getUrlParameter("allyid",allytag.attr("href"))) : 0;
				allytag			=	allytag ? ST_trim(allytag.text()) : "";
				var score		=	ST_parseInt(arank[4].textContent);
				var members		=	ST_parseInt(arank[3].textContent);
				var avgscore	=	ST_parseInt(arank[5].textContent);
				if
				(
					!allyid
					&& allytag.length>2
				)
				{
					var allyids=old_OgameParser.OgameAccount.getAllianceByTag(allytag);
					if(allyids && allyids.length==1)
					{
						allyid=allyids[0].id;
					}
				}
				alliances.ranks.push({
					"position"	:	position,
					"variation"	:	variation,
					"allytag"	:	allytag,
					"allyid"	:	allyid,
					"score"		:	score,
					"avgscore"	:	avgscore,
					"members"	:	members,
					"toString"	:	function(){
						return this.position+","+this.variation+","+"["+this.allytag+"],"+this.allyid+","+this.score+","+this.avgscore+","+this.members+",";
					}
				});
				if
				(
					i>1
					&& alliances.ranks[i-1].score>alliances.ranks[i-2].score
				)
				{
					alliances.sort_per_member=true;
				}
			}
			//alert(alliances.ranks.join("\n"));
			//ASYNC SAVING
			window.setTimeout
			(
				function()
				{
					old_OgameParser.account.ranks.setAlliancesFromStatistics(alliances);
				},
				500
			)
			//old_OgameParser.account.ranks.setAlliancesFromStatistics(alliances);
		}
		else
		{
			var players={
				"ranktype"	:	type,
				"ranks"		:	new Array()
			};
			for(var i=1;i<ranks.length;i++)
			{
				var arank		=	this.$("th",ranks[i]);
				var variation	=	ST_parseInt(arank.html().split("ver=")[1].split(">")[1]);
				var position	=	ST_parseInt(arank[0].innerHTML);
				var namelink	=	this.$("a",arank[1]);
				var namehref	=	namelink.attr("href");
				var x			=	ST_parseInt(ST_getUrlParameter("p1",	namehref));	//0 if ally or self
				var y			=	ST_parseInt(ST_getUrlParameter("p2",	namehref));	//0 if ally or self
				var z			=	ST_parseInt(ST_getUrlParameter("p3",	namehref));	//0 if ally or self
				//get X,Y,Z from planet list if it is you!!!
				var allytag		=	this.$("a",arank[3]);
				var allyid		=	allytag ? ST_parseInt(ST_getUrlParameter("allyid",	allytag.attr("href"))) : 0;
				allytag			=	allytag ? ST_trim(allytag.text()) : "";
				/*if(allytag.length==0)
				{
					if(name.getElementsByTagName("a").length==2)
					{
						allytag=ST_trim(name.getElementsByTagName("a")[0].textContent);
					}
				}
				allytag			=	allytag.substring(allytag.indexOf("[")+1,allytag.length-1);*/
				var name		=	ST_trim(namelink.text());
				var ogameid		=	ST_parseInt(ST_getUrlParameter("messageziel",this.$("a",arank[2]).attr("href")));
				ogameid			=	ogameid ? ogameid : this.OgameAccount.getOgameid();
				if
				(
					!allyid
					&& allytag.length>2
				)
				{
					var allyids=old_OgameParser.OgameAccount.getAllianceByTag(allytag);
					if(allyids.length==1)
					{
						allyid=allyids[0].id;
					}
					else
					{
						allyid=-1;
					}
				}
				var score		=	ST_parseInt(this.$(arank[4]).text());
				players.ranks.push({
					"position"	:	position,
					"variation"	:	variation,
					"name"		:	name,
					"allytag"	:	allytag,
					"allyid"	:	allyid,
					"x"			:	x,
					"y"			:	y,
					"z"			:	z,
					"ogameid"	:	ogameid,
					"score"		:	score,
					"toString"	:	function(){
						return this.position+","+this.variation+","+this.name+","+this.x+","+this.y+","+this.z+","+"["+this.allytag+"],"+this.allyid+","+this.ogameid+","+this.score+",";
					}
				});
			}
			//alert(players.ranks.join("\n"));
			//old_OgameParser.account.ranks.setPlayersFromStatistics(players);
			//ASYNC SAVING
			window.setTimeout
			(
				function()
				{
					old_OgameParser.account.ranks.setPlayersFromStatistics(players);
				},
				500
			);
		}
	}
}

old_OgameParser.prototype.parse_buddy=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkmadress!");
}

old_OgameParser.prototype.parse_suche=function(){
	//NOTHING TO DO HERE
	//alert("parse_search!");
}

old_OgameParser.prototype.parseSpyReport=function(spyreport,timestamp,messageid){
	try
	{
		var timestamps			=	new Array();
		var ismoon				=(spyreport.innerHTML.match(/showFleetMenu\([0-9,]+\)/)[0].match(/[0-9]+/g)[3]==3)?1:0;
		var subtables			=	this.$("table",spyreport);
		var antispionage		=	ST_parseInt(this.$("center",spyreport)[0].innerHTML.split(":")[1].match(/[0-9]+/));
		var coords				=	this.$("table:first-child a",spyreport).html().substr(1).split(":");
		var x					=	ST_parseInt(coords[0]);
		var y					=	ST_parseInt(coords[1]);
		var z					=	ST_parseInt(coords[2]);
		var targetplanet=this.OgameAccount.getSystem(x,y);
//		alert(targetplanet[z].planetname)
		var resources			=	spyreport.getElementsByTagName("table")[0].getElementsByTagName("td");
		var met					=	ST_parseInt(resources[2].textContent);
		var cry					=	ST_parseInt(resources[4].textContent);
		var deu					=	ST_parseInt(resources[6].textContent);
		var ene					=	ST_parseInt(resources[8].textContent);
		var fleetdefbuildings	=	this.$("table+table",spyreport);
		var structures			=	new Array();
		for(var k=0;k<fleetdefbuildings.length;k++)
		{
			//alert("fleet:\n\n\n"+fleetdefbuildings[0].innerHTML)
			timestamps[k]=timestamp;
			var rows=fleetdefbuildings[k].getElementsByTagName("tr");
			var gid=0;
			//var oldgid=0;
			var level=0;
			for(var i=1;i<rows.length;i++)
			{
				var tds=rows[i].getElementsByTagName("td");
				gid=0;
				for(var j in tds)
				{
					if(j%2)
					{
						level=ST_parseInt(tds[j].textContent);
						if
						(
							gid>0
							//&& gid!=oldgid
						)
						{
							structures[gid]=level;
						}
						//oldgid=gid; //SECURITY CHECK... REMOVE?
							//alert(name+"\n\n"+gid+"\n\n"+level)
						//ASSOCIATE BUILDINGNAME AND STRUCTURE NAME HERE! USE LOCALIZATION STRINGS!!!
					}
					else
					{
						var name=ST_trim(tds[j].textContent);
						gid=this.OgameAccount.getGidByString(name);
					}
				}
			}
		}
		this.account.messages.spyreports.set
		(
			timestamp,
			messageid,
			x,
			y,
			z,
			ismoon,
			antispionage,
			met,
			cry,
			deu,
			ene,
			structures,
			timestamps
		);
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"parseSpyReport",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		);
	}
}

old_OgameParser.prototype.parse_messages=function(){
	var messages						=this.$("#content>center>table>tbody>tr>td>table>tbody>tr+tr+tr",this.sandbox.document);
	if (messages.html())
	{
		var message						=new Array();
		var k							=-1;
		var j								=0;
		for (var i=0;i<messages.length-3;i++)
		{
			if (this.$("th",messages[i]).length==4)
			{
				k++;
				j						=0;
			}
			if(!message[k])
				message[k]				=new Array();
			message[k][j]					=messages[i];
			j++;
		}
		for (var i=0;i<message.length;i++)
		{
			var mex						=message[i];
			var mexid					=ST_parseInt(this.$("input",mex[0])[0].name.match(/[0-9]+/));
			var mextimestamp				=ST_timestamp_from_date(this.$("th",mex[0])[1].innerHTML);
			// CRs
			if (this.$('[class*="combatreport"]',mex[0]).html())
			{
				var coords				=this.$('[class*="combatreport"]',mex[0]).html().split('[')[1].split(']')[0].split(':');
				var x					=coords[0];
				var y					=coords[1];
				var z					=coords[2];
				if (
					(
						this.$('[class*="igotattacked"]',mex[0]).html() 
						&& 
						this.$('[class*="iwon"]',mex[0]).html()
					) 
					|| 
					(
						this.$('[class*="ididattack"]',mex[0]).html() 														//DRAW?
						&& 
						this.$('[class*="ilost"]',mex[0]).html()
					)
				)
					var attackerlosses=1;
				else
					var attackerlosses=0;
				if (this.$('[class*="draw"]',mex[0]).html())
					var defenderlosses=0;
				else
					var defenderlosses=!attackerlosses;
				this.account.messages.combatreports.set
				(
					{
						"messageid":		mexid,
						"timestamp":		mextimestamp,
						"x":				x,
						"y":				y,
						"z":				z,
						"defenderlosses":	defenderlosses,
						"attackerlosses":	attackerlosses
						}
				);
				continue;
			}
			// SRs
			if (this.$('.espionagereport',mex[0]).html())
			{
				if (ST_trim(this.$("td.b",mex[1])[1].innerHTML))
				{
					this.parseSpyReport(this.$("td.b",mex[1])[1],mextimestamp,mexid);
				}
				continue;
			}
		}
	}
	else
	{
		//WE ARE ON A CR/SR PAGE!
		this.parse_combatreport()
	}
}

old_OgameParser.prototype.parse_logout=function(){
	//NOTHING TO DO HERE
	//alert("parse_logout!");
}

old_OgameParser.prototype.parse_payment=function(){
	//NOTHING TO DO HERE
	//alert("parse_payment!");
}
old_OgameParser.prototype.parse_showmessage=function(){
	//FAILING:
	//RECYCLE REPORTS
	//FLIGHT ARRIVAL
	//FLIGHT RETURN
	//TRANSPORT <- ?
	//MOON DESTROYAL
	//ROCKET ATTACK
	//EXPEDITION REPORTS
	//COLONIZATION REPORTS
	//ATTACK (DESTROYED AT FIRST ROUND)
	
	//FAILING:
	//COMPLETE PARSERS
	var messagetype;
	var messageid=ST_parseInt(this.sandbox.document.getElementsByTagName("head")[0].innerHTML.split('self.parent.$("#')[1].split('TR").hide();')[0]);
	//var messageid=ST_parseInt(this.sandbox.document.getElementsByTagName("head")[0].innerHTML.split("self.parent.hide(")[1]);
	var date=this.sandbox.document.getElementsByClassName("infohead")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[3].getElementsByTagName("td")[0].innerHTML;
	var timestamp=ST_timestamp_from_date(date,this.account.getServerTimestamp());
	
	//FIX HERE!!!
	if
	(
		this.sandbox.document.getElementById("battlereport")
	)
	{
		messagetype="COMBAT_REPORT";
	}
	else if
	(
		this.sandbox.document.getElementsByClassName("note")[0] //.getElementsByTagName("p")[0]
		&& this.sandbox.document.getElementsByClassName("note")[0] /*.getElementsByTagName("p")[0]*/ .getElementsByTagName("a").length==2
		&& this.sandbox.document.getElementsByClassName("note")[0] /*.getElementsByTagName("p")[0]*/ .getElementsByTagName("a")[0].href.indexOf("javascript:showGalaxy(")==0
		&& this.sandbox.document.getElementsByClassName("note")[0] /*.getElementsByTagName("p")[0]*/ .getElementsByTagName("a")[1].href.indexOf("javascript:showGalaxy(")==0
	)
	{
		if
		(
			this.sandbox.document.getElementsByClassName("note")[0] /*.getElementsByTagName("p")[0]*/ .textContent.indexOf("%")>0
		)
		{
			messagetype="SPY_LOG";
			var messagebody=this.sandbox.document.getElementsByClassName("note")[0] /*.getElementsByTagName("p")[0]*/;
			if(messagebody.getElementsByTagName("p")[0])
			{
				messagebody=messagebody.getElementsByTagName("p")[0];
			}
			var start=messagebody.getElementsByTagName("a")[0];
			var end=messagebody.getElementsByTagName("a")[1];
			var percentage=ST_parseInt(messagebody.textContent.split(end.textContent)[1].split(":")[1]);
			start=start.href.split("(")[1].split(",");
			var fromgalaxy=ST_parseInt(start[0]);
			var fromsystem=ST_parseInt(start[1]);
			var fromplanet=ST_parseInt(start[2]);
			end=end.href.split("(")[1].split(",");
			var togalaxy=ST_parseInt(end[0]);
			var tosystem=ST_parseInt(end[1]);
			var toplanet=ST_parseInt(end[2]);
			var fromismoon=0;
			var toismoon=0;
			var startplanet=this.OgameAccount.getSystem(togalaxy,tosystem)[toplanet];
			if
			(
				startplanet
				&& messagebody.textContent.split("[")[0].indexOf(startplanet.planetname)>0
			)
			{
				var fromismoon=0;
			}
			else
			{
				var fromismoon=1;
			}
			var targetplanet=this.OgameAccount.getPlanetIdByCoords(togalaxy,tosystem,toplanet,0);
			if(messagebody.textContent.split("]")[1].indexOf(this.OgameAccount.getPlanetName(targetplanet))>0)
			{
				var toismoon=0;
			}
			else
			{
				var toismoon=1;
			}
			this.account.messages.sightedmessages.set
			(
				{
					"timestamp":	timestamp,
					"messageid":	messageid,
					"fromgalaxy":	fromgalaxy,
					"fromsystem":	fromsystem,
					"fromplanet":	fromplanet,
					"fromismoon":	fromismoon,
					"togalaxy":		togalaxy,
					"tosystem":		tosystem,
					"toplanet":		toplanet,
					"toismoon":		toismoon,
					"perc":			percentage
				}
			);
		}
		else
		{
			messagetype="FLEET_RETURN";
		}
	}
	else if
	(
		this.sandbox.document.getElementsByClassName("toolbar")[0].getElementsByClassName("reply")[0]
		&& this.sandbox.document.getElementsByClassName("toolbar")[0].getElementsByClassName("reply")[0].getElementsByTagName("a")[0].getAttribute("onclick").indexOf("page=writemessage")>0
	)
	{
		messagetype="PLAYER_MESSAGE";
		var ogameid=ST_parseInt(ST_getUrlParameter("to",this.sandbox.document.getElementsByClassName("reply")[0].getElementsByTagName("a")[0].getAttribute("onclick")));
		var title=this.sandbox.document.getElementsByClassName("infohead")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[0].innerHTML;
		var body=this.sandbox.document.getElementsByClassName("note")[0];
		if(body.getElementsByTagName("p")[0])
		{
			body=body.getElementsByTagName("p")[0];
		}
		body=body.innerHTML;
		this.account.messages.messages.set
		(
			{
				"messageid":		messageid,
				"timestamp":		timestamp,
				"senderogameid":	ogameid,
				"title":			title,
				"message":			body
			}
		);
	}
	else if
	(
		this.sandbox.document.getElementsByClassName("infohead")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("a").length==0
		&& this.sandbox.document.getElementsByClassName("infohead")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerHTML.indexOf("[")>0
	)
	{
		messagetype="ALLIANCE_MESSAGE";
		var body=this.sandbox.document.getElementsByClassName("note")[0];
		if(body.getElementsByTagName("p")[0])
		{
			body=body.getElementsByTagName("p")[0];
		}
		body=body.innerHTML;
		var allyid=this.account.ranks.getAllianceByTag(this.sandbox.document.getElementsByClassName("infohead")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerHTML.split("[")[1].split("]")[0]);
		allyid=(allyid.length>0)?ST_parseInt(allyid[0].id):0;
		this.account.messages.circularmails.set
		(
			{
				"allyid":		allyid,
				"messageid":	messageid,
				"timestamp":	timestamp,
				"message":		body
			}
		);
	}
	else if
	(
		this.sandbox.document.getElementsByClassName("material spy")[0]
	)
	{
		messagetype="SPY_REPORT";
		this.parseSpyReport(this.sandbox.document.getElementsByClassName("material spy")[0].parentNode,timestamp,messageid);
	}
	else
	{
		//EXPEDITIONS???
		messagetype="SYSTEM_MESSAGE";
	}
	switch(messagetype)
	{
		case "COMBAT_REPORT":
			var cmb_location = new Array();
			var cmb_players_from = new Array(new Array(), new Array());
			var cmb_wich_side = new Array(0, 0);
			var cmb_msg_id = 0;
			var cmb_winners_nick = new Array();
			var cmb_winner = -1;
			
			cmb_location = this.sandbox.document.getElementById("battlereport").getElementsByTagName('a')[0].innerHTML.match(/\[(\d+)\:(\d+)\:(\d+)\]/);
			
			cmb_winners_nick = this.sandbox.document.getElementById("winner").getElementsByTagName('span')[0].innerHTML.split(/^[^:]+:\s/)[1];
			if(typeof cmb_winners_nick!="undefined")
			{
				cmb_winners_nick=cmb_winners_nick.split(/,\s/g);
			}
			else
			{
				cmb_winners_nick=new Array();
			}

			if(this.sandbox.document.getElementById("combatants"))
			{
				for(var cmb = 0; cmb < this.sandbox.document.getElementById("combatants").getElementsByTagName('div')[0].getElementsByTagName('span').length; cmb++)
				{
					cmb_players_from[0].push(this.sandbox.document.getElementById("combatants").getElementsByTagName('div')[0].getElementsByTagName('span')[cmb].getElementsByTagName('a')[0].innerHTML.match(/\[(\d+)\:(\d+)\:(\d+)\]/));
					if(cmb_players_from[0][cmb][0]==cmb_location[0])
					{
						cmb_wich_side[1] = 1;
					}
					if (cmb_winners_nick.length > 0)
					{
						for (var win = 0; win < cmb_winners_nick.length; win++)
						{
							if (this.sandbox.document.getElementById("combatants").getElementsByTagName('div')[0].getElementsByTagName('span')[cmb].innerHTML.substr(0, cmb_winners_nick[win].length + 1) == (cmb_winners_nick[win] + ' '))
							{
								cmb_winner = 1;
							}
						}
					}
				}
				for (var cmb = 0; cmb < this.sandbox.document.getElementById("combatants").getElementsByTagName('div')[2].getElementsByTagName('span').length; cmb++)
				{
					cmb_players_from[1].push(this.sandbox.document.getElementById("combatants").getElementsByTagName('div')[2].getElementsByTagName('span')[cmb].getElementsByTagName('a')[0].innerHTML.match(/\[(\d+)\:(\d+)\:(\d+)\]/));
					if (cmb_players_from[1][cmb][0] == cmb_location[0])
					{
						cmb_wich_side[0] = 1;
					}
					if (cmb_winners_nick.length > 0)
					{
						for (var win = 0; win < cmb_winners_nick.length; win++)
						{
							if (this.sandbox.document.getElementById("combatants").getElementsByTagName('div')[2].getElementsByTagName('span')[cmb].innerHTML.substr(0, cmb_winners_nick[win].length + 1) == (cmb_winners_nick[win] + ' '))
							{
								cmb_winner = 0;
							}
						}
					}
				}
			}
			if (cmb_winner != -1)
			{
				cmb_winner = cmb_wich_side[cmb_winner];
			}
			
			cmb_msg_id = this.sandbox.document.getElementById("battlereport").getElementsByTagName('a')[this.sandbox.document.getElementById("battlereport").getElementsByTagName('a').length - 1].getAttribute('onclick').split("nID=")[1].split("'")[0];
			
			
			var cr=
			{
				"timestamp":	timestamp,
				"messageid":	messageid,
				"x":			cmb_location[1],
				"y":			cmb_location[2],
				"z":			cmb_location[3],
				"attackers":	new Array(),
				"defenders":	new Array()
			}
			for(var i in cmb_players_from[cmb_wich_side[1]])
			{
				cr.attackers.push
				(
					{
						"x": cmb_players_from[cmb_wich_side[1]][i][1],
						"y": cmb_players_from[cmb_wich_side[1]][i][2],
						"z": cmb_players_from[cmb_wich_side[1]][i][3],
					}
				);
			}
			for(var i in cmb_players_from[cmb_wich_side[0]])
			{
				cr.defenders.push
				(
					{
						"x": cmb_players_from[cmb_wich_side[0]][i][1],
						"y": cmb_players_from[cmb_wich_side[0]][i][2],
						"z": cmb_players_from[cmb_wich_side[0]][i][3],
					}
				);
			}
			this.account.messages.combatreports.set(cr);
			//alert(cmb_msg_id);

		break;
		case "FLEET_RETURN":
			alert(messagetype);
		break;
		case "SPY_REPORT":
			//alert(messagetype+" (PARSING MANAGED)");
		break;
		case "ALLIANCE_MESSAGE":
			//alert(messagetype+" (PARSING MANAGED)");
		break;
		case "PLAYER_MESSAGE":
			//alert(messagetype+" (PARSING MANAGED)");
		break;
		case "SPY_LOG":
			//alert(messagetype+" (PARSING MANAGED)");
		break;
		default:
			alert("no_corresponding_type_found")
		break;
	}
	//alert("parse_eventList!");
}

old_OgameParser.prototype.parse_combatreport=function(){
	var CR_Timestamp = 0;
	var CR_Att_ship_vals=new Array();
	var CR_Att_coords = new Array();
	var CR_Att_tecs = new Array();
	var CR_Att_Fleets = new Array();
	var CR_Def_ship_vals=new Array();
	var CR_Def_coords = new Array();
	var CR_Def_tecs = new Array();
	var CR_Def_Fleets = new Array();
	var CR_Capt_Res = new Array();
	var CR_Loss_Debr = new Array();
	var CR_Winner_is = -1;
	var CR_Rounds_Objs = this.$("body>table>tbody>tr>td",this.sandbox.document);
	if (CR_Rounds_Objs.html())
	{
	var CR_Results = this.$("p:last-child",this.sandbox.document);

	var cr_tmp_i;
	
	CR_Timestamp = ST_timestamp_from_date(CR_Rounds_Objs.html().split("<br>")[0].match(/[0-9]+\-[0-9]+ [0-9]+:[0-9]+:[0-9]+/)[0]);
	var CR_A_Rounds = this.$("center+table",CR_Rounds_Objs)
	var CR_D_Rounds = this.$("center+table+table",CR_Rounds_Objs)
	var CR_A_Round1 = CR_Rounds_Objs[0].getElementsByTagName("table")[0]
	var CR_D_Round1 = CR_Rounds_Objs[0].getElementsByTagName("table")[2]
	for (var i=0; i<CR_A_Round1.getElementsByTagName("center").length;i++)
	{
		CR_Att_coords[i]=CR_A_Round1.getElementsByTagName("a")[i].innerHTML.substr(1).split(":");
		CR_Att_coords[i][0]=ST_parseInt(CR_Att_coords[i][0])
		CR_Att_coords[i][1]=ST_parseInt(CR_Att_coords[i][1])
		CR_Att_coords[i][2]=ST_parseInt(CR_Att_coords[i][2])
		CR_Att_tecs[i]=CR_A_Round1.getElementsByTagName("center")[i].innerHTML.split("<br>")[1].split("<table")[0].match(/[0-9]+/g).toString().split(",")
		CR_Att_ship_vals[i] = new Array();
		for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
		{
			CR_Att_ship_vals[i].push([
				Math.round(GlobalVars['unitsweapons'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Att_tecs[i][0])) / 100),
				Math.round(GlobalVars['unitsshields'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Att_tecs[i][1])) / 100),
				Math.round(GlobalVars['unitsintegrity'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Att_tecs[i][2])) / 1000)
			]);
		}
		CR_Att_Fleets[1] = new Array();
		CR_Att_Fleets[1][i] = new Array();
		var CR_Fleet_rows=CR_A_Round1.getElementsByTagName("center")[i].getElementsByTagName("tr");
		for (var crtr=1;crtr<CR_Fleet_rows[0].getElementsByTagName("th").length;crtr++)
		{
			for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
			{
				if (!CR_A_Round1.getElementsByTagName('table')) 
				{
					CR_Winner_is=0;
					break;
				}
				if (
					ST_parseInt(CR_A_Round1.getElementsByTagName('table')[i].getElementsByTagName('tr')[2].getElementsByTagName('th')[crtr].innerHTML)==CR_Att_ship_vals[i][crfv][0] 
					&&
					ST_parseInt(CR_A_Round1.getElementsByTagName('table')[i].getElementsByTagName('tr')[3].getElementsByTagName('th')[crtr].innerHTML)==CR_Att_ship_vals[i][crfv][1] 
					&&
					ST_parseInt(CR_A_Round1.getElementsByTagName('table')[i].getElementsByTagName('tr')[4].getElementsByTagName('th')[crtr].innerHTML)==CR_Att_ship_vals[i][crfv][2]
				)
				{
					CR_Att_Fleets[1][i][crfv] = ST_parseInt(CR_A_Round1.getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('th')[crtr].innerHTML);
				}
			}
		}
	}
	for (var i=0; i<CR_D_Round1.getElementsByTagName("center").length;i++)
	{
		CR_Def_coords[i]=CR_D_Round1.getElementsByTagName("a")[i].innerHTML.substr(1).split(":");
		CR_Def_coords[i][0]=ST_parseInt(CR_Def_coords[i][0])
		CR_Def_coords[i][1]=ST_parseInt(CR_Def_coords[i][1])
		CR_Def_coords[i][2]=ST_parseInt(CR_Def_coords[i][2])
		CR_Def_tecs[i]=CR_D_Round1.getElementsByTagName("center")[i].innerHTML.split("<br>")[1].split("<table")[0].match(/[0-9]+/g).toString().split(",")
		CR_Def_ship_vals[i] = new Array();
		for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
		{
			CR_Def_ship_vals[i].push([
				Math.round(GlobalVars['unitsweapons'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[i][0])) / 100),
				Math.round(GlobalVars['unitsshields'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[i][1])) / 100),
				Math.round(GlobalVars['unitsintegrity'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[i][2])) / 1000)
			]);
		}
		for (var crfv = 0; crfv < GlobalVars['defenseids'].length; crfv++)
		{
			CR_Def_ship_vals[i].push([
				Math.round(GlobalVars['unitsweapons'][GlobalVars['defenseids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[i][0])) / 100),
				Math.round(GlobalVars['unitsshields'][GlobalVars['defenseids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[i][1])) / 100),
				Math.round(GlobalVars['unitsintegrity'][GlobalVars['defenseids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[i][2])) / 1000)
			]);
		}
		CR_Def_Fleets[1] = new Array();
		CR_Def_Fleets[1][i] = new Array();
		var CR_Fleet_rows=CR_D_Round1.getElementsByTagName("center")[i].getElementsByTagName("tr");
		for (var crtr=1;crtr<CR_Fleet_rows[0].getElementsByTagName("th").length;crtr++)
		{
			for (var crfv = 0; crfv < GlobalVars['shipsids'].length+GlobalVars['defenseids'].length; crfv++)
			{
				if (!CR_D_Round1.getElementsByTagName('table')) 
				{
					CR_Winner_is=1;
					break;
				}
				if (
					ST_parseInt(CR_D_Round1.getElementsByTagName('table')[i].getElementsByTagName('tr')[2].getElementsByTagName('th')[crtr].innerHTML)==CR_Def_ship_vals[i][crfv][0] 
					&&
					ST_parseInt(CR_D_Round1.getElementsByTagName('table')[i].getElementsByTagName('tr')[3].getElementsByTagName('th')[crtr].innerHTML)==CR_Def_ship_vals[i][crfv][1] 
					&&
					ST_parseInt(CR_D_Round1.getElementsByTagName('table')[i].getElementsByTagName('tr')[4].getElementsByTagName('th')[crtr].innerHTML)==CR_Def_ship_vals[i][crfv][2]
				)
				{
					CR_Def_Fleets[1][i][crfv] = ST_parseInt(CR_D_Round1.getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('th')[crtr].innerHTML);
				}
			}
		}
	}
	for (var k=0; k<CR_A_Rounds.length;k++)
	{
		var crrd=k+2;
		for (var i=0; i<CR_A_Rounds[k].getElementsByTagName("center").length;i++)
		{
			CR_Att_Fleets[crrd] = new Array();
			CR_Att_Fleets[crrd][i] = new Array();
			var CR_Fleet_rows=CR_A_Rounds[k].getElementsByTagName("center")[i].getElementsByTagName("tr");
			for (var crtr=1;crtr<CR_Fleet_rows[0].getElementsByTagName("th").length;crtr++)
			{
				for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
				{
					if (!CR_A_Rounds[k].getElementsByTagName('table')) 
					{
						CR_Winner_is=0;
						break;
					}
					if (
						ST_parseInt(CR_A_Rounds[k].getElementsByTagName('table')[i].getElementsByTagName('tr')[2].getElementsByTagName('th')[crtr].innerHTML)==CR_Att_ship_vals[i][crfv][0] 
						&&
						ST_parseInt(CR_A_Rounds[k].getElementsByTagName('table')[i].getElementsByTagName('tr')[3].getElementsByTagName('th')[crtr].innerHTML)==CR_Att_ship_vals[i][crfv][1] 
						&&
						ST_parseInt(CR_A_Rounds[k].getElementsByTagName('table')[i].getElementsByTagName('tr')[4].getElementsByTagName('th')[crtr].innerHTML)==CR_Att_ship_vals[i][crfv][2]
					)
					{
						CR_Att_Fleets[crrd][i][crfv] = ST_parseInt(CR_A_Rounds[k].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('th')[crtr].innerHTML);
					}
				}
			}
		}
	}
	for (var k=0; k<CR_D_Rounds.length;k++)
	{
		var crrd=k+2;
		for (var i=0; i<CR_D_Rounds[k].getElementsByTagName("center").length;i++)
		{
			CR_Def_Fleets[crrd] = new Array();
			CR_Def_Fleets[crrd][i] = new Array();
			var CR_Fleet_rows=CR_D_Rounds[k].getElementsByTagName("center")[i].getElementsByTagName("tr");
			for (var crtr=1;crtr<CR_Fleet_rows[0].getElementsByTagName("th").length;crtr++)
			{
				for (var crfv = 0; crfv < GlobalVars['shipsids'].length+GlobalVars['defenseids'].length; crfv++)
				{
					if (!CR_D_Rounds[k].getElementsByTagName('table')) 
					{
						CR_Winner_is=1;
						break;
					}
					if (
						ST_parseInt(CR_D_Rounds[k].getElementsByTagName('table')[i].getElementsByTagName('tr')[2].getElementsByTagName('th')[crtr].innerHTML)==CR_Def_ship_vals[i][crfv][0] 
						&&
						ST_parseInt(CR_D_Rounds[k].getElementsByTagName('table')[i].getElementsByTagName('tr')[3].getElementsByTagName('th')[crtr].innerHTML)==CR_Def_ship_vals[i][crfv][1] 
						&&
						ST_parseInt(CR_D_Rounds[k].getElementsByTagName('table')[i].getElementsByTagName('tr')[4].getElementsByTagName('th')[crtr].innerHTML)==CR_Def_ship_vals[i][crfv][2]
					)
					{
						CR_Def_Fleets[crrd][i][crfv] = ST_parseInt(CR_D_Rounds[k].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('th')[crtr].innerHTML);
					}
				}
			}
		}
	}
	CR_Winner_is=CR_Winner_is?0:1
	if (CR_Winner_is)
		CR_Capt_Res=this.$("table+p",this.sandbox.document).html().match(/\s[\d\.]+\s/g).toString().split(",")
	else
		CR_Capt_Res = [0, 0, 0];
	CR_Loss_Debr = this.$("table+p+p",this.sandbox.document).html().match(/\s[\d\.]+\s/g).toString().split(",")
	var combat_report=
	{
		"messageid":		ST_parseInt(ST_getUrlParameter("bericht",String(this.sandbox.document.location.href))),
		"timestamp":		ST_parseInt(CR_Timestamp),
		"victory":			ST_parseInt(CR_Winner_is),
		"attackers":		new Array(),
		"defenders":		new Array(),
		"met":				ST_parseInt(CR_Capt_Res[0]),
		"cry":				ST_parseInt(CR_Capt_Res[1]),
		"deu":				ST_parseInt(CR_Capt_Res[2]),
		"attackerlosses":	ST_parseInt(CR_Loss_Debr[0]),
		"defenderlosses":	ST_parseInt(CR_Loss_Debr[1]),
		"debrismet":		ST_parseInt(CR_Loss_Debr[2]),
		"debriscry":		ST_parseInt(CR_Loss_Debr[3])
	};
	for(var i=0; i<CR_Att_coords.length;i++)
	{
		combat_report.attackers.push
		(
			{
				"weapons":	CR_Att_tecs[i][0],
				"shields":	CR_Att_tecs[i][1],
				"armour":	CR_Att_tecs[i][2],
				"x":		CR_Att_coords[i][1],
				"y":		CR_Att_coords[i][2],
				"z":		CR_Att_coords[i][3],
				"rounds":	new Array()
			}
		)
		for(var j=1;j<CR_Att_Fleets.length;j++)
		{
			if(typeof CR_Att_Fleets[j][i][0]!="undefined")
			{
				combat_report.attackers[combat_report.attackers.length-1].rounds[j-1]={};
				for(var k in CR_Att_Fleets[j][i])
				{
					combat_report.attackers[combat_report.attackers.length-1].rounds[j-1]["ship_"+GlobalVars['shipsids'][k]]=CR_Att_Fleets[j][i][k];
				}
			}
		}
	}
	for(var i=0; i<CR_Def_coords.length;i++)
	{
		combat_report.defenders.push
		(
			{
				"weapons":	CR_Def_tecs[i][0],
				"shields":	CR_Def_tecs[i][1],
				"armour":	CR_Def_tecs[i][2],
				"x":		CR_Def_coords[i][1],
				"y":		CR_Def_coords[i][2],
				"z":		CR_Def_coords[i][3],
				"rounds":	new Array()
			}
		)
		for(var j=1;j<CR_Def_Fleets.length;j++)
		{
			if(typeof CR_Def_Fleets[j][i][0]!="undefined")
			{
				combat_report.defenders[combat_report.defenders.length-1].rounds[j-1]={};
				for(var k in CR_Def_Fleets[j][i])
				{
					if(typeof GlobalVars['shipsids'][k]!="undefined")
					{
						combat_report.defenders[combat_report.defenders.length-1].rounds[j-1]["ship_"+GlobalVars['shipsids'][k]]=CR_Def_Fleets[j][i][k];
					}
					else
					{
						combat_report.defenders[combat_report.defenders.length-1].rounds[j-1]["defense_"+GlobalVars['defenseids'][k-GlobalVars['shipsids'].length]]=CR_Def_Fleets[j][i][k];
					}
				}
			}
		}
	}
	this.account.messages.combatreports.set(combat_report);
	}
/*	for (var crtd = 0; crtd < CR_Rounds_Objs[0].getElementsByTagName("td").length; crtd++)
	{
		if (CR_Rounds_Objs[0].getElementsByTagName("td")[crtd].getAttribute('class'))
		{
			if (CR_Rounds_Objs[0].getElementsByTagName("td")[crtd].getAttribute('class').substr(0, 14) == 'round_attacker')
			{
				var CR_First_A_Objs = CR_Rounds_Objs[0].getElementsByTagName("td")[crtd].getElementsByTagName("table")[0].getElementsByTagName("td");
			}
			else if (CR_Rounds_Objs[0].getElementsByTagName("td")[crtd].getAttribute('class').substr(0, 14) == 'round_defender')
			{
				var CR_First_D_Objs = CR_Rounds_Objs[0].getElementsByTagName("td")[crtd].getElementsByTagName("table")[0].getElementsByTagName("td");
			}
		}
	}
	for (var crtd = 0; crtd < CR_First_A_Objs.length; crtd++)
	{
		if (CR_First_A_Objs[crtd].parentNode == CR_First_A_Objs[0].parentNode)
		{
			if (CR_First_A_Objs[crtd].getElementsByTagName('span')[0].getElementsByTagName('a')[0])
			{
				CR_Att_coords.push(CR_First_A_Objs[crtd].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerHTML.match(/\[(\d+)\:(\d+)\:(\d+)\]/));
				CR_Att_tecs.push(CR_First_A_Objs[crtd].getElementsByTagName('span')[1].innerHTML.match(/[\d]+/g));
				cr_tmp_i = CR_Att_ship_vals.length;
				CR_Att_ship_vals[cr_tmp_i] = new Array();
				for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
				{
					CR_Att_ship_vals[cr_tmp_i].push([
													Math.round(GlobalVars['unitsweapons'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Att_tecs[cr_tmp_i][0])) / 100),
													Math.round(GlobalVars['unitsshields'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Att_tecs[cr_tmp_i][1])) / 100),
													Math.round(GlobalVars['unitsintegrity'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Att_tecs[cr_tmp_i][2])) / 1000)
													]);
				}
			}
		}
	}
	for (var crtd = 0; crtd < CR_First_D_Objs.length; crtd++)
	{
		if (CR_First_D_Objs[crtd].parentNode == CR_First_D_Objs[0].parentNode)
		{
			if (CR_First_D_Objs[crtd].getElementsByTagName('span')[0].getElementsByTagName('a')[0])
			{
				CR_Def_coords.push(CR_First_D_Objs[crtd].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerHTML.match(/\[(\d+)\:(\d+)\:(\d+)\]/));
				CR_Def_tecs.push(CR_First_D_Objs[crtd].getElementsByTagName('span')[1].innerHTML.match(/[\d]+/g));
				cr_tmp_i = CR_Def_ship_vals.length;
				CR_Def_ship_vals[cr_tmp_i] = new Array();
				for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
				{
					CR_Def_ship_vals[cr_tmp_i].push([
													Math.round(GlobalVars['unitsweapons'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[cr_tmp_i][0])) / 100),
													Math.round(GlobalVars['unitsshields'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[cr_tmp_i][1])) / 100),
													Math.round(GlobalVars['unitsintegrity'][GlobalVars['shipsids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[cr_tmp_i][2])) / 1000)
													]);
				}
				for (var crfv = 0; crfv < GlobalVars['defenseids'].length; crfv++)
				{
					CR_Def_ship_vals[cr_tmp_i].push([
													Math.round(GlobalVars['unitsweapons'][GlobalVars['defenseids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[cr_tmp_i][0])) / 100),
													Math.round(GlobalVars['unitsshields'][GlobalVars['defenseids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[cr_tmp_i][1])) / 100),
													Math.round(GlobalVars['unitsintegrity'][GlobalVars['defenseids'][crfv]] * (100 + ST_parseInt(CR_Def_tecs[cr_tmp_i][2])) / 1000)
													]);
				}
			}
		}
	}
	
	for (var crrd = 0; crrd < CR_Rounds_Objs.length; crrd++)
	{
		CR_Att_Fleets[crrd] = new Array();
		CR_Def_Fleets[crrd] = new Array();
		for (var crtd = 0; crtd < CR_Rounds_Objs[crrd].getElementsByTagName("td").length; crtd++)
		{
			if (CR_Rounds_Objs[crrd].getElementsByTagName("td")[crtd].getAttribute('class'))
			{
				if (CR_Rounds_Objs[crrd].getElementsByTagName("td")[crtd].getAttribute('class').substr(0, 14) == 'round_attacker')
				{
					cr_tmp_i = 0;
					var CR_A_Objs = CR_Rounds_Objs[crrd].getElementsByTagName("td")[crtd].getElementsByTagName("table")[0].getElementsByTagName("td");
					for (var crcr = 0; crcr < CR_A_Objs.length; crcr++)
					{
						if (CR_A_Objs[crcr].parentNode == CR_A_Objs[0].parentNode)
						{
							CR_Att_Fleets[crrd][cr_tmp_i] = new Array();
							if (CR_A_Objs[crcr].getElementsByTagName('table')[0])
							{
								for (var crfv = 0; crfv < GlobalVars['shipsids'].length; crfv++)
								{
									CR_Att_Fleets[crrd][cr_tmp_i].push(0);
									for (var crtr = 1; crtr < CR_A_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('td').length; crtr++)
									{
										if (
											ST_parseInt(CR_A_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[2].getElementsByTagName('td')[crtr].innerHTML) == CR_Att_ship_vals[cr_tmp_i][crfv][0] &&
											ST_parseInt(CR_A_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[3].getElementsByTagName('td')[crtr].innerHTML) == CR_Att_ship_vals[cr_tmp_i][crfv][1] &&
											ST_parseInt(CR_A_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[4].getElementsByTagName('td')[crtr].innerHTML) == CR_Att_ship_vals[cr_tmp_i][crfv][2]
											)
										{
											CR_Att_Fleets[crrd][cr_tmp_i][crfv] = ST_parseInt(CR_A_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('td')[crtr].innerHTML);
										}
									}
								}
							}
							cr_tmp_i++;
						}
					}
				}
				else if (CR_Rounds_Objs[crrd].getElementsByTagName("td")[crtd].getAttribute('class').substr(0, 14) == 'round_defender')
				{
					cr_tmp_i = 0;
					var CR_D_Objs = CR_Rounds_Objs[crrd].getElementsByTagName("td")[crtd].getElementsByTagName("table")[0].getElementsByTagName("td");
					for (var crcr = 0; crcr < CR_D_Objs.length; crcr++)
					{
						if (CR_D_Objs[crcr].parentNode == CR_D_Objs[0].parentNode)
						{
							CR_Def_Fleets[crrd][cr_tmp_i] = new Array();
							if (CR_D_Objs[crcr].getElementsByTagName('table')[0])
							{
								for (var crfv = 0; crfv < GlobalVars['shipsids'].length + GlobalVars['defenseids'].length; crfv++)
								{
									CR_Def_Fleets[crrd][cr_tmp_i].push(0);
									for (var crtr = 1; crtr < CR_D_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('td').length; crtr++)
									{
										if (
											ST_parseInt(CR_D_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[2].getElementsByTagName('td')[crtr].innerHTML) == CR_Def_ship_vals[cr_tmp_i][crfv][0] &&
											ST_parseInt(CR_D_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[3].getElementsByTagName('td')[crtr].innerHTML) == CR_Def_ship_vals[cr_tmp_i][crfv][1] &&
											ST_parseInt(CR_D_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[4].getElementsByTagName('td')[crtr].innerHTML) == CR_Def_ship_vals[cr_tmp_i][crfv][2]
											)
										{
											CR_Def_Fleets[crrd][cr_tmp_i][crfv] = ST_parseInt(CR_D_Objs[crcr].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('td')[crtr].innerHTML);
										}
									}
								}
							}
							cr_tmp_i++;
						}
					}
				}
			}
		}
	}
	CR_Capt_Res = CR_Results[0].innerHTML.match(/\s[\d\.]+\s/g);
	if (CR_Capt_Res == null)
	{
		if(CR_Att_Fleets[CR_Rounds_Objs.length-1].join('').replace(/0/g, '') == '')
		{
			CR_Winner_is = 0;
		}
		CR_Capt_Res = [0, 0, 0];
	}
	else
	{
		CR_Winner_is = 1;
	}
	
	CR_Loss_Debr = CR_Results[1].innerHTML.match(/\s[\d\.]+\s/g);
	var combat_report=
	{
		"messageid":		ST_parseInt(ST_getUrlParameter("nID",String(this.sandbox.document.location.href))),
		"timestamp":		ST_parseInt(CR_Timestamp),
		"victory":			ST_parseInt(CR_Winner_is),
		"attackers":		new Array(),
		"defenders":		new Array(),
		"met":				ST_parseInt(CR_Capt_Res[0]),
		"cry":				ST_parseInt(CR_Capt_Res[1]),
		"deu":				ST_parseInt(CR_Capt_Res[2]),
		"attackerlosses":	ST_parseInt(CR_Loss_Debr[0]),
		"defenderlosses":	ST_parseInt(CR_Loss_Debr[1]),
		"debrismet":		ST_parseInt(CR_Loss_Debr[2]),
		"debriscry":		ST_parseInt(CR_Loss_Debr[3])
	};
	for(var i=0; i<CR_Att_coords.length;i++)
	{
		combat_report.attackers.push
		(
			{
				"weapons":	CR_Att_tecs[i][0],
				"shields":	CR_Att_tecs[i][1],
				"armour":	CR_Att_tecs[i][2],
				"x":		CR_Att_coords[i][1],
				"y":		CR_Att_coords[i][2],
				"z":		CR_Att_coords[i][3],
				"rounds":	new Array()
			}
		)
		for(var j=0;j<CR_Att_Fleets.length;j++)
		{
			if(typeof CR_Att_Fleets[j][i][0]!="undefined")
			{
				combat_report.attackers[combat_report.attackers.length-1].rounds[j]={};
				for(var k in CR_Att_Fleets[j][i])
				{
					combat_report.attackers[combat_report.attackers.length-1].rounds[j]["ship_"+GlobalVars['shipsids'][k]]=CR_Att_Fleets[j][i][k];
				}
			}
		}
	}
	for(var i=0; i<CR_Def_coords.length;i++)
	{
		combat_report.defenders.push
		(
			{
				"weapons":	CR_Def_tecs[i][0],
				"shields":	CR_Def_tecs[i][1],
				"armour":	CR_Def_tecs[i][2],
				"x":		CR_Def_coords[i][1],
				"y":		CR_Def_coords[i][2],
				"z":		CR_Def_coords[i][3],
				"rounds":	new Array()
			}
		)
		for(var j=0;j<CR_Def_Fleets.length;j++)
		{
			if(typeof CR_Def_Fleets[j][i][0]!="undefined")
			{
				combat_report.defenders[combat_report.defenders.length-1].rounds[j]={};
				for(var k in CR_Def_Fleets[j][i])
				{
					if(typeof GlobalVars['shipsids'][k]!="undefined")
					{
						combat_report.defenders[combat_report.defenders.length-1].rounds[j]["ship_"+GlobalVars['shipsids'][k]]=CR_Def_Fleets[j][i][k];
					}
					else
					{
						combat_report.defenders[combat_report.defenders.length-1].rounds[j]["defense_"+GlobalVars['defenseids'][k-GlobalVars['shipsids'].length]]=CR_Def_Fleets[j][i][k];
					}
				}
			}
		}
	}
	this.account.messages.combatreports.set(combat_report);
*/
}

old_OgameParser.prototype.parse_writemessages=function(){
	var replytomessageid	=	0 //ST_parseInt(ST_getUrlParameter("msg_id",this.sandbox.document.location.href));
	var sendform			=	this.sandbox.document.getElementById("content").getElementsByTagName("form")[0];
	var input				=	this.sandbox.document.getElementsByName("betreff")[0];
	var textarea			=	this.sandbox.document.getElementsByTagName("textarea")[0];
	var targetogameid		=	ST_parseInt(ST_getUrlParameter("messageziel",sendform.action));
	sendform.addEventListener
	(
		"submit",
		function()
		{
			old_OgameParser.account.messages.sentmessages.set
			(
				{
					"replytomessageid":	replytomessageid,
					"targetogameid":	targetogameid,
					"title":			input.value,
					"message":			textarea.value
				}
			)
		},
		false
	);
	//DON'T PARSE? PARSE OUTGOING?
	//alert("parse_writemessage!");
}
