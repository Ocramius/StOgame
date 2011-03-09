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
function new_OgameParser(sandbox,OgameAccount){
	try
	{
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

new_OgameParser.prototype.parseheaders=function(){
	//DOES NOT SAVE RESOURCES!!!
	if(this.sandbox.document.getElementById("changelog_link"))
	{
		var serverversion	=this.sandbox.document.getElementById("changelog_link").innerHTML.split(" ");
		var officersimgs	=this.sandbox.document.getElementById("officers").getElementsByTagName("img");
		var metal			=ST_parseInt(this.sandbox.document.getElementById("resources_metal").innerHTML);
		var crystal			=ST_parseInt(this.sandbox.document.getElementById("resources_crystal").innerHTML);
		var deuterium		=ST_parseInt(this.sandbox.document.getElementById("resources_deuterium").innerHTML);
		var energy			=ST_parseInt(this.sandbox.document.getElementById("resources_energy").innerHTML);
		var rank			=ST_parseInt(this.sandbox.document.getElementById("bar").textContent.split("(")[1]);
		this.account.setOfficiers
		(
			{
				"serverversion"	:	serverversion[serverversion.length-1],
				"darkmatter"	:	ST_parseInt(this.sandbox.document.getElementById("resources_darkmatter").innerHTML),
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
				"deu":deuterium
			}
		);
	}
}

new_OgameParser.prototype.parseplanetlist=function(){
	var planetlist=this.sandbox.document.getElementById("rechts");
	var clean_planet_list=new Array();
	var selectedplanetindex=0;
	if(planetlist)
	{
		var planets=planetlist.getElementsByClassName("smallplanet");
		var moons=1;
		for(var i=0;i<planets.length;i++)
		{
			var planetlink=planets[i].getElementsByTagName("a");
			var moonlink=planetlink[1];
			planetlink=planetlink[0];
			var planetcp=ST_parseInt(ST_getUrlParameter("cp",planetlink.href));
			//ora il cp viene 0 se il pianeta è selezionato
			var planetname=ST_trim(planets[i].getElementsByClassName("planet-name")[0].textContent);
			var planetcoords=planetlink.title.split("[");
			var planetcoords=planetcoords[planetcoords.length-1].split(":");
			var planettype=planetlink.getElementsByTagName("img")[0].src.split("/");
			planettype=planettype[planettype.length-1].split("_");
			var planetgroup=planettype[0];
			planettype=ST_parseInt(planettype[1]);
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
			if(moonlink)
			{
				//MANAGE MOON HERE
				moons++;
				var mooncp=ST_parseInt(ST_getUrlParameter("cp",moonlink.href));
				clean_planet_list.push
				(
					{
						"index"	:	i+moons,
						"cp"	:	mooncp,
						"name"	:	planetname+" MOON",
						"x"		:	x,
						"y"		:	y,
						"z"		:	z,
						"ismoon":	1,
						"group"	:	0,
						"type"	:	0
					}
				);
			}
			if
			(
				planetcp==0
				|| planetlink.href.indexOf("#")>0
			)
			{
				selectedplanetindex=i;
			}
		}
		this.account.planets.setPlanets(clean_planet_list,selectedplanetindex);
	}
	else
	{
		if(this.sandbox.document.getElementById("info"))
		{
			clean_planet_list.push
			(
				{
					"index"	:	0,
					"cp"	:	0,
					"name"	:	"",
					"x"		:	0,
					"y"		:	0,
					"z"		:	0,
					"ismoon":	0,
					"group"	:	0,
					"type"	:	0
				}
			);
			this.account.planets.setPlanets(clean_planet_list,selectedplanetindex);
		}
	}
}

new_OgameParser.prototype.parsefooters=function(){
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

new_OgameParser.prototype.parse_=function(){
	//parses pages without "?page=..." in the url
	//alert("parse_!");
}

new_OgameParser.prototype.parse_changelog=function(){
	//alert("parse_changelog!");
}

new_OgameParser.prototype.parse_techdata=function(){
	//NOTHING TO DO HERE
	//alert("parse_techdata!");
}

new_OgameParser.prototype.parse_overview=function(){
	//DOES NOT YET SAVE!!!
	//GET DATE IN SOME WAY!
	var overviewplanetdiv		=this.sandbox.document.getElementById("planet");
	var planetname				=overviewplanetdiv.getElementsByTagName("h2")[0].textContent;
	planetname					=planetname.substring(planetname.indexOf(" - ")+3,planetname.length);
	//var date					=this.sandbox.unsafeWindow.textContent[0];
	var diameter				=this.sandbox.unsafeWindow.textContent[1];
	var usedfields				=ST_parseInt(diameter.split(">")[1]);
	var totalfields				=ST_parseInt(diameter.split(">")[3]);
	diameter					=ST_parseInt(diameter);
	var temperature				=this.sandbox.unsafeWindow.textContent[3];
	var mintemp					=ST_parseInt(temperature.match(/[0-9-]+/));
	var maxtemp					=ST_parseInt(temperature.replace(/[0-9-]+/,"").match(/[0-9-]+/));
	var position				=this.sandbox.unsafeWindow.textContent[5].split(">[")[1].split(":");
	var x						=ST_parseInt(position[0]);
	var y						=ST_parseInt(position[1]);
	var z						=ST_parseInt(position[2]);
	var points					=this.sandbox.unsafeWindow.textContent[7];
	var rank					=points.split("(")[1];
	var totalplayers			=rank.split(" ");
	var totalplayers			=ST_parseInt(totalplayers[totalplayers.length-1]);
	this.account.ranks.setTotalPlayers(totalplayers);
	rank						=ST_parseInt(rank.match(/[0-9]+/));
	var points					=ST_parseInt(points.split(">")[1]);
	this.account.planets.setPlanetData
	(
		{
			//"name"			:planetname,	//TO BE FIXED
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
	/*alert(
		date+"\n"
		+diameter+"\n"
		+usedfields+"\n"
		+totalfields+"\n"
		+temperature+"\n"
		+mintemp+"\n"
		+maxtemp+"\n"
		+x+"\n"
		+y+"\n"
		+z+"\n"
		+points+"\n"
		+rank+"\n"
		+totalplayers+"\n"
	)*/
	
}

new_OgameParser.prototype.parse_resourceSettings=function(){
	//var resourcessettings=this.sandbox.document.getElementsByClassName("mainRS")[0];
	if (this.sandbox.document.getElementsByClassName("mainRS")){
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
				"sol"	:	solperc,
				"fus"	:	fusperc,
				"sat"	:	satperc
			}
		);
		/*alert(
			metperc+"\n"
			+cryperc+"\n"
			+deuperc+"\n"
			+solperc+"\n"
			+fusperc+"\n"
			+satperc+"\n"
		);*/
	}
}

new_OgameParser.prototype.parse_resources=function(){
	/*var new_OgameParser=this;
	var thickboxajaxlinks=this.sandbox.document.getElementsByClassName("thickbox");
	for(var i in thickboxajaxlinks)
	{
		if(ST_getUrlParameter("page",thickboxajaxlinks[i].href)=="resourcelayer")
		{
			thickboxajaxlinks[i].addEventListener
			(
				"click",
				function()
				{
					var poller=new_OgameParser.sandbox.unsafeWindow.setInterval
					(
						function()
						{
							var resourcessettingsform=new_OgameParser.sandbox.document.getElementById("RessLayer");
							if(resourcessettingsform)
							{
								new_OgameParser.sandbox.unsafeWindow.clearInterval(poller);
								var resourcessettingsform=new_OgameParser.sandbox.document.getElementsByTagName("form")[0];
								var metperc=new_OgameParser.sandbox.document.getElementsByName("last1")[0];
								var cryperc=new_OgameParser.sandbox.document.getElementsByName("last2")[0];
								var deuperc=new_OgameParser.sandbox.document.getElementsByName("last3")[0];
								var solperc=new_OgameParser.sandbox.document.getElementsByName("last4")[0];
								var fusperc=new_OgameParser.sandbox.document.getElementsByName("last12")[0];
								var satperc=new_OgameParser.sandbox.document.getElementsByName("last212")[0];
								metperc=metperc?metperc.value:0;
								cryperc=cryperc?cryperc.value:0;
								deuperc=deuperc?deuperc.value:0;
								solperc=solperc?solperc.value:0;
								fusperc=fusperc?fusperc.value:0;
								satperc=satperc?satperc.value:0;
								new_OgameParser.account.planets.setPlanetPercentages
								(
									{
										"met"	:	metperc,
										"cry"	:	cryperc,
										"deu"	:	deuperc,
										"sol"	:	solperc,
										"fus"	:	fusperc,
										"sat"	:	satperc
									}
								);
							}
						},
						50
					);
				},
				false
			);
		}
	}*/
	var buildings=this.sandbox.document.getElementById("building").getElementsByTagName("li");
	var buildingsdata=new Array();
	for(var i in buildings)
	{
		var buildingname=buildings[i].getElementsByClassName("textlabel")[0];
		var buildinggid=buildings[i].getElementsByTagName("a");
		for(var j in buildinggid)
		{
			if(String(buildinggid[j].getAttribute("id")).indexOf("details")==0)
			{
				buildinggid=buildinggid[j].id.match(/[0-9]+/);
				break;
			}
		}
		if(buildingname)
		{
			buildingname=ST_trim(buildingname.textContent);
		}
		else
		{
			buildingname=buildings[i].getElementsByClassName("tips")[0];
			if(buildingname)
			{
				buildingname=ST_trim(buildingname.title.substr(1));
			}
		}
		var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		buildingsdata[buildinggid]={
			"name"	:	buildingname,
			"level"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	var storages=this.sandbox.document.getElementById("storage").getElementsByTagName("li");
	var storagesdata=new Array();
	for(var i in storages)
	{
		var buildingname=storages[i].getElementsByClassName("textlabel")[0];
		var buildinggid=storages[i].getElementsByTagName("a");
		for(var j in buildinggid)
		{
			if(String(buildinggid[j].getAttribute("id")).indexOf("details")==0)
			{
				buildinggid=buildinggid[j].id.match(/[0-9]+/);
				break;
			}
		}
		if(buildingname)
		{
			buildingname=ST_trim(buildingname.textContent);
		}
		else
		{
			buildingname=storages[i].getElementsByClassName("tips")[0];
			if(buildingname)
			{
				buildingname=ST_trim(buildingname.title.substr(1));
			}
		}
		var buildinglevel=ST_parseInt(storages[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		storagesdata[buildinggid]={
			"name"	:	buildingname,
			"level"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	this.account.planets.setPlanetResourceBuildings
	(
		{
			"buildings"		:	buildingsdata,
			"storages"		:	storagesdata
		}
	);
}

new_OgameParser.prototype.parse_station=function(){
	var buildings=this.sandbox.document.getElementById("stationbuilding").getElementsByTagName("li");
	var buildingsdata=new Array();
	for(var i in buildings)
	{
		var buildingname=buildings[i].getElementsByClassName("textlabel")[0];
		var buildinggid=buildings[i].getElementsByTagName("a");
		for(var j in buildinggid)
		{
			if(String(buildinggid[j].getAttribute("id")).indexOf("details")==0)
			{
				buildinggid=buildinggid[j].id.match(/[0-9]+/);
				break;
			}
		}
		if(buildingname)
		{
			buildingname=ST_trim(buildingname.textContent);
		}
		else
		{
			buildingname=buildings[i].getElementsByClassName("tips")[0];
			if(buildingname)
			{
				buildingname=ST_trim(buildingname.title.substr(1));
			}
		}
		var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		buildingsdata[buildinggid]={
			"name"	:	buildingname,
			"level"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	this.account.planets.setPlanetStationBuildings(buildingsdata);
}

new_OgameParser.prototype.parse_trader=function(){
	//NOTHING TO DO HERE
	//alert("parse_trader!");
}

new_OgameParser.prototype.parse_research=function(){
	var tech=new Array();
	var buildings=this.sandbox.document.getElementById("buttonz").getElementsByTagName("li");
	for(var i in buildings)
	{
		var anode=buildings[i].getElementsByTagName("a");
		if (anode.length==1)
		{
			var buildinggid=anode[0].id.match(/[0-9]+/);
			var buildingname=buildings[i].getElementsByClassName("textlabel")[0].textContent;
		}
		else
		{
			var buildinggid=anode[1].id.match(/[0-9]+/);
			var buildingname=buildings[i].getElementsByTagName("div")[0].title.substr(1);
		}
		if(buildingname)
		{
			var buildingname=ST_trim(buildingname);
		}
		var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		tech[buildinggid]={
			"name"	:	buildingname,
			"level"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	this.account.technologies.update(tech);
}

new_OgameParser.prototype.parse_shipyard=function(){
	var ships=new Array();
	var buildings=this.sandbox.document.getElementById("military").getElementsByTagName("li");
	for(var i in buildings)
	{
		var anode=buildings[i].getElementsByTagName("a");
		if (anode.length==1)
		{
			var buildinggid=anode[0].id.match(/[0-9]+/);
			var buildingname=ST_trim(buildings[i].getElementsByClassName("textlabel")[0].textContent.split("(")[0]);
		}
		else
		{
			var buildinggid=anode[1].id.match(/[0-9]+/);
			var buildingname=ST_trim(buildings[i].getElementsByTagName("div")[0].title.substr(1).split("(")[0]);
		}
		var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		ships[buildinggid]={
			"name"		:	buildingname,
			"amount"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	
	var buildings=this.sandbox.document.getElementById("civil").getElementsByTagName("li");
	for(var i in buildings)
	{
		var anode=buildings[i].getElementsByTagName("a");
		if (anode.length==1)
		{
			var buildinggid=anode[0].id.match(/[0-9]+/);
			var buildingname=ST_trim(buildings[i].getElementsByClassName("textlabel")[0].textContent.split("(")[0]);
		}
		else
		{
			var buildinggid=anode[1].id.match(/[0-9]+/);
			var buildingname=ST_trim(buildings[i].getElementsByTagName("div")[0].title.substr(1).split("(")[0]);
		}
		var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		ships[buildinggid]={
			"name"		:	buildingname,
			"amount"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	this.account.planets.setPlanetShips(ships);
}

new_OgameParser.prototype.parse_defense=function(){
	var defenses=new Array();
	var buildings=this.sandbox.document.getElementById("defensebuilding").getElementsByTagName("li");
	for(var i in buildings)
	{
		var anode=buildings[i].getElementsByTagName("a");
		if (anode.length==1)
		{
			var buildinggid=anode[0].id.match(/[0-9]+/);
			var buildingname=ST_trim(buildings[i].getElementsByClassName("textlabel")[0].textContent.split("(")[0]);
		}
		else
		{
			var buildinggid=anode[1].id.match(/[0-9]+/);
			var buildingname=ST_trim(buildings[i].getElementsByTagName("div")[0].title.substr(1).split("(")[0]);
		}
		var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
		defenses[buildinggid]={
			"name"		:	buildingname,
			"amount"	:	buildinglevel
		};
		localization.setGidString(this.language,buildinggid,buildingname);
	}
	this.account.planets.setPlanetDefenses(defenses);
}

new_OgameParser.prototype.parse_fleet1=function(){
	var ships=new Array();
	if(this.sandbox.document.getElementById("buttonz"))
	{
		var buildings=this.sandbox.document.getElementById("military").getElementsByTagName("li");
		for(var i in buildings)
		{
			var buildinggid=buildings[i].id.match(/[0-9]+/);
			var buildingname=buildings[i].getElementsByClassName("textlabel")[0];
			if(buildingname)
			{
				var buildingname=ST_trim(buildingname.textContent);
			}
			var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
			ships[buildinggid]={
				"name"		:	buildingname,
				"amount"	:	buildinglevel
			};
			localization.setGidString(this.language,buildinggid,buildingname);
		}
		
		var buildings=this.sandbox.document.getElementById("civil").getElementsByTagName("li");
		for(var i in buildings)
		{
			var buildinggid=buildings[i].id.match(/[0-9]+/);
			var buildingname=buildings[i].getElementsByClassName("textlabel")[0];
			if(buildingname)
			{
				var buildingname=ST_trim(buildingname.textContent);
			}
			var buildinglevel=ST_parseInt(buildings[i].getElementsByClassName("level")[0].textContent.match(/[0-9]+/));
			ships[buildinggid]={
				"name"		:	buildingname,
				"amount"	:	buildinglevel
			};
			localization.setGidString(this.language,buildinggid,buildingname);
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

new_OgameParser.prototype.parse_fleet2=function(){
	//NOTHING TO DO HERE
	//alert("parse_fleet1!");
}

new_OgameParser.prototype.parse_fleet3=function(){
	//alert("parse_fleet1!");
}

new_OgameParser.prototype.parse_movement=function(){
	//alert("parse_fleet1!");
}

new_OgameParser.prototype.parse_galaxy=function(){
	var new_OgameParser			=	this;
	var cur_galaxy			=	0; //ST_parseInt(new_OgameParser.sandbox.unsafeWindow.galaxy);
	var cur_system			=	0; //ST_parseInt(new_OgameParser.sandbox.unsafeWindow.system);
	var cur_stamp			=	0; //this.OgameAccount.getServerTimestamp()(new_OgameParser.sandbox.unsafeWindow.system);
	this.sandbox.document.getElementById('galaxyContent').addEventListener
	(
		"DOMNodeInserted",
		function(e)
		{
			if(e.relatedNode.getAttribute("id")=="galaxyContent")
			{
				if(e.relatedNode.getElementsByTagName("tr").length>0)
				{
					if
					(
						cur_galaxy!=ST_parseInt(new_OgameParser.sandbox.unsafeWindow.galaxy)
						|| cur_system!=ST_parseInt(new_OgameParser.sandbox.unsafeWindow.system)
						|| cur_stamp<(this.OgameAccount.getServerTimestamp()-100)
					)
					{
						readsystem();
					}
				}
			}
		},
		false
	);
	function readsystem()
	{
		cur_galaxy			=	ST_parseInt(new_OgameParser.sandbox.unsafeWindow.galaxy);
		cur_system			=	ST_parseInt(new_OgameParser.sandbox.unsafeWindow.system);
		cur_stamp			=	new_OgameParser.OgameAccount.getServerTimestamp();
		var system={
			"galaxy"	:	ST_parseInt(new_OgameParser.sandbox.unsafeWindow.galaxy),
			"system"	:	ST_parseInt(new_OgameParser.sandbox.unsafeWindow.system),
			"planets"	:	new Array(),
			"probes"	:	ST_parseInt(new_OgameParser.sandbox.document.getElementById("probeValue").innerHTML),
			"recycler"	:	ST_parseInt(new_OgameParser.sandbox.document.getElementById("recyclerValue").innerHTML),
			"rockets"	:	ST_parseInt(new_OgameParser.sandbox.document.getElementById("missileValue").innerHTML),
			"usedslots"	:	ST_parseInt(new_OgameParser.sandbox.document.getElementById("slotValue").innerHTML),
			"freeslots"	:	ST_parseInt(new_OgameParser.sandbox.document.getElementById("slotValue").parentNode.textContent.split("/")[1]),
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
		var rows			=new_OgameParser.sandbox.document.getElementById("galaxytable").getElementsByClassName("row");
		for(var i=0;i<rows.length;i++)
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
			var planetimagetd			=rows[i].getElementsByClassName("TTgalaxy microplanet")[0];
			var moontd					=rows[i].getElementsByClassName("moon")[0];
			var debristd				=rows[i].getElementsByClassName("debris")[0];
			var planetnametd			=rows[i].getElementsByClassName("planetname")[0];
			var playernametd			=rows[i].getElementsByClassName("playername")[0];
			var allytagtd				=rows[i].getElementsByClassName("allytag")[0];
			var actiontd				=rows[i].getElementsByClassName("action")[0];
			var planetactivitydetails	=-1;
			if(planetimagetd)
			{
				//PARSE EXISTING PLANET HERE
				var planetimage=planetimagetd.style.background.split("/");
				planetimage=planetimage[planetimage.length-1].split(")")[0];
				planetgroup=ST_parseInt(GlobalVars["planetgroupsids"][planetimage.split("_")[0]]);
				planettype=ST_parseInt(planetimage.split("_")[1]);
				var activity=planetnametd.getElementsByClassName("undermark")[0];
				if(typeof activity!="undefined")
				{
					planetactivitydetails=(activity.innerHTML=="*")?(0):(ST_parseInt(activity.innerHTML));
				}
				var planetname=planetimagetd.getElementsByClassName("spacing")[0];
				var plnamespan=planetname.getElementsByTagName("span")[0];
				if(typeof plnamespan=="undefined")
				{
					planetname=ST_trim(planetname.innerHTML.split(":")[1]);
				}
				else
				{
					planetname=ST_trim(plnamespan.innerHTML);
				}
				//alert(planetname)
				//var activityname=planetname.split(" ");
				//activityname=activityname[activityname.length-1];
				//alert(planetname)
				//var planetname=ST_trim(planetname.substring(planetname.indexOf(" "),planetname.length-(activityname.length+1)));
				var messageimages=actiontd.getElementsByTagName("a");
				var messageimage=messageimages[0];
				for(var j in messageimages)
				{
					if(messageimages[j].innerHTML.indexOf("/icons/mail.gif")>0)
					{
						messageimage=messageimages[j];
						break;
					}
				}
				var player=playernametd.getElementsByTagName("div")[0];
				var inactive=0;
				var loginactive=0;
				var banned=0;
				var vacation=0;
				var noob=0;
				var strong=0;
				if(player)
				{
					var nickname=playernametd.getElementsByClassName("spacing")[0];
					var nickspan=nickname.getElementsByTagName("span")[0];
					if(typeof nickspan=="undefined")
					{
						var nickname=ST_trim(nickname.innerHTML.split(":")[0]);
					}
					else
					{
						var nickname=ST_trim(nickspan.innerHTML);
					}
					nickname=nickname.substring(nickname.indexOf(" ")+1,nickname.length);
					//var status=playernametd.getElementsByClassName("status")[0];
					noob		=(playernametd.getElementsByClassName("status_abbr_noob")[0])?1:0;
					vacation	=(playernametd.getElementsByClassName("status_abbr_vacation")[0])?1:0;
					inactive	=(playernametd.getElementsByClassName("status_abbr_inactive")[0])?1:0;
					loginactive	=(playernametd.getElementsByClassName("status_abbr_longinactive")[0])?1:0;
					banned		=(playernametd.getElementsByClassName("status_abbr_banned")[0])?1:0;
					strong		=(playernametd.getElementsByClassName("status_abbr_strong")[0])?1:0;
					var rank=ST_parseInt(playernametd.getElementsByClassName("rank")[0].innerHTML.split(":")[1]);
				}
				else
				{
					if(ST_trim(playernametd.textContent).length>0)
					{
						var nickname="";
						var ogameid=new_OgameParser.ogameid;
					}
				}
				var ogameid=ST_parseInt(ST_getUrlParameter("to",messageimage.href));
				ogameid=(ST_trim(playernametd.textContent).length==0)?(-1):ogameid;
				ogameid=(ogameid==0)?new_OgameParser.ogameid:ogameid;
				var allytag="";
				var allyrank=0;
				var allymembers=0;
				var allyid=0;
				var ally=allytagtd.getElementsByTagName("span")[0];
				if(ally)
				{
					allytag=ally.getElementsByClassName("spacing")[0].innerHTML;
					allytag=allytag.substring(allytag.indexOf(" ")+1,allytag.length);
					allyrank=ST_parseInt(ally.getElementsByClassName("rank")[0].innerHTML.split(":")[1]);
					allymembers=ST_parseInt(ally.getElementsByClassName("members")[0].innerHTML.split(":")[1]);
					//allyid=ST_parseInt(ST_getUrlParameter("allyid",ally.getElementsByClassName("actions")[0].getElementsByTagName("a")[0].href));
					allyid=ST_parseInt(String(ally.getAttribute("rel")).split("alliance")[1]);
					if
					(
						allytag.length>2
						&& !allyid
					)
					{
						var allyids=new_OgameParser.OgameAccount.getAllianceByTag(allytag);
						if(allyids.length==1)
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
					moonname=ST_trim(moontd.getElementsByClassName("spacing")[0].innerHTML);
					moondiameter=ST_parseInt(moontd.getElementsByClassName("ListImage")[0].getElementsByTagName("li")[2].textContent);
				}
				/*alert(
					moonname
					+"\n"+moondiameter
					+"\n"+moontemperature
				)*/
				var debrisimage=debristd.getElementsByTagName("img")[0];
				var debrismet=0;
				var debriscry=0;
				if(debrisimage)
				{
					var debriscontent=debristd.getElementsByClassName("debris-content");
					var debrismet=ST_parseInt(debriscontent[0].innerHTML.split(":")[1]);
					var debriscry=ST_parseInt(debriscontent[1].innerHTML.split(":")[1]);
				}
				/*alert(
					debrismet
					+"\n"+debriscry
				)*/
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
		window.setTimeout
		(
			function()
			{
				new_OgameParser.account.galaxy.setSystem(system);
			},
			300
		);
		//new_OgameParser.account.galaxy.setSystem(system);
		/*alert(
			probes
			+"\n"+recycler
			+"\n"+rockets
			+"\n"+usedslots
			+"\n"+freeslots
		)*/
		//alert(system)
		//alert("parse_galaxy!");
	}
}

new_OgameParser.prototype.parse_empire=function(){
	//NOTHING TO DO HERE? MAYBE LATER...
	//alert("parse_galaxy!");
}

new_OgameParser.prototype.parse_networkm=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkm!");
}

new_OgameParser.prototype.parse_notices=function(){
	//NOTHING TO DO HERE
	//alert("parse_notices!");
}

new_OgameParser.prototype.parse_networkmsearch=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkmsearch!");
}

new_OgameParser.prototype.parse_network=function(){
	//NOTHING TO DO HERE
	//alert("parse_network!");
}

new_OgameParser.prototype.parse_networkbuddy=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkbuddy!");
}

new_OgameParser.prototype.parse_premium=function(){
	//NOTHING TO DO HERE
	//alert("parse_premium!");
}

new_OgameParser.prototype.parse_ticket=function(){
	//NOTHING TO DO HERE
	//alert("parse_ticket!");
}

new_OgameParser.prototype.parse_preferences=function(){
	
	//alert("parse_preferences!");
}

new_OgameParser.prototype.parse_statistics=function(){
	var new_OgameParser			=	this;
	var cur_who=-1;
	var cur_type=-1;
	var cur_firstrank=-1;
	var cur_stamp=0;
	this.sandbox.document.getElementById('statisticsContent').addEventListener
	(
		"DOMNodeInserted",
		function(e)
		{
			if(e.relatedNode.getElementsByTagName("tr").length>0)
			{
				parseRanks();
			}
		},
		false
	);
	function parseRanks()
	{
		try{
		var who=(new_OgameParser.sandbox.document.getElementById('who').value!="ally")?0:1;
		switch(new_OgameParser.sandbox.document.getElementById('type').value)
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
		var ranks=new_OgameParser.sandbox.document.getElementById("ranks").getElementsByTagName("tr");
		var _cur_firstrank=ST_parseInt(ranks[1].getElementsByTagName("td")[0].textContent);
		if
		(
			cur_type!=type
			|| cur_firstrank!=_cur_firstrank
			|| cur_who!=who
			|| cur_stamp<(new_OgameParser.OgameAccount.getServerTimestamp()-1000)
		)
		{
			cur_type=type;
			cur_stamp=new_OgameParser.OgameAccount.getServerTimestamp();
			cur_who=who;
			cur_firstrank=_cur_firstrank;
			if(who)
			{
				var alliances={
					"ranktype"			:	type,
					"sort_per_member"	:	false,
					"ranks"				:	new Array()
				};
				for(var i=1;i<ranks.length;i++)
				{
					var position	=	ranks[i].getElementsByTagName("td")[0];
					var variation	=	ST_parseInt(position.getElementsByTagName("span")[0].title);
					position		=	ST_parseInt(position.textContent);
					var allytag		=	ranks[i].getElementsByTagName("td")[1];
					var allyid		=	allytag ? ST_parseInt(ST_getUrlParameter("allyid",	allytag.getElementsByTagName("a")[0].href)) : 0;
					allytag			=	allytag ? ST_trim(allytag.textContent) : "";
					var score		=	ST_parseInt(ranks[i].getElementsByTagName("td")[3].textContent);
					var members		=	ranks[i].getElementsByTagName("td")[4].textContent;
					var avgscore	=	ST_parseInt(members.split("(")[1]);
					members			=	ST_parseInt(members);
					if
					(
						!allyid
						&& allytag.length>2
					)
					{
						var allyids=new_OgameParser.OgameAccount.getAllianceByTag(allytag);
						if(allyids.length==1)
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
						new_OgameParser.account.ranks.setAlliancesFromStatistics(alliances);
					},
					500
				)
				//new_OgameParser.account.ranks.setAlliancesFromStatistics(alliances);
			}
			else
			{
				var players={
					"ranktype"	:	type,
					"ranks"		:	new Array()
				};
				for(var i=1;i<ranks.length;i++)
				{
					var position	=	ranks[i].getElementsByClassName("position")[0];
					var variation	=	ST_parseInt(position.getElementsByTagName("span")[0].title);
					position		=	ST_parseInt(position.textContent);
					var name		=	ranks[i].getElementsByClassName("name")[0];
					var namelink	=	name.getElementsByTagName("a");
					namelink		=	namelink[namelink.length-1];
					var namehref	=	namelink.href;
					var x			=	ST_parseInt(ST_getUrlParameter("galaxy",	namehref));	//0 if ally or self
					var y			=	ST_parseInt(ST_getUrlParameter("system",	namehref));	//0 if ally or self
					var z			=	ST_parseInt(ST_getUrlParameter("position",	namehref));	//0 if ally or self
					//get X,Y,Z from planet list if it is you!!!
					var allytag		=	name.getElementsByClassName("ally-tag")[0];
					var allyid		=	allytag ? ST_parseInt(ST_getUrlParameter("allyid",	allytag.getElementsByTagName("a")[0].href)) : 0;
					allytag			=	allytag ? ST_trim(allytag.textContent) : "";
					if(allytag.length==0)
					{
						if(name.getElementsByTagName("a").length==2)
						{
							allytag=ST_trim(name.getElementsByTagName("a")[0].textContent);
						}
					}
					allytag			=	allytag.substring(allytag.indexOf("[")+1,allytag.length-1);
					name			=	ST_trim(namelink.textContent);
					var ogameid		=	ranks[i].getElementsByClassName("sendmsg")[0].getElementsByTagName("a")[0];
					ogameid			=	ogameid ? ST_parseInt(ST_getUrlParameter("to",ogameid.href)) : new_OgameParser.ogameid;
					if
					(
						!allyid
						&& allytag.length>2
					)
					{
						var allyids=new_OgameParser.OgameAccount.getAllianceByTag(allytag);
						if(allyids.length==1)
						{
							allyid=allyids[0].id;
						}
						else
						{
							allyid=-1;
						}
					}
					var score		=	ST_parseInt(ranks[i].getElementsByClassName("score")[0].textContent);
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
				//new_OgameParser.account.ranks.setPlayersFromStatistics(players);
				//ASYNC SAVING
				window.setTimeout
				(
					function()
					{
						new_OgameParser.account.ranks.setPlayersFromStatistics(players);
					},
					500
				);
			}
		}
		}catch(e){alert(e)}
	}
}

new_OgameParser.prototype.parse_networkkommunikation=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkkommunikation!");
}

new_OgameParser.prototype.parse_networkmadress=function(){
	//NOTHING TO DO HERE
	//alert("parse_networkmadress!");
}

new_OgameParser.prototype.parse_search=function(){
	//NOTHING TO DO HERE
	//alert("parse_search!");
}

new_OgameParser.prototype.parseSpyReport=function(spyreport,timestamp,messageid){
	try
	{
		//alert(spyreport.innerHTML)
		var timestamps			=	new Array();
		//WORK ON ISMOON!!!
		var subtables			=	spyreport.getElementsByClassName("defenseattack");
		var antispionage		=	ST_parseInt(ST_trim(subtables[subtables.length-1].textContent.split(":")[1]));
		var coords				=	spyreport.getElementsByClassName("material")[0].getElementsByTagName("a")[0].textContent.split("[")[1].split(":");
		var x					=	ST_parseInt(coords[0]);
		var y					=	ST_parseInt(coords[1]);
		var z					=	ST_parseInt(coords[2]);
		var targetplanet=this.OgameAccount.getSystem(x,y);
		if
		(
			targetplanet[z]
			&& spyreport.getElementsByClassName("material")[0].getElementsByTagName("a")[0].parentNode.textContent.split("<a ")[0].indexOf(targetplanet[z].planetname)>0
		)
		{
			var ismoon=0;
		}
		else
		{
			var ismoon=1;
		}
		//alert(targetplanet[z].planetname+"\n\n\n_______\n\n\n"+)
		var resources			=	spyreport.getElementsByClassName("material")[0].getElementsByClassName("fragment")[0].getElementsByTagName("td");
		var met					=	ST_parseInt(resources[1].textContent);
		var cry					=	ST_parseInt(resources[3].textContent);
		var deu					=	ST_parseInt(resources[5].textContent);
		var ene					=	ST_parseInt(resources[7].textContent);
		var fleetdefbuildings	=	spyreport.getElementsByClassName("fleetdefbuildings")
		var structures			=	new Array();
		for(var k in fleetdefbuildings)
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

new_OgameParser.prototype.parse_messages=function(){
	var new_OgameParser=this;
	var messageContentAvailable=false;
	new_OgameParser.sandbox.document.getElementById("inhalt").addEventListener
	(
		"DOMNodeInserted",
		function(e)
		{
			checkMessageContent();
		},
		false
	);
	function checkMessageContent()
	{
		if
		(
			!messageContentAvailable
			&& new_OgameParser.sandbox.document.getElementById('messageContent')
		)
		{
			messageContentAvailable=true;
			new_OgameParser.sandbox.document.getElementById('messageContent').addEventListener
			(
				"DOMNodeInserted",
				function(e)
				{
					if(e.relatedNode.getAttribute("id")=="messageContent")
					{
						if(e.relatedNode.getElementsByTagName("tr").length>1)
						{
							//PARSING COMBAT_REPORTS HERE
							for(var i=0; i<e.relatedNode.getElementsByTagName("span").length; i++)
							{
								if (e.relatedNode.getElementsByTagName("span")[i].getAttribute("class"))
								{
									if (e.relatedNode.getElementsByTagName("span")[i].getAttribute("class").substring(0, 12) == "combatreport")
									{
										var cmb_rep_msgid = e.relatedNode.getElementsByTagName("span")[i].parentNode.parentNode.parentNode.getElementsByTagName("input")[0].id;
										var cmb_rep_data = e.relatedNode.getElementsByTagName("span")[i].innerHTML.match(/\[(\d+):(\d+):(\d+)\]\s\([^:]+:\s([^,]+),\s[^:]+:\s([^,]+)\)/);
										var cmb_rep_tstmp = ST_timestamp_from_date(e.relatedNode.getElementsByTagName("span")[i].parentNode.parentNode.parentNode.getElementsByClassName("date")[0].innerHTML);
										new_OgameParser.account.messages.combatreports.set
										(
											{
												"messageid":		ST_parseInt(cmb_rep_msgid),
												"timestamp":		cmb_rep_tstmp,
												"x":				ST_parseInt(cmb_rep_data[1]),
												"y":				ST_parseInt(cmb_rep_data[2]),
												"z":				ST_parseInt(cmb_rep_data[3]),
												"defenderlosses":	ST_parseInt(cmb_rep_data[4]),
												"attackerlosses":	ST_parseInt(cmb_rep_data[5])
											}
										);
									}
								}
							}
							if(new_OgameParser.sandbox.document.getElementById("showSpyReportsNow"))
							{
								//PARSING SPY_REPORTS HERE
								var allreportsres=new_OgameParser.sandbox.document.getElementsByClassName("material");
								for(var i in allreportsres)
								{
									var reportheader=new_OgameParser.sandbox.document.getElementById(ST_parseInt(allreportsres[i].parentNode.parentNode.parentNode.id.split("_")[1])+"TR");
									var timestamp=ST_timestamp_from_date(reportheader.getElementsByClassName("date")[0].textContent,new_OgameParser.account.getServerTimestamp());
									var messageid=ST_parseInt(reportheader.id);
									new_OgameParser.parseSpyReport(allreportsres[i].parentNode,timestamp,messageid);
								}
							}
						}
					}
				},
				false
			);
		}
		else if(!new_OgameParser.sandbox.document.getElementById('messageContent'))
		{
			messageContentAvailable=false;
		}
	}
}

new_OgameParser.prototype.parse_logout=function(){
	//NOTHING TO DO HERE
	//alert("parse_logout!");
}

new_OgameParser.prototype.parse_payment=function(){
	//NOTHING TO DO HERE
	//alert("parse_payment!");
}

new_OgameParser.prototype.parse_eventList=function(){
	//alert("parse_eventList!");
}

new_OgameParser.prototype.parse_showmessage=function(){
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
			//alert("no_corresponding_type_found")
		break;
	}
	//alert("parse_eventList!");
}

new_OgameParser.prototype.parse_combatreport=function(){
	var CR_Timestamp = 0;
	var CR_Att_coords = new Array();
	var CR_Att_tecs = new Array();
	var CR_Att_ship_vals = new Array();
	var CR_Att_Fleets = new Array();
	var CR_Def_coords = new Array();
	var CR_Def_tecs = new Array();
	var CR_Def_ship_vals = new Array();
	var CR_Def_Fleets = new Array();
	var CR_Capt_Res = new Array();
	var CR_Loss_Debr = new Array();
	var CR_Winner_is = -1;
	
	var CR_Rounds_Objs = this.sandbox.document.getElementsByClassName('combat_round');
	var CR_Results = this.sandbox.document.getElementById('combat_result').getElementsByTagName("p");

	var cr_tmp_i;
	
	CR_Timestamp = ST_timestamp_from_date(CR_Rounds_Objs[0].getElementsByClassName('round_info')[0].getElementsByTagName("p")[0].innerHTML.split(/\(/)[1].split(/\)/)[0]);
	
	for (var crtd = 0; crtd < CR_Rounds_Objs[0].getElementsByTagName("td").length; crtd++)
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
}

new_OgameParser.prototype.parse_writemessage=function(){
	var new_OgameParser			=	this;
	var replytomessageid	=	ST_parseInt(ST_getUrlParameter("msg_id",this.sandbox.document.location.href));;
	var sendform			=	this.sandbox.document.getElementsByTagName("form")[0];
	var input				=	this.sandbox.document.getElementsByName("betreff")[0];
	var textarea			=	this.sandbox.document.getElementsByTagName("textarea")[0];
	var targetogameid		=	ST_parseInt(ST_getUrlParameter("to",sendform.action));
	sendform.addEventListener
	(
		"submit",
		function()
		{
			new_OgameParser.account.messages.sentmessages.set
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