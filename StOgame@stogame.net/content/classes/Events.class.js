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
function Events(
	language,
	universe,
	ogameid,
	AccountDB
)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.AccountDB		=	AccountDB;
		//SOME CODE HERE...
		//Events Array
		this.EventsList		=	new Array();
		//Load from sqlLite
		this.load();
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"constructor",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Events.prototype.parse=function()
{
	try
	{
		var document = document_to_be_parsed.documents[this.language][this.universe];
		if
		(
			ST_getUrlParameter("page",document.location.href)=="overview"
			&& document.getElementById("content")
		)
		{
			this.ClearEventsType("fleet",0);
			if(document.getElementById("bxx1"))
			{
				federazione=0;
				for(im=1;document.getElementById("bxx"+im);im++)
				{
					ogameidfleet=this.ogameid;
					trovamess=false;
					fleettime=document.getElementById("bxx"+im);
					//ore1=fleettime.innerHTML.match(/\b\d+/)[0];
					//min1=fleettime.innerHTML.match(/:\d+:/)[0].replace(/[^\d]/g,"");
					//sec1=fleettime.innerHTML.match(/:\d\d$/)[0].replace(/[^\d]/g,"");
					//totaltime=ore1*3600+min1*60+sec1*1;
					totaltime=fleettime.title;
					timestamp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+totaltime*1000;
					missiondesc=fleettime.parentNode.nextSibling.nextSibling.childNodes[federazione];
					mission=missiondesc.getAttribute("class");
					//alert("-1");
					if(mission.indexOf("missile")>-1)
					{
						partenza=missiondesc.getElementsByTagName("a")[0].innerHTML.replace(/[^\d:]/g,"");
						arrival=missiondesc.getElementsByTagName("a")[1].innerHTML.replace(/[^\d:]/g,"");
						if(partenza.match(/\d+:\d+:\d+/)==null)
						{
							trovamess=true;
							partenza=arrival;
							arrival=missiondesc.getElementsByTagName("a")[2].innerHTML.replace(/[^\d:]/g,"");
						}
					}
					else if(mission=="holding hold")
					{
						partenza=missiondesc.getElementsByTagName("a")[1].innerHTML.replace(/[^\d:]/g,"");
						arrival=missiondesc.lastChild.innerHTML.replace(/[^\d:]/g,"");
						trovamess=true;
					}
					else
					{
						partenza=missiondesc.getElementsByTagName("a")[2].innerHTML.replace(/[^\d:]/g,"");
						/*FIX spedizione*/
						if (missiondesc.getElementsByTagName("a")[3])
							arrival=missiondesc.getElementsByTagName("a")[3].innerHTML.replace(/[^\d:]/g,"");
						else
						{
							arrival= partenza;
							partenza = "0:0:0"; //manca l'informazione
						}
						/*fine FIX spedizione*/
						if(partenza.match(/\d+:\d+:\d+/)==null)
						{
							trovamess=true;
							partenza=arrival;
							arrival=missiondesc.getElementsByTagName("a")[4].innerHTML.replace(/[^\d:]/g,"");
						}
					}
					//alert("0");
					metallo=0;
					cristallo=0;
					deuterio=0;
					if(missiondesc.lastChild.tagName && missiondesc.lastChild.tagName=="A" && missiondesc.lastChild.getAttribute("title") && missiondesc.lastChild.getAttribute("title").indexOf(":")>-1)
					{
						dati=missiondesc.lastChild.getAttribute("title");
						metallo=dati.match(/\d+\.?\d*\.?\d*\.?\d*\.?\d*/)[0];
						dati=dati.replace(metallo,"");
						cristallo=dati.match(/\d+\.?\d*\.?\d*\.?\d*\.?\d*/)[0];
						dati=dati.replace(cristallo,"");
						deuterio=dati.match(/\d+\.?\d*\.?\d*\.?\d*\.?\d*/)[0].replace(/[^\d]/g,"");
						metallo=metallo.replace(/[^\d]/g,"");
						cristallo=cristallo.replace(/[^\d]/g,"");
					}
					//alert("1");
					if(mission.indexOf("missile")>-1)
					{
						totalships=missiondesc.innerHTML.match(/\(\d+\)/)[0].replace(/[^\d]/g,"")*1;
						ships=new Array();
					}
					else
					{
						if(mission=="holding hold"){basicfleet=missiondesc.getElementsByTagName("a")[3].getAttribute("title");}
						else{basicfleet=missiondesc.getElementsByTagName("a")[1].getAttribute("title");}
						totalships=0;
						ships=new Array();
						//alert("2");
						if(trovamess)
						{
							if(mission=="holding hold"){ogameidfleet=missiondesc.getElementsByTagName("a")[0].getAttribute("onclick").match(/\d{6}/)[0];}
							else{ogameidfleet=missiondesc.getElementsByTagName("a")[2].getAttribute("onclick").match(/\d{6}/)[0];}
							spyo=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].technologies.technology[106];
							if(spyo<4 && spyo>2){totalships=basicfleet.match(/\d+/)[0]*1;}
							else if(spyo<8)
							{
								totalships=basicfleet.match(/\d+/)[0]*1;
								for(i=202;i<216;i++)
								{
									if(basicfleet.indexOf(localization.getLocalizationString(this.language,"gid",i))>-1){ships[i]=true;}
									else{ships[i]=false;}
								}
							}
							else
							{
								totalships=basicfleet.match(/\d+/)[0]*1;
								for(i=202;i<216;i++)
								{
									tempship=localization.getLocalizationString(this.language,"gid",i);
									if(basicfleet.indexOf(tempship)>-1){ships[i]=basicfleet.split(tempship)[1].split(/[a-zA-Z]/)[0].replace(/[^\d]/g,"")*1;}
									else{ships[i]=0;}
								}
							}//alert("3");
						}
						else
						{
							for(i=202;i<216;i++)
							{
								tempship=localization.getLocalizationString(this.language,"gid",i);
								if(basicfleet.indexOf(tempship)>-1){ships[i]=basicfleet.split(tempship)[1].split(/[a-zA-Z]/)[0].replace(/[^\d]/g,"")*1;}
								else{ships[i]=0;}
								totalships+=ships[i];
							}
						}
					}
					if(mission.indexOf("harvest")>-1)
					{
						if(mission.indexOf("eturn")>-1)
						{
							partenza+="%%detriti";
						}
						else
						{
							arrival+="%%detriti";
						}
					}
					if(mission=="holding hold")
					{
						if(missiondesc.innerHTML.match(/alt=".{2,30}"><\/a>.{2,50} \(.{2,20}\ <a href="/)!=null) 
						{
							partenza+="%%moon";
						}
						if(missiondesc.innerHTML.match(/title=".*"><\/a>.{2,50} \(.{2,20}\ <a href="/)!=null)
						{
							arrival+="%%moon";
						}
					}
					else
					{
						if(missiondesc.innerHTML.match(/"><\/a>.{1,30}\(.{2,20}\)/)!=null) 
						{
							partenza+="%%moon";
						}
						if(missiondesc.innerHTML.match(/\[\d+:\d+:\d+\]<\/a>.{1,30}\(.{2,20}\)/)!=null)
						{
							arrival+="%%moon";
						}
					}
					if(arrival.indexOf("%%")<1){arrival+="%%pianeta";}
					if(partenza.indexOf("%%")<1){partenza+="%%pianeta";}
					if(fleettime.parentNode.nextSibling.nextSibling.childNodes[federazione+4]){federazione+=4;im--;}
					else{federazione=0;}
					
					//Catch Events
					this.AddEvents(timestamp,false,"fleet",partenza+"|"+arrival+"|"+ogameidfleet+"|"+mission+"|"+metallo+"|"+cristallo+"|"+deuterio+"|"+totalships+"|"+ships);
					//add other data for events	
				}
			}
			//localization=function(this.language,"gid",id_nave) //id_nave 202-cargo leggero, 203-cargo pesante, etc...
			//CODICE PER RECUPERARE LA COSTRUZIONE IN CORSO SUL PIANETA ATTUALMENTE VISITATO...
			this.save();
		}
		else if
		(
			ST_getUrlParameter("page",document.location.href)=="b_building"
			&& document.getElementById("content")
		)
		{
			planetid=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.currentplanet;
			
			//this.ClearEventsType("buildings", allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]);
			
			buildings=new Array();
			if(document.getElementById("bxx"))
			{
				timestamp=document.getElementById("bxx").nextSibling.innerHTML.split("pp='")[1].split("'")[0]*1000;
				gid=ST_getUrlParameter("gid",document.getElementById("bxx").parentNode.parentNode.firstChild.firstChild.href);
				if(gid=="")
					gid="unknown";
				mode=ST_getUrlParameter("modus",document.location.href);
				if(mode=="")
					mode="unknown";
				cp=ST_getUrlParameter("planet",document.location.href);
				if(cp=="")
					cp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid];
				if(cp=="")
					cp="unknown";
				buildings[0]=new Object();
				buildings[0].gid=gid;
				buildings[0].timestamp=timestamp;
				buildings[0].timestamp+=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				buildings[0].mode=mode;
				buildings[0].cp=cp;
				if(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].commander==1)
				{
					var trnode=document.getElementById("content").getElementsByTagName("tr");
					if (trnode[0].getElementById("bxx"))
					{
						for (var s=1; s<5 && trnode[s].getElementsByTagName("td").length==2; s++)
						{
							//se trnode[s].getElementsByTagName("td").length==2 è un'elemento della coda
							gid=0;
							var tdnode=trnode[s].getElementsByTagName("td");
							var tdtext = tdnode[0].textContent;
							for(var i=0;i<GlobalVars.buildingids.length;i++)
							{
								name=localization.getLocalizationString(this.language,"gid",GlobalVars.sbuildingids[i]);
								if (tdtext.indexOf(name)>-1)
								{
									gid=GlobalVars.sbuildingids[i];
									break;
								}
							}
							for(i=0;i<GlobalVars.moonbuildingids.length;i++)
							{
								name=localization.getLocalizationString(this.language,"gid",GlobalVars.moonbuildingids[i]);
								if (tdtext.indexOf(name)>-1)
								{
									gid=GlobalVars.moonbuildingids[i];
									break;
								}
							}
							if (gid!=0)
							{
								var planetthis=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.currentplanet;
								var typeplanet="Planet";
								if(gid=="41" || gid=="42" || gid=="43" ) typeplanet="Moon";
								level=eval("allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].get"+typeplanet+"Building(planetthis,gid)")
								met=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getMetLevelUpgradeCost(gid,level+1)*1;
								cry=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getCryLevelUpgradeCost(gid,level+1)*1;
								timestamptobuild=((met+cry)/2500*(1/(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getPlanetBuilding(planetthis,14)*1+1))*Math.pow(0.5,allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getPlanetBuilding(planetthis,15)*1)*3600000)/allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getUniverseSpeed();
								buildings[i]=new Object();
								buildings[i].gid=gid;
								buildings[i].timestamp=buildings[i-1].timestamp+timestamptobuild;
								buildings[i].mode="list"+(i+1);
								buildings[i].cp=cp;
							}
						}
					}
					
					//MANCA il test per questo codice
				}
			}
			var cpbuild=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid];
			
			if (buildings.length!=0)
			{
				
				var eventscp=this.getPlanetsBuildingsEvents(cpbuild);
				
				var scarto=10000;
				
				if (eventscp.length > buildings.length) this.ClearEventsType("buildings", cpbuild);
				
				for (var q=0; q<buildings.length; q++)
				{
					var flag=0;
					for (var k=0; k<eventscp.length; k++)
					{
						if (buildings[q].gid==eventscp[k].gid)
						{
							if ((buildings[q].timestamp+scarto)>eventscp[k].timestamp && (buildings[q].timestamp-scarto)<eventscp[k].timestamp)
							{
								//lo ignoro
								flag=1;
								continue;
							}
							else
							{
								this.RemoveBuildingsEvent(eventscp[k].gid,eventscp[k].timestamp,cpbuild);
								this.AddEvents(buildings[q].timestamp,false, "buildings", buildings[q].cp+"|"+buildings[q].gid+"|"+buildings[q].mode);
							}
						}
					}
					if (flag==0)
					{
						//non ho corrispondenze
						this.AddEvents(buildings[q].timestamp,false, "buildings", buildings[q].cp+"|"+buildings[q].gid+"|"+buildings[q].mode);
					}					
					//this.AddEvents(buildings[q].timestamp,false, "buildings", buildings[q].cp+"|"+buildings[q].gid+"|"+buildings[q].mode);
				}
			}
			else
			{
				this.ClearEventsType("buildings", cpbuild);
			}
			this.save();
		}
		else if
		(
			ST_getUrlParameter("page",document.location.href)=="buildings"
			&& ST_getUrlParameter("mode",document.location.href)=="Forschung"
			&& document.getElementById("content")
		)
		{
			planetid=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.currentplanet;
			research=0;
			var check=this.getResearchEvents();
			var cp = ST_getUrlParameter("planet",document.location.href);
			if(cp==""){cp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid];}
			if(cp==""){cp="unknown";}
			if(document.getElementById("bxx"))
			{
				timestamp=document.getElementById("bxx").nextSibling.nextSibling.innerHTML.split("ss=")[1].split(";")[0]*1000;
				gidvar2=document.getElementById("bxx").parentNode.previousSibling.firstChild.href;
				gid=ST_getUrlParameter("gid",gidvar2);
				if(gid==""){gid="unknown";}
				research=new Object();
				research.gid=gid;
				research.cp=cp;
				research.timestamp=timestamp+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				if (check==false)
				{
					this.AddEvents(research.timestamp,false,"research",research.gid+"|"+research.cp);
				}
				else
				{
					if(check.cp==cp)
					{
						this.ClearEventsType("research",0);
						this.AddEvents(research.timestamp,false,"research",research.gid+"|"+research.cp);
					}
				}
			}
			else
			{
				if(check.cp==cp) this.ClearEventsType("research",0);
				//è possibile annullare la ricerca solo dal pianeta che l'ha lanciata
				//potrebbe ancora esserci qualche problema con i laboratori che non vedono la ricerca in corso per via del livello
			}
			this.save();
		}
		else if
		(
			ST_getUrlParameter("page",document.location.href)=="buildings"
			&& document.getElementById("content")
			&&
			(
				ST_getUrlParameter("mode",document.location.href)=="Verteidigung"
				|| ST_getUrlParameter("mode",document.location.href)=="Flotte"
			)
		)
		{
			shipyard=0
			planetid=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.currentplanet;
			this.ClearEventsType("shipyard", allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]);
			if(document.getElementById("bx"))
			{
				var cp = ST_getUrlParameter("planet",document.location.href);
				if(cp==""){cp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid];}
				if(cp==""){cp="unknown";}
				moment=new Array();
				for(var i=0;i<GlobalVars.shipsids.length;i++)
				{
					name=localization.getLocalizationString(this.language,"gid",GlobalVars.shipsids[i]);
					moment[name]=GlobalVars.shipsids[i];
				}
				for(var i=0;i<GlobalVars.defenseids.length;i++)
				{
					name=localization.getLocalizationString(this.language,"gid",GlobalVars.defenseids[i]);
					moment[name]=GlobalVars.defenseids[i];
				}
				for(var i=0;i<GlobalVars.rocketsids.length;i++)
				{
					name=localization.getLocalizationString(this.language,"gid",GlobalVars.rocketsids[i]);
					moment[name]=GlobalVars.rocketsids[i];
				}
				/*moment=new Array();
				moment["Lanciamissili"]=401;
				moment["Laser leggero"]=402;
				moment["Laser pesante"]=403;
				moment["Cannone gauss"]=404;
				moment["Cannone ionico"]=405;
				moment["Cannone al plasma"]=406;
				moment["Cupola scudo"]=407;
				moment["Cupola scudo potenziata"]=408;
				moment["Missili anti-balistici"]=503;
				moment["Missili interplanetari"]=502;
				moment["Cargo leggero"]=202;
				moment["Cargo pesante"]=203;
				moment["Caccia leggero"]=204;
				moment["Caccia pesante"]=205;
				moment["Incrociatore"]=206;
				moment["Nave da battaglia"]=207;
				moment["Colonizzatrice"]=208;
				moment["Riciclatrice"]=209;
				moment["Sonda spia"]=210;
				moment["Bombardiere"]=211;
				moment["Satellite solare"]=212;
				moment["Corazzata"]=213;
				moment["Morte nera"]=214;
				moment["Incrociatore da Battaglia"]=215;*/
				timestamp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				basicscript=document.getElementById("bx").parentNode.getElementsByTagName("script")[0].innerHTML;
				duration=basicscript.split("c = new Array(")[1].split(',"");')[0].split(",");
				ship=basicscript.split("b = new Array(")[1].split(',"");')[0].replace(/"/g,"").split(",");
				howmany=basicscript.split("a = new Array(")[1].split(',"");')[0].replace(/"/g,"").split(",");
				timeelapsed=basicscript.split("g =")[1].split(";")[0];
				totaltime=0;
				for(i=0;i<ship.length;i++)
				{
					var shipyard = new Object();
					shipyard.gid=moment[ship[i]];
					shipyard.cp=cp;
					shipyard.many=howmany[i];
					if (i==0)
					{
					shiptime=(ST_parseInt(duration[i])*ST_parseInt(howmany[i]))-timeelapsed;
					updatetime=timestamp;
					}
					else 
					{
					shiptime=(ST_parseInt(duration[i])*ST_parseInt(howmany[i]));
					timeelapsed=0;
					updatetime=timestamp+totaltime;
					}
					shipyard.timestamp=timestamp+(shiptime*1000)+totaltime;
				this.AddEvents(shipyard.timestamp,updatetime,"shipyard",shipyard.gid+"|"+shipyard.cp+"|"+shipyard.many+"|"+(timeelapsed*1000));
					totaltime+=(shiptime*1000);
				}
			}
			this.save();
		}
		//ALTRI EVENTI, VEDI TU SE VUOI GESTIRLI...
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"parse",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

Events.prototype.RunShipyardEvents=function(firstrun)
{
	//per ora firstrun è inutilizzato
	
	var actualtime = allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
	for (var k=0; k<this.EventsList.length; k++)
	{
		if (this.EventsList[k][2]=="shipyard")
		{
			var data = this.EventsList[k][3].split("|");
			var obj = new Object();
			obj.timestamp=ST_parseInt(this.EventsList[k][0]);
			obj.update=ST_parseInt(this.EventsList[k][1]);
			obj.gid=ST_parseInt(data[0]);
			obj.cp=ST_parseInt(data[1]);
			obj.many=ST_parseInt(data[2]);
			obj.elapsed=ST_parseInt(data[3]);
			if (obj.update>actualtime) continue;   //non è ancora ora di processarlo deve ancora partire
			else
			{
				var actualtime = allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
				var timerun=actualtime-obj.update+obj.elapsed;
				var timeship=(obj.timestamp-obj.update+obj.elapsed)/obj.many;
				var howmanytime=Math.floor(timerun/timeship);
				var newelapsed=(timerun%timeship)
				var shipordefense=obj.gid<400?"ships_":"defense_";
				if ((actualtime-obj.update)>=(obj.timestamp-obj.update))
				{
					//Evento scaduto e quindi alla prossima chiamata sarà cancellato da runEvents
					//codice di aggiornamento del pianeta
					//obj.gid
					//obj.cp
					//obj.many -> numero navi
					var oldshipsnumber=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp][shipordefense+obj.gid];
					var newshipsnumber=oldshipsnumber+obj.many;
					var title=
						"["
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].x
						+":"
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].y
						+":"
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].z
						+"] "
						+((allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].ismoon)?("[M]"):(""))
						+" - "
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].name;
					var message=
						"+"
						+obj.many
						+" "
						+localization.getLocalizationString(this.language,"gid",obj.gid)
						+" ("
						+oldshipsnumber
						+" -> "
						+newshipsnumber
						+")"
					var type="shipyard";
					var tooltipdata=obj.gid+","+obj.cp;
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp][shipordefense+obj.gid]=newshipsnumber;
					if
					(
						obj.timestamp>allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].resourcesupdate
						&& obj.timestamp<(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+1)
					)
					{
						if(obj.gid==212)
						{
							allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].updateResourcesToTimestamp(obj.timestamp);
						}
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].logAtTimestamp(shipordefense+obj.gid,obj.timestamp);
					}
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].save();
				}
				// era ==1
				else if (howmanytime>0)
				{
					obj.update=actualtime;
					obj.elapsed=newelapsed;
					obj.many=obj.many-howmanytime;
					this.EventsList[k][1]=obj.update
					this.EventsList[k][3]=obj.gid+"|"+obj.cp+"|"+obj.many+"|"+obj.elapsed;
					//codice di aggiornamento del pianeta
					//obj.gid
					//obj.cp
					//howmanytime -> numero navi
					var image="shipyard";
					var sound="shipyard";
					var oldshipsnumber=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp][shipordefense+obj.gid];
					//era +1
					var newshipsnumber=oldshipsnumber+howmanytime;
					var tobuildnumber=obj.many;
					var title=
						"["
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].x
						+":"
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].y
						+":"
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].z
						+"] "
						+((allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].ismoon)?("[M]"):(""))
						+" - "
						+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].name;
					var message=
						"+1 "
						+localization.getLocalizationString(this.language,"gid",obj.gid)
						+" ("
						+oldshipsnumber
						+" -> "
						+newshipsnumber
						+") - "
						+tobuildnumber
						+" queued";
					var type="shipyard";
					var tooltipdata=obj.gid+","+obj.cp;
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp][shipordefense+obj.gid]=newshipsnumber;
					if
					(
						obj.timestamp>allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].resourcesupdate
						&& obj.timestamp<(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+1)
					)
					{
						if(obj.gid==212)
						{
							allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].updateResourcesToTimestamp(obj.timestamp);
						}
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].logAtTimestamp(shipordefense+obj.gid,obj.timestamp);
					}
					allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[obj.cp].save();
				}
				if
				(
					!firstrun
					&& type=="shipyard"
					&& allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].options.getOption("tooltip","shipyard")==1
				)
				{
					globaltooltip.tip(this.language,this.universe,this.ogameid,type,image,sound,title,message,tooltipdata);
				}
			}
		}
	}
}

