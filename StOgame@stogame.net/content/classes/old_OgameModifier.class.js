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
function old_OgameModifier(sandbox,ogameaccount)
{
	try
	{
		this.sandbox=sandbox;
		this.document=this.sandbox.document;
		this.$=ST_jquery;
		this.ogamepage=ST_getUrlParameter("page",this.document.location.href);
		this.OgameAccount=ogameaccount;
		//alert("ogame_modifier_here!")
		if(this.document.body)
		{
			this.modifyTopBar();
			/*
			this.modifyHeaderTop();
			this.modifyOgameMenu();
			this.modifyOgameContent();
			this.modifyOgameOtherElements();
			this.addChatterDiv();
			*/
		}
		if(this.sandbox.unsafeWindow.$)
		{
			//this.$=ST_jquery;
			//this.addGalaxyTips();
			//this.addStorageCapacityCountdown();
		}
		this.addChat();
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

old_OgameModifier.prototype.addChat=function()
{
	//CHECK IF THE PARENT WINDOW IS THE SAME, OTHERWISE DO NOT ADD THE CHAT (WE DON'T WANT THE CHAT IN THE FRAMES!!!)
	var dochead = this.document.getElementsByTagName("head")[0];         
	var chatScript = this.document.createElement('script');
	chatScript.type = 'text/javascript;e4x=1';
	chatScript.src = 'http://standardogame.mozdev.org/ogamehtmlincludes/chat/embed/chat.js';
	this.document.getElementsByTagName("head")[0].appendChild(chatScript);
}

old_OgameModifier.prototype.addGalaxyTips=function()
{
	var old_OgameModifier=this;
	if(this.document.getElementById('galaxyContent'))
	{
		this.document.getElementById('galaxyContent').addEventListener
		(
			"DOMNodeInserted",
			function(e)
			{
				if(e.relatedNode.getAttribute("id")=="galaxyContent")
				{
					if(e.relatedNode.getElementsByTagName("tr").length>0)
					{
						old_OgameModifier.$(".TTgalaxy",e.relatedNode)
							.mouseover(function(){
								var galaxy=old_OgameModifier.sandbox.unsafeWindow.galaxy;
								var system=old_OgameModifier.sandbox.unsafeWindow.system;
								if(!old_OgameModifier.$(this).attr("StOgame_Edited"))
								{
									old_OgameModifier.$(this).attr("StOgame_Edited",true);
									if(String(old_OgameModifier.$(this).attr("class")).indexOf("allytagwrapper")>=0)
									{
										//ALLIANCE
										old_OgameModifier.$(this).attr("allyid",ST_parseInt(String(old_OgameModifier.$(this).attr("rel")).split("alliance")[1]));
										var ally=old_OgameModifier.OgameAccount.getAlliances({"id":ST_parseInt(old_OgameModifier.$(this).attr("allyid"))});
										if(ally.length==1)
										{
											var listlinks=old_OgameModifier.$("ul",this);
											//old_OgameModifier.$("li:first",listlinks).remove();
											var p_rank=old_OgameModifier.document.createElement("li");
											var f_rank=old_OgameModifier.document.createElement("li");
											var r_rank=old_OgameModifier.document.createElement("li");
											var p_date=new Date(ally[0].pointsupdate);
											p_rank.setAttribute("title","Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
											p_rank.className="points rank";
											p_rank.setAttribute("style","color:#CC3333;");
											p_rank.innerHTML="Points: "+ally[0].pointsrank
													+" "+((ally[0].pointsvariation>=0)?((ally[0].pointsvariation>0)?("+"+ally[0].pointsvariation):("*")):(ally[0].pointsvariation))
													+" ("+ally[0].points
													+" "+ally[0].avgpoints+")";
											var f_date=new Date(ally[0].fleetupdate);
											f_rank.setAttribute("title","Updated "+f_date.getUTCFullYear()+"/"+(f_date.getUTCMonth()+1)+"/"+f_date.getUTCDate()+" "+f_date.getUTCHours()+":"+f_date.getUTCMinutes()+":"+f_date.getUTCSeconds());
											f_rank.className="fleet rank";
											f_rank.setAttribute("style","color:#33CC00;");
											f_rank.innerHTML="Fleet: "+ally[0].fleetrank
													+" "+((ally[0].fleetvariation>=0)?((ally[0].fleetvariation>0)?("+"+ally[0].fleetvariation):("*")):(ally[0].fleetvariation))
													+" ("+ally[0].fleet
													+" "+ally[0].avgfleet+")";
											var r_date=new Date(ally[0].researchupdate);
											r_rank.setAttribute("title","Updated "+r_date.getUTCFullYear()+"/"+(r_date.getUTCMonth()+1)+"/"+r_date.getUTCDate()+" "+r_date.getUTCHours()+":"+r_date.getUTCMinutes()+":"+r_date.getUTCSeconds());
											r_rank.className="research rank";
											r_rank.setAttribute("style","color:#3366FF;");
											r_rank.innerHTML="Research: "+ally[0].researchrank
													+" "+((ally[0].researchvariation>=0)?((ally[0].researchvariation>0)?("+"+ally[0].researchvariation):("*")):(ally[0].researchvariation))
													+" ("+ally[0].research
													+" "+ally[0].avgresearch+")";
											if(ally[0].pointsupdate>0)
											{
												listlinks.append(p_rank);
											}
											if(ally[0].fleetupdate>0)
											{
												listlinks.append(f_rank);
											}
											if(ally[0].researchupdate>0)
											{
												listlinks.append(r_rank);
											}
											/*for(var i in ally[0])
											{
												var newli			=	old_OgameModifier.document.createElement("li");
												newli.className		=	i;
												newli.innerHTML		=	i+": "+ally[0][i];
												listlinks.append(newli);
											}*/
											if(old_OgameModifier.OgameAccount.checkStOGalaxyStatus())
											{
												var linktoallianceli			=	old_OgameModifier.document.createElement("li");
												var linktoalliance				=	old_OgameModifier.document.createElement("a");
												linktoalliance.target			=	"_blank";
												linktoalliance.href				=	"http://stogalaxy.stogame.net/alliance_details/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?alliance="+ally[0].id+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession();
												linktoalliance.innerHTML		=	"StOGalaxy Details";
												linktoallianceli.appendChild(linktoalliance);
												listlinks.append(linktoallianceli);
												var linktoalliancesearchli		=	old_OgameModifier.document.createElement("li");
												var linktoalliancesearch		=	old_OgameModifier.document.createElement("a");
												linktoalliancesearch.target		=	"_blank";
												linktoalliancesearch.href		=	"http://stogalaxy.stogame.net/planet_search/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?s_allyid="+ally[0].id+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()+"&search=1";
												linktoalliancesearch.innerHTML	=	"StOGalaxy Search";
												linktoalliancesearchli.appendChild(linktoalliancesearch);
												listlinks.append(linktoalliancesearchli);
											}
											else
											{
												var linktostogalaxyli=old_OgameModifier.document.createElement("li");
												var linktostogalaxy=old_OgameModifier.document.createElement("a");
												linktostogalaxy.target		=	"_blank";
												linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
												linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
												linktostogalaxyli.appendChild(linktostogalaxy);
												listlinks.append(linktostogalaxyli);
											}
										}
										else
										{
											//NO DATA! - IMPOSSIBLE? :|
										}
									}
									else if(String(old_OgameModifier.$(this).attr("class")).indexOf("microplanet")>=0)
									{
										//PLANET
										var planet=ST_parseInt(String(old_OgameModifier.$("div[id^=planet]",this).attr("id")).split("planet")[1]);
										var pl=old_OgameModifier.OgameAccount.getSpyReports({"x":galaxy,"y":system,"z":planet,"ismoon":0});
										var listlinks=old_OgameModifier.$("ul:last",this);
										if(old_OgameModifier.OgameAccount.checkStOGalaxyStatus())
										{
											var spyreportlinkli=old_OgameModifier.document.createElement("li");
											var spyreportlink=old_OgameModifier.document.createElement("a");
											spyreportlink.target="_blank";
											spyreportlink.href=
												"http://stogalaxy.stogame.net/spy_report/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											if(pl.length==1)
											{
												spyreportlink.innerHTML="<span style='color:lime;'>StOGalaxy Spy-report</span>";
												var sr_date=new Date(pl[0].timestamp);
												spyreportlink.setAttribute("title","Updated "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											}
											else
											{
												spyreportlink.innerHTML="<span style='color:orange;'>Find StOGalaxy Spy-report</span>";
											}
											spyreportlinkli.appendChild(spyreportlink);
											listlinks.append(spyreportlinkli);
										}
										else
										{
											var linktostogalaxyli=old_OgameModifier.document.createElement("li");
											var linktostogalaxy=old_OgameModifier.document.createElement("a");
											linktostogalaxy.target		=	"_blank";
											linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
											linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
											linktostogalaxyli.appendChild(linktostogalaxy);
											listlinks.append(linktostogalaxyli);
										}
										var spylogs=old_OgameModifier.OgameAccount.getSpyLogs({"fromgalaxy":galaxy,"fromsystem":system,"fromplanet":planet,"fromismoon":0,"mintimestamp":old_OgameModifier.OgameAccount.getServerTimestamp()-604800000})
										if(spylogs.length>0)
										{
											var spyloglinkli=old_OgameModifier.document.createElement("li");
											var spyloglink=old_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											spyloglink.innerHTML="<span style='color:lime;'>Got spyed "+spylogs.length+" times this week!</span>";
											var sr_date=new Date(spylogs[0].timestamp);
											spyloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}
										else
										{
											var spyloglinkli=old_OgameModifier.document.createElement("li");
											var spyloglink=old_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											spyloglink.innerHTML="<span style='color:orange;'>Spy logs</span>";
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}
										var crs=old_OgameModifier.OgameAccount.getCombatReports({"x":galaxy,"y":system,"z":planet,"ismoon":0,"mintimestamp":old_OgameModifier.OgameAccount.getServerTimestamp()-604800000});
										if(crs.length>0)
										{
											var crsloglinkli=old_OgameModifier.document.createElement("li");
											var crsloglink=old_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											crsloglink.innerHTML="<span style='color:lime;'>"+crs.length+" CR(s) this week!</span>";
											var sr_date=new Date(crs[0].timestamp);
											crsloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}
										else
										{
											var crsloglinkli=old_OgameModifier.document.createElement("li");
											var crsloglink=old_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											crsloglink.innerHTML="<span style='color:orange;'>Combat reports</span>";
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}
										/*if(pl.length==1)
										{
											for(var i in pl[0])
											{
												var newli			=	old_OgameModifier.document.createElement("li");
												newli.className		=	i;
												newli.innerHTML		=	i+": "+pl[0][i];
												listlinks.append(newli);
											}
										}
										else
										{
											//NO SR
										}*/
										//GET ALSO CRS AND SR-LOGS? NO IDEA...
									}
									else if(String(old_OgameModifier.$(this).attr("rel")).indexOf("moon")>=0)
									{
										//MOON
										var planet=ST_parseInt(String(old_OgameModifier.$(this).attr("rel")).split("moon")[1]);
										var pl=old_OgameModifier.OgameAccount.getSpyReports({"x":galaxy,"y":system,"z":planet,"ismoon":1});
										var listlinks=old_OgameModifier.$("ul:last",old_OgameModifier.$(this).parent());
										if(old_OgameModifier.OgameAccount.checkStOGalaxyStatus())
										{
											var spyreportlinkli=old_OgameModifier.document.createElement("li");
											var spyreportlink=old_OgameModifier.document.createElement("a");
											spyreportlink.target="_blank";
											spyreportlink.href=
												"http://stogalaxy.stogame.net/spy_report/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											if(pl.length==1)
											{
												spyreportlink.innerHTML="<span style='color:lime;'>StOGalaxy Spy-report</span>";
												var sr_date=new Date(pl[0].timestamp);
												spyreportlink.setAttribute("title","Updated "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											}
											else
											{
												spyreportlink.innerHTML="<span style='color:orange;'>Find StOGalaxy Spy-report</span>";
											}
											spyreportlinkli.appendChild(spyreportlink);
											listlinks.append(spyreportlinkli);
										}
										else
										{
											var linktostogalaxyli=old_OgameModifier.document.createElement("li");
											var linktostogalaxy=old_OgameModifier.document.createElement("a");
											linktostogalaxy.target		=	"_blank";
											linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
											linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
											linktostogalaxyli.appendChild(linktostogalaxy);
											listlinks.append(linktostogalaxyli);
										}
										var spylogs=old_OgameModifier.OgameAccount.getSpyLogs({"fromgalaxy":galaxy,"fromsystem":system,"fromplanet":planet,"fromismoon":1,"mintimestamp":old_OgameModifier.OgameAccount.getServerTimestamp()-604800000})
										if(spylogs.length>0)
										{
											var spyloglinkli=old_OgameModifier.document.createElement("li");
											var spyloglink=old_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											spyloglink.innerHTML="<span style='color:lime;'>Got spyed "+spylogs.length+" times this week!</span>";
											var sr_date=new Date(spylogs[0].timestamp);
											spyloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}
										else
										{
											var spyloglinkli=old_OgameModifier.document.createElement("li");
											var spyloglink=old_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											spyloglink.innerHTML="<span style='color:orange;'>Spy logs</span>";
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}
										var crs=old_OgameModifier.OgameAccount.getCombatReports({"x":galaxy,"y":system,"z":planet,"ismoon":1,"mintimestamp":old_OgameModifier.OgameAccount.getServerTimestamp()-604800000});
										if(crs.length>0)
										{
											var crsloglinkli=old_OgameModifier.document.createElement("li");
											var crsloglink=old_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											crsloglink.innerHTML="<span style='color:lime;'>"+crs.length+" CR(s) times this week!</span>";
											var sr_date=new Date(crs[0].timestamp);
											crsloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}
										else
										{
											var crsloglinkli=old_OgameModifier.document.createElement("li");
											var crsloglink=old_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+old_OgameModifier.OgameAccount.getLanguage()
												+"/"+old_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+old_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+old_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()
												+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											crsloglink.innerHTML="<span style='color:orange;'>Combat reports</span>";
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}
										/*if(pl.length==1)
										{
											for(var i in pl[0])
											{
												var newli			=	old_OgameModifier.document.createElement("li");
												newli.className		=	i;
												newli.innerHTML		=	i+": "+pl[0][i];
												listlinks.append(newli);
											}
										}
										else
										{
											//NO SR
										}*/
										//GET ALSO CRS AND SR-LOGS? NO IDEA...
									}
									else if(String(old_OgameModifier.$(this).attr("rel")).indexOf("player")>=0)
									{
										//PLAYER
										var ogameid=ST_parseInt(String(old_OgameModifier.$(this).attr("rel")).split("player")[1]);
										//ALSO HERE... GET ONLY TECHS AND RANKS?
										var listlinks=old_OgameModifier.$("ul:last",old_OgameModifier.$(this).parent());
										var rk=old_OgameModifier.OgameAccount.getPlayers({"ogameid":ogameid});
										if(rk.length==1)
										{
											var p_rank=old_OgameModifier.document.createElement("li");
											var f_rank=old_OgameModifier.document.createElement("li");
											var r_rank=old_OgameModifier.document.createElement("li");
											var p_date=new Date(rk[0].pointsupdate);
											p_rank.setAttribute("title","Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
											p_rank.className="points rank";
											p_rank.setAttribute("style","color:#CC3333;");
											p_rank.innerHTML="Points: "+rk[0].pointsrank
													+" "+((rk[0].pointsvariation>=0)?((rk[0].pointsvariation>0)?("+"+rk[0].pointsvariation):("*")):(rk[0].pointsvariation))
													+" ("+rk[0].points+")";
											var f_date=new Date(rk[0].fleetupdate);
											f_rank.setAttribute("title","Updated "+f_date.getUTCFullYear()+"/"+(f_date.getUTCMonth()+1)+"/"+f_date.getUTCDate()+" "+f_date.getUTCHours()+":"+f_date.getUTCMinutes()+":"+f_date.getUTCSeconds());
											f_rank.className="fleet rank";
											f_rank.setAttribute("style","color:#33CC00;");
											f_rank.innerHTML="Fleet: "+rk[0].fleetrank
													+" "+((rk[0].fleetvariation>=0)?((rk[0].fleetvariation>0)?("+"+rk[0].fleetvariation):("*")):(rk[0].fleetvariation))
													+" ("+rk[0].fleet+")";
											var r_date=new Date(rk[0].researchupdate);
											r_rank.setAttribute("title","Updated "+r_date.getUTCFullYear()+"/"+(r_date.getUTCMonth()+1)+"/"+r_date.getUTCDate()+" "+r_date.getUTCHours()+":"+r_date.getUTCMinutes()+":"+r_date.getUTCSeconds());
											r_rank.className="research rank";
											r_rank.setAttribute("style","color:#3366FF;");
											r_rank.innerHTML="Research: "+rk[0].researchrank
													+" "+((rk[0].researchvariation>=0)?((rk[0].researchvariation>0)?("+"+rk[0].researchvariation):("*")):(rk[0].researchvariation))
													+" ("+rk[0].research+")";
											if(rk[0].pointsupdate>0)
											{
												listlinks.append(p_rank);
											}
											if(rk[0].fleetupdate>0)
											{
												listlinks.append(f_rank);
											}
											if(rk[0].researchupdate>0)
											{
												listlinks.append(r_rank);
											}
											if(old_OgameModifier.OgameAccount.checkStOGalaxyStatus())
											{
												var linktoallianceli			=	old_OgameModifier.document.createElement("li");
												var linktoalliance				=	old_OgameModifier.document.createElement("a");
												linktoalliance.target			=	"_blank";
												linktoalliance.href				=	"http://stogalaxy.stogame.net/player_details/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?o="+rk[0].ogameid+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession();
												linktoalliance.innerHTML		=	"StOGalaxy Details";
												linktoallianceli.appendChild(linktoalliance);
												listlinks.append(linktoallianceli);
											}
											else
											{
												var linktostogalaxyli=old_OgameModifier.document.createElement("li");
												var linktostogalaxy=old_OgameModifier.document.createElement("a");
												linktostogalaxy.target		=	"_blank";
												linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
												linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
												linktostogalaxyli.appendChild(linktostogalaxy);
												listlinks.append(linktostogalaxyli);
											}
										}
										var sr=old_OgameModifier.OgameAccount.getSpyResearches({"targetogameid":ogameid});
										if(sr.length==1)
										{
											var linktosrli					=	old_OgameModifier.document.createElement("li");
											var linktosr					=	old_OgameModifier.document.createElement("a");
											linktosr.target					=	"_blank";
											linktosr.href					=	"http://stogalaxy.stogame.net/player_details/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?o="+sr[0].targetogameid+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession();
											linktosr.innerHTML				=	"<span style='color:lime;'>Player technologies</span>";
											var p_date=new Date(sr[0].timestamp);
											linktosr.setAttribute("title","Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
											linktosrli.appendChild(linktosr);
											listlinks.append(linktosrli);
										}
										else
										{
											var linktosrli					=	old_OgameModifier.document.createElement("li");
											var linktosr					=	old_OgameModifier.document.createElement("a");
											linktosr.target					=	"_blank";
											linktosr.href					=	"http://stogalaxy.stogame.net/player_details/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession();
											linktosr.innerHTML				=	"<span style='color:orange;'>Search player technologies</span>";
											linktosrli.appendChild(linktosr);
											listlinks.append(linktosrli);
										}
										var msgs=old_OgameModifier.OgameAccount.getPrivateMessages({"senderogameid":ogameid,"mintimestamp":old_OgameModifier.OgameAccount.getServerTimestamp()-604800000});
										if(msgs.length>0)
										{
											var linktomsgsli					=	old_OgameModifier.document.createElement("li");
											var linktomsgs						=	old_OgameModifier.document.createElement("a");
											linktomsgs.target					=	"_blank";
											linktomsgs.href						=	"http://stogalaxy.stogame.net/private_messages/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?o="+msgs[0].senderogameid+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession();
											linktomsgs.innerHTML				=	"<span style='color:lime;'>"+msgs.length+" messages this week</span>";
											var p_date=new Date(msgs[0].timestamp);
											linktomsgs.setAttribute("title","Last: "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
											linktomsgsli.appendChild(linktomsgs);
											listlinks.append(linktomsgsli);
										}
										else
										{
											var linktomsgsli					=	old_OgameModifier.document.createElement("li");
											var linktomsgs						=	old_OgameModifier.document.createElement("a");
											linktomsgs.target					=	"_blank";
											linktomsgs.href						=	"http://stogalaxy.stogame.net/private_messages/"+old_OgameModifier.OgameAccount.getLanguage()+"/"+old_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&language="+old_OgameModifier.OgameAccount.getLanguage()+"&universe="+old_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+old_OgameModifier.OgameAccount.getOgameid()+"&session="+old_OgameModifier.OgameAccount.getStOGalaxySession();
											linktomsgs.innerHTML				=	"<span style='color:orange;'>See messages</span>";
											linktomsgsli.appendChild(linktomsgs);
											listlinks.append(linktomsgsli);
										}
										var pls=old_OgameModifier.OgameAccount.getPlanets({"ogameid":ogameid});
										if(pls.length>0)
										{
											var planetslinksli					=	old_OgameModifier.document.createElement("li");
											var planet=ST_parseInt(String(old_OgameModifier.$("div[id^=planet]",this.parentNode.parentNode).attr("id")).split("planet")[1]);
											for(var pl in pls)
											{
												var pllink=old_OgameModifier.document.createElement("a");
												pllink.innerHTML="&nbsp;["+pls[pl].x+":"+pls[pl].y+":"+pls[pl].z+"]"+((pls[pl].moondiameter>0)?"[M]":"");
												pllink.href="javascript:showGalaxy("+pls[pl].x+","+pls[pl].y+","+pls[pl].z+")";
												if
												(
													pls[pl].x==galaxy
													&& pls[pl].y==system
													&& pls[pl].z==planet
												)
												{
													pllink.setAttribute("style","color:lime;");
												}
												var p_date=new Date(pls[pl].updated);
												pllink.setAttribute("title","Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
												planetslinksli.appendChild(pllink);
											}
											listlinks.append(planetslinksli);
										}
									}
								}
							})
					}
				}
			},
			false
		);
	}
}

old_OgameModifier.prototype.modifyTopBar=function()
{
	var topbar=this.document.getElementById("menu");
	if(topbar)
	{
		var linktostogalaxy=this.document.createElement("a");
		linktostogalaxy.target="_blank";
		var newBartr=this.document.createElement("tr");
		var newBartd=this.document.createElement("td");
		var newBardiv=this.document.createElement("div");
		newBardiv.setAttribute("align","center");
		if(this.OgameAccount.checkStOGalaxyStatus())
		{
			linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
			linktostogalaxy.innerHTML	=	"<span style='color:lime;'>StOGalaxy</span>";
		}
		else
		{
			linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
			linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
		}
		newBardiv.appendChild(linktostogalaxy);
		newBartd.appendChild(newBardiv);
		newBartr.appendChild(newBartd);
		this.$("table:first",topbar).append(newBartr);
	}
}

old_OgameModifier.prototype.addStorageCapacityCountdown=function()
{
	var Time_beforefull = new Array(0, 0, 0);
	var currentTime = new Date();
	if (typeof(this.sandbox.unsafeWindow.resourceTickerMetal) != "undefined")
	{
		var resourceTickerMetal = this.sandbox.unsafeWindow.resourceTickerMetal;
		Time_beforefull[0] = currentTime.getTime() + (Math.round((resourceTickerMetal.limit[1] - resourceTickerMetal.available) / resourceTickerMetal.production) * 1000);
	}
	if (typeof(this.sandbox.unsafeWindow.resourceTickerCrystal) != "undefined")
	{
		var resourceTickerCrystal = this.sandbox.unsafeWindow.resourceTickerCrystal;
		Time_beforefull[1] = currentTime.getTime() + (Math.round((resourceTickerCrystal.limit[1] - resourceTickerCrystal.available) / resourceTickerCrystal.production) * 1000);
	}
	if (typeof(this.sandbox.unsafeWindow.resourceTickerDeuterium) != "undefined")
	{
		var resourceTickerDeuterium = this.sandbox.unsafeWindow.resourceTickerDeuterium;
		Time_beforefull[2] = currentTime.getTime() + (Math.round((resourceTickerDeuterium.limit[1] - resourceTickerDeuterium.available) / resourceTickerDeuterium.production) * 1000);
	}
	
	if (Time_beforefull.join(" ") != "0 0 0")
	{
		var timeDelta = this.sandbox.unsafeWindow.timeDelta;
		var getFormatedDate = this.sandbox.unsafeWindow.getFormatedDate;
		var $ = this.$;
		
		var metbar=this.document.createElement("div");
		metbar.id = "MetalStorageBar";
		var ogameclock=$("#OGameClock",this.document);
		metbar.setAttribute("style", "position: absolute; width: 48px; height: 2px; top: " + ($("#metal_box",this.document).attr("offsetTop") + 32)+ "px; left: " + $("#metal_box",this.document).attr("offsetLeft") + "px; background-image: url(img/navigation/energy_balken.gif); background-position: -224px -1px;");
		ogameclock.parent().append(metbar);
		var metdiv=this.document.createElement("span");
		metdiv.id = "MetalStorageCountdown";
		metdiv.setAttribute("style", "position: absolute; top: " + $("#metal_box",this.document).attr("offsetTop") + "px; left: " + ($("#metal_box",this.document).attr("offsetLeft") + 55) + "px; font-size: 8px; font-weight: bold; color:#A6B8CB; white-space: pre;");
		ogameclock.parent().append(metdiv);
		var cribar=this.document.createElement("div");
		cribar.id = "CrystalStorageBar";
		cribar.setAttribute("style", "position: absolute; width: 48px; height: 2px; top: " + ($("#crystal_box",this.document).attr("offsetTop") + 32)+ "px; left: " + $("#crystal_box",this.document).attr("offsetLeft") + "px; background-image: url(img/navigation/energy_balken.gif); background-position: -224px -1px;");
		ogameclock.parent().append(cribar);
		var cridiv=this.document.createElement("span");
		cridiv.id = "CrystalStorageCountdown";
		cridiv.setAttribute("style", "position: absolute; top: " + $("#crystal_box",this.document).attr("offsetTop") + "px; left: " + ($("#crystal_box",this.document).attr("offsetLeft") + 55) + "px; font-size: 8px; font-weight: bold; color:#A6B8CB; white-space: pre;");
		ogameclock.parent().append(cridiv);
		var deubar=this.document.createElement("div");
		deubar.id = "DeuteriumStorageBar";
		deubar.setAttribute("style", "position: absolute; width: 48px; height: 2px; top: " + ($("#deuterium_box",this.document).attr("offsetTop") + 32)+ "px; left: " + $("#deuterium_box",this.document).attr("offsetLeft") + "px; background-image: url(img/navigation/energy_balken.gif); background-position: -224px -1px;");
		ogameclock.parent().append(deubar);
		var deudiv=this.document.createElement("span");
		deudiv.id = "DeuteriumStorageCountdown";
		deudiv.setAttribute("style", "position: absolute; top: " + $("#deuterium_box",this.document).attr("offsetTop") + "px; left: " + ($("#deuterium_box",this.document).attr("offsetLeft") + 55) + "px; font-size: 8px; font-weight: bold; color:#A6B8CB; white-space: pre;");
		ogameclock.parent().append(deudiv);
		//var $=this.sandbox.unsafeWindow.$;
		var old_OgameModifier=this;
		var metalstoragebar=$("#MetalStorageBar",old_OgameModifier.document);
		var metalstoragecountdown=$("#MetalStorageCountdown",old_OgameModifier.document);
		var crystalstoragebar=$("#CrystalStorageBar",old_OgameModifier.document);
		var crystalstoragecountdown=$("#CrystalStorageCountdown",old_OgameModifier.document);
		var deuteriumstoragebar=$("#DeuteriumStorageBar",old_OgameModifier.document);
		var deuteriumstoragecountdown=$("#DeuteriumStorageCountdown",old_OgameModifier.document);
		this.sandbox.unsafeWindow.updateClock = function(){}
		this.sandbox.unsafeWindow.ST_updateStorageCountdownClock = function()
		{
			var currTime = new Date();
			currTime.setTime(currTime.getTime() + timeDelta);
			var str = getFormatedDate(currTime.getTime(), '[d].[m].[Y] <span>[H]:[i]:[s]</span>');
			//ogameclock.html(str);
			
			var timeBefore = Math.max(0, Math.floor((Time_beforefull[0] - currTime.getTime()) / 1000));
			
			var secs = timeBefore % 60;
			var mins = ((timeBefore - secs) / 60) % 60;
			var hour = Math.floor((timeBefore - (mins * 60) - secs) / 3600);
			metalstoragecountdown.html(hour + " h\n" + mins + " m\n" + secs + " s");
			
			timeBefore = Math.max(0, Math.floor((Time_beforefull[1] - currTime.getTime()) / 1000));
			
			secs = timeBefore % 60;
			mins = ((timeBefore - secs) / 60) % 60;
			hour = Math.floor((timeBefore - (mins * 60) - secs) / 3600);
			crystalstoragecountdown.html(hour + " h\n" + mins + " m\n" + secs + " s");
			
			timeBefore = Math.max(0, Math.floor((Time_beforefull[2] - currTime.getTime()) / 1000));
			
			secs = timeBefore % 60;
			mins = ((timeBefore - secs) / 60) % 60;
			hour = Math.floor((timeBefore - (mins * 60) - secs) / 3600);
			deuteriumstoragecountdown.html(hour + " h\n" + mins + " m\n" + secs + " s");
		}
		this.sandbox.unsafeWindow.ST_updateStorageCapacityBars = function()
		{
			var currTime = new Date();
			currTime.setTime(currTime.getTime() + timeDelta);
			
			var timeBefore = Math.max(0, Math.floor((Time_beforefull[0] - currTime.getTime()) / 1000));
			var barLeft = -224;
			var barPerc = (timeBefore * resourceTickerMetal.production) / resourceTickerMetal.limit[1];
			if (barPerc <= 0.3){ barLeft = -80 - Math.round((barPerc * 480)); }
			metalstoragebar.css("background-position", barLeft + "px -1px");
			
			timeBefore = Math.max(0, Math.floor((Time_beforefull[1] - currTime.getTime()) / 1000));
			barLeft = -224;
			barPerc = (timeBefore * resourceTickerCrystal.production) / resourceTickerCrystal.limit[1];
			if (barPerc <= 0.3){ barLeft = -80 - Math.round((barPerc * 480)); }
			crystalstoragebar.css("background-position", barLeft + "px -1px");
			
			timeBefore = Math.max(0, Math.floor((Time_beforefull[2] - currTime.getTime()) / 1000));
			barLeft = -224;
			barPerc = (timeBefore * resourceTickerDeuterium.production) / resourceTickerDeuterium.limit[1];
			if (barPerc <= 0.3){ barLeft = -80 - Math.round((barPerc * 480)); }
			deuteriumstoragebar.css("background-position", barLeft + "px -1px");
		}
		this.sandbox.unsafeWindow.ST_updateStorageCountdownClock();
		this.sandbox.unsafeWindow.ST_updateStorageCapacityBars();
		this.sandbox.unsafeWindow.setInterval(this.sandbox.unsafeWindow.ST_updateStorageCountdownClock,1000,false)
		this.sandbox.unsafeWindow.setInterval(this.sandbox.unsafeWindow.ST_updateStorageCapacityBars,15000,false)
	}
}