Events.prototype.RunEvents=function(firstrun)
{
	this.RunShipyardEvents(firstrun);
	var ListEventsFin = this.EndedEventsList();
	for (var p=0; p<ListEventsFin.length; p++)
	{
		var message="";
		var title="";
		var image="";
		var sound="";
		var type="";
		var tooltipdata="";
		var timestamp=ListEventsFin[p][0]
		var data = ListEventsFin[p][3];
		switch(ListEventsFin[p][2])
		{
			case "fleet":
				//allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.getPlanetIdByCoords(x,y,z,ismoon); //<- restituisce l'id di un pianeta
				//allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].QUALCOSA; //<- per agire sul pianeta con id=planetid
				//poi i valori del pianeta sono definiti dalla riga 81 alla riga 147 di Planets.class.js
				//ogni volta che si aggiorna un valore del gruppo, va aggiornato anche il timestamp relativo all'aggiornamento (es: cambia qualcosa nelle risorse-> aggiorni planet.resourcesupdate)
				//va richiamata planet.log(stringa changedvar) a ogni cambio di una variabile (dopo aver impostato il valore!!!)
				//poi va richiamata planet.save()
				//puoi aiutarti per impostare il metallo sul pianeta tramite le funzioni di Planet che calcolano la produzione. Ricordati di calcolare le risorse al timestamp anche passato, poi sommare...
				data=data.split("|");
				var start=data[0].split("%%");
				var startismoon=(start[1]=="moon")?(1):(0);
				start=String(start[0]).split(":");
				var startx=ST_parseInt(start[0]);
				var starty=ST_parseInt(start[1]);
				var startz=ST_parseInt(start[2]);
				var arrival=data[1];
				arrival=arrival.split("%%");
				var arrivalcoords=arrival[0].split(":");
				var x=ST_parseInt(arrivalcoords[0]);
				var y=ST_parseInt(arrivalcoords[1]);
				var z=ST_parseInt(arrivalcoords[2]);
				if (arrival[1]=="moon")
				{
					var ismoon=1;
				}
				else
				{
					var ismoon=0;
				}
				
				ogameidfleet=data[2];
				mission=data[3];
				var met=data[4];
				var cry=data[5];
				var deu=data[6];
				var totalships=data[7];
				var ships=data[8].split(",");
				var planetid=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.getPlanetIdByCoords(x,y,z,ismoon);
				if
				(
					planetid>=0
					&& timestamp>allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].resourcesupdate
					&& timestamp<(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()+1)
				)
				{
					if((mission=="flight owndeploy")||(mission.indexOf("return")>=0))
					{
						for(var i=0;i<GlobalVars.shipsids.length;i++)
						{
							if(ships[GlobalVars.shipsids[i]]>0)
							{
								allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]]["ships_"+GlobalVars.shipsids[i]]=ships[GlobalVars.shipsids[i]];
								allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].logAtTimestamp("ships_"+GlobalVars.shipsids[i],timestamp);
							}
						}
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].save();
					}
					var save=false;
					if(met>0||cry>0||deu>0)
					{
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].updateResourcesToTimestamp(timestamp);
					}
					if(met>0)
					{
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].met+=ST_parseInt(met);
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].logAtTimestamp("met",timestamp);
						save=true;
					}
					if(cry>0)
					{
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].cry+=ST_parseInt(cry);
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].logAtTimestamp("cry",timestamp);
						save=true;
					}
					if(deu>0)
					{
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].deu+=ST_parseInt(deu);
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].logAtTimestamp("deu",timestamp);
						save=true;
					}
					if(save)
					{
						allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planetids[planetid]].save();
					}
				}
				var cleanmission=mission.replace(/ /ig,"_");
				image=cleanmission;
				sound=cleanmission;
				message=localization.getLocalizationString(this.language,"missions",cleanmission);
				title="["+startx+":"+starty+":"+startz+"] "+((startismoon==1)?("[M] "):(""))+" -> ["+x+":"+y+":"+z+"] "+((ismoon==1)?("[M] "):(""));
				type=cleanmission;
				tooltipdata=x+","+y+","+z+","+ismoon+","+startx+","+starty+","+startz+","+startismoon;
			break;
			case "research":
				gid=data.split('|')[0];
				cp=data.split('|')[1];
			break;
			case "buildings":
				var splitter = data.split("|");
				var objsplit={
					"cp":	splitter[0],
					"gid":	splitter[1],
					"mode":	splitter[2]
				}
				image=((objsplit.mode=="add")?("buildingupgraded"):("buildingdowngraded"));
				sound=((objsplit.mode=="add")?("buildingupgraded"):("buildingdowngraded"));
				var oldlevel=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp][((objsplit.gid!=41&&objsplit.gid!=42&&objsplit.gid!=43)?(""):("moon"))+"building_"+objsplit.gid];
				var newlevel=oldlevel+((objsplit.mode=="add")?(1):(-1));
				title="["
					+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].x
					+":"
					+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].y
					+":"
					+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].z
					+"] "
					+((allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].ismoon)?("[M]"):(""))
					+" - "
					+allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].name;
				message=localization.getLocalizationString(this.language,"gid",objsplit.gid)
					+" ("
					+oldlevel
					+" -> "
					+newlevel
					+")";
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].updateResourcesToTimestamp(timestamp);
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp][((objsplit.gid!=41&&objsplit.gid!=42&&objsplit.gid!=43)?(""):("moon"))+"building_"+objsplit.gid]=newlevel;
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].logAtTimestamp(((objsplit.gid!=41&&objsplit.gid!=42&&objsplit.gid!=43)?(""):("moon"))+"building_"+objsplit.gid,timestamp);
				allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].planets.planets[objsplit.cp].save();
				type=(objsplit.mode=="add")?("buildingupgraded"):("buildingdowngraded");
				tooltipdata=objsplit.gid+","+objsplit.cp;
			break;
			case "shipyard":
				continue;
			break;
		}
		if(!firstrun)
		{
			globaltooltip.tip(this.language,this.universe,this.ogameid,type,image,sound,title,message,tooltipdata);
		}
	}
	this.save();
}

Events.prototype.getResearchEvents=function()
{
	//RETURN an object
	//.timestamp --> timestamp
	//.update --> update time
	//.gid --> gid
	//.cp --> cp of lanch planet
	for (var k=0; k<this.EventsList.length; k++)
	{
		if (this.EventsList[k][2]=="research")
		{
			var tempobj = new Object();
			tempobj.timestamp=this.EventsList[k][0];
			tempobj.update=this.EventsList[k][1];
			tempobj.gid=this.EventsList[k][3].split("|")[0];
			tempobj.cp=this.EventsList[k][3].split("|")[1]
			return tempobj;
		}													
	}
	return false;
}
Events.prototype.getPlanetsBuildingsEvents=function(cp)
{
	//RETURN an array with object
	//array[].cp --> planet cp
	//array[].timestamp --> timestamp
	//array[].update --> update time
	//array[].gid --> gid
	//array[].mode --> mode (add, remove, destroy)
	var ListTemp = new Array();
	for (var k=0; k<this.EventsList.length; k++)
	{
		if (this.EventsList[k][2]=="buildings" && this.EventsList[k][3].split("|")[0]==cp)
		{
			var tempobj = new Object();
			tempobj.timestamp=this.EventsList[k][0];
			tempobj.update=this.EventsList[k][1];
			var splitting = this.EventsList[k][3].split("|");
			tempobj.cp = splitting[0];
			tempobj.gid = splitting[1];
			tempobj.mode = splitting[2];
			ListTemp.push(tempobj);
		}
	}
	if (ListTemp.length>0)
	{
		ListTemp.sort(function(a,b){return a.timestamp - b.timestamp});
		return ListTemp;
	}
	else
		return false;
}
Events.prototype.getPlanetsShipyardEvents=function(cp)
{
	//RETURN an array with object
	//array[].cp --> planet cp
	//array[].timestamp --> timestamp
	//array[].update --> update time
	//array[].gid --> gid
	//array[].many --> howmany
	var ListTemp = new Array();
	for (var k=0; k<this.EventsList.length; k++)
	{
		if (this.EventsList[k][2]=="shipyard" && this.EventsList[k][3].split("|")[1]==cp)
		{
			var tempobj = new Object();
			tempobj.timestamp=this.EventsList[k][0];
			tempobj.update=this.EventsList[k][1];
			var splitting = this.EventsList[k][3].split("|");
			tempobj.cp = splitting[1];
			tempobj.gid = splitting[0];
			tempobj.many = splitting[2];
			ListTemp.push(tempobj);
		}
	}
	if (ListTemp.length>0)
	{
		ListTemp.sort(function(a,b){return a.timestamp - b.timestamp});
		return ListTemp;
	}
	else
		return false;
}

Events.prototype.setEventsTimeOut=function()
{
	var events=this;
	this.EventsList=this.OrderEvents(this.EventsList);
	//var time = this.FirstTimeOut(0);
	//if (time != -1){
	this.currenttimer=window.setTimeout
	(
		function(events)
		{
			allaccounts.accounts[allaccounts.accountindex[events.language][events.universe][events.ogameid]].events.RunEvents(false);
		},
	300,
	events
	);
	/*}
	else
	{
		if	((typeof (this.currenttimer)) == "number")
			clearTimeout(this.currenttimer);
	}*/
}

Events.prototype.FirstTimeOut=function(rounding)
{
	//var actualtime = allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
	var actualtime = allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
	if (this.EventsList.length>0) return (this.EventsList[0][0]-rounding-actualtime);
	else return -1;
}

Events.prototype.EndedEventsList=function()
{
	//Return an array of Events
	var ListTemp = new Array();
	var ListTemp2 = new Array();
	var actualtime = allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
	for (var k=0; k<this.EventsList.length; k++)
	{
		if (actualtime>=this.EventsList[k][0]) ListTemp.push(this.EventsList[k]);
		else ListTemp2.push(this.EventsList[k]);
	}
	this.EventsList=ListTemp2;
	this.EventsList=this.OrderEvents(this.EventsList);
	this.setEventsTimeOut();
	return ListTemp;
}

Events.prototype.ClearEventsType=function(type, cp)
{
	try{	
		var ListTemp = new Array();
		for (var k=0; k<this.EventsList.length; k++)
		{
			switch(type)
			{
				case "buildings":
					if (this.EventsList[k][3].split("|")[0]!=cp) ListTemp.push(this.EventsList[k]);
				break;
				case "shipyard":
					if (this.EventsList[k][3].split("|")[1]!=cp) ListTemp.push(this.EventsList[k]);
				break;
				default:
					if (this.EventsList[k][2]!=type) ListTemp.push(this.EventsList[k]);
				break;
			}
		}
		this.EventsList=ListTemp;
	}
	catch(e)
	{
		st_errors.adderror
			(
				e,
				"ClearEventsType",
				"see_how_to_retrieve_html",
				"no_interesting_vars"
			)
	}
}

Events.prototype.OrderEvents=function(eventiorder)
{
	eventiorder.sort(function(a,b){return a[0] - b[0]});
	return eventiorder;
}

Events.prototype.AddEvents=function(eventstime,updatetime,type,data)
{
	try
	{
		if (updatetime==false) var temp = allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
		else var temp = updatetime;
		//if (type=="fleet"){
			var temparray = new Array();
			temparray[0]=ST_parseInt(eventstime);
			temparray[1]=ST_parseInt(temp);
			temparray[2]=type;
			temparray[3]=data;
			this.EventsList.push(temparray);
		//}
		this.EventsList=this.OrderEvents(this.EventsList);
		this.RunEvents(false);
		return;
	}
	catch(e)
	{
		st_errors.adderror
			(
				e,
				"AddEvents",
				"see_how_to_retrieve_html",
				"no_interesting_vars"
			)
	}
}

Events.prototype.RemoveBuildingsEvent=function(gid,timestamp,cp)
{
	try
	{	
		var ListTemp = new Array();
		for (var k=0; k<this.EventsList.length; k++)
		{
			if (this.EventsList[k][3].split("|")[0]!=cp &&
			this.EventsList[k][3].split("|")[1]!=gid &&
			this.EventsList[k][0]!=timestamp &&
			this.EventsList[k][2]!="buildings") 
				ListTemp.push(this.EventsList[k]);
		}
		this.EventsList=this.OrderEvents(ListTemp);
	}
	catch(e)
	{
		st_errors.adderror
			(
				e,
				"RemoveBuildingsEvent",
				"see_how_to_retrieve_html",
				"no_interesting_vars"
			)
	}
}

Events.prototype.save=function()
{
	try
	{
		this.AccountDB.executeSimpleSQL(
			"DELETE FROM events_list"
			);
		var seteventsquery=this.AccountDB.createStatement(
			"INSERT INTO "
					+"events_list "
						+"( "
						+"timestamp, "
						+"updated, "
						+"type, "
						+"data"
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3, "
						+"?4 "
					+") "
		);
		
		for(var l=0; l<this.EventsList.length; l++)
		{
			seteventsquery.bindInt64Parameter			(0, this.EventsList[l][0]);
			seteventsquery.bindInt64Parameter			(1, this.EventsList[l][1]);
			seteventsquery.bindUTF8StringParameter		(2, this.EventsList[l][2]);
			seteventsquery.bindUTF8StringParameter		(3, this.EventsList[l][3]);
			seteventsquery.execute();
		}
	}
	catch(e)
	{
		st_errors.adderror
			(
				e,
				"save",
				"see_how_to_retrieve_html",
				"no_interesting_vars"
			)
	}
}

Events.prototype.load=function()
{
	try
	{
		var TempList=new Array();
		var loadeventsquery=this.AccountDB.createStatement(
			"SELECT "
					+"timestamp, "
					+"updated, "
					+"type, "
					+"data "
				+"FROM "
					+"events_list"
		);
		while(loadeventsquery.executeStep())
		{
			var temparray = new Array();
			temparray[0] = loadeventsquery.getInt64					(0);
			temparray[1] = loadeventsquery.getInt64					(1);
			temparray[2] = loadeventsquery.getUTF8String			(2);
			temparray[3] = loadeventsquery.getUTF8String			(3);
			TempList.push(temparray);
		}
		this.EventsList=TempList;
		this.EventsList=this.OrderEvents(this.EventsList);
	}
	catch(e)
	{
		st_errors.adderror
			(
				e,
				"load",
				"see_how_to_retrieve_html",
				"no_interesting_vars"
			)
	}
}