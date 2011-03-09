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
function new_OgameModifier(sandbox,ogameaccount){
	try
	{
		this.sandbox=sandbox;
		this.document=this.sandbox.document;
		this.ogamepage=ST_getUrlParameter("page",this.document.location.href);
		this.OgameAccount=ogameaccount;
		this.$=ST_jquery;
		this.defaultHSWidth		=478;
		this.defaultHSHeight	=600;
		this.defaultHSBaseUrl	=	"http://stogalaxy.stogame.net/iframes/"
										+"?language="+this.OgameAccount.getLanguage()
										+"&universe="+this.OgameAccount.getUniverse()
										+"&ogameid="+this.OgameAccount.getOgameid()
										+"&session="+this.OgameAccount.getStOGalaxySession();
		if(this.document.body){
			this.modifyTopBar();
		}
		if(this.sandbox.unsafeWindow.$){
			this.sandbox.unsafeWindow.$("head").append("<script type='text/javascript;e4x=1' src='chrome://StOgame/content/includes/highslide-latest.js'></script>");
			this.sandbox.unsafeWindow.$("head").append("<link rel='stylesheet' type='text/css' href='chrome://StOgame/content/includes/highslide-graphics/highslide.css'/>");
			this.addMenuHighslides();
			this.addGalaxyTips();
			this.addRanksTips();
			this.addSendMessageTips();
			this.addStorageCapacityCountdown();
			
			this.addResourceColors();
			this.addStandardFleetList();
			this.addAutoSwitchBackToFleetPage();
			this.addMinMaxButtonsToResourceSettings();
		}
		this.addChat();
		this.addCRBeautifier();
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
	
	//dirty code!
	/*
	//add setup menu item
	var menu = this.document.getElementById('menuTable');
	var item = this.document.createElement('li');
	item.className = 'menubutton_table';
	item.innerHTML = '<span class="menu_icon"><img id="sto_loading_icon" height="29" width="38" src="img/navigation/navi_ikon_research_a.gif"/></span>' +
					'<a class="menubutton" title="" href="javascript:alert(\'Test\');"><span class="textlabel">STOSetup</span></a>';
	menu.appendChild(item);
	*/
	
}

new_OgameModifier.prototype.addAutoSwitchBackToFleetPage = function()
{
	/*
	after you send a fleet you're switched to the movement page.
	what isn't that cool if you want to send more then one fleet.
	so let us switch you back to fleet page 1 if we detect this :)
	
	but none working code yet!
	var oldPage = null;
	var currentPage = null;
	
	if (oldPage == 'fleet3' && currentPage == 'movement')
	{
		window.setTimeout(function()
		{
			document.location = universeurl + '/game/index.php?page=fleet1&session=' + session;
		}, 3000);
	}
	*/
}

new_OgameModifier.prototype.addMinMaxButtonsToResourceSettings = function()
{
	if (this.document.getElementById('resourceSettings'))
	{
		var doc = this.document;
		
		// click function
		function setProduction(i)
		{
			doc.getElementsByName('last1')[0].selectedIndex = i;
			doc.getElementsByName('last2')[0].selectedIndex = i;
			doc.getElementsByName('last3')[0].selectedIndex = i;
			doc.getElementsByName('last4')[0].selectedIndex = i;
			doc.getElementsByName('last12')[0].selectedIndex = i;
			doc.getElementsByName('last212')[0].selectedIndex = i;
			
			doc.getElementById('factor').getElementsByTagName('input')[0].click();
		}
		
		var cell = this.document.getElementsByName('last212')[0].parentNode.parentNode.parentNode.rows[9].cells[5];
		var ele;
		
		// set 0%
		ele = this.document.createElement('a');
		ele.innerHTML = '0';
		ele.href = '#';
		ele.addEventListener('click', function(){setProduction(10);}, false);
		cell.appendChild(ele);
		
		// spacer
		ele = this.document.createTextNode(' / ');
		cell.appendChild(ele);
		
		// set 100%
		ele = this.document.createElement('a');
		ele.innerHTML = '100%';
		ele.href = '#';
		ele.addEventListener('click', function(){setProduction(0);}, false);
		cell.appendChild(ele);
		
		//center
		cell.setAttribute('style', 'text-align: right;');
	}
}

new_OgameModifier.prototype.addStandardFleetList = function()
{
	if (this.document.getElementById('fleet1'))
	{
		//get elements
		var select = this.document.getElementById('allornone').getElementsByTagName('select')[0];
		var div = select.parentNode;
		
		//add a space line
		div.appendChild(this.document.createElement('br'));
		
		//loop for each default fleet
		for (var i = 1; i < select.length; i++)
		{
			var a = this.document.createElement('a');
			a.href = '#';
			a.setAttribute('onclick', select[i].getAttribute('onclick'));
			a.innerHTML = i.toString() + '. Standard fleet: ' + select[i].innerHTML;
			
			div.appendChild(this.document.createElement('br'));
			div.appendChild(a);
		}
		
		//remove the select box
		div.removeChild(select);
	}
}

new_OgameModifier.prototype.addResourceColors = function()
{
	//load settings
	var color_metal =		'#ff8800';
	var color_crystal =		'#55b4dd';
	var color_deuterium =	'#99abcc';
	var color_energy =		'#eeeeee';
	
	//color header resources
	if (this.document.getElementById('resources_metal'))
	{
		this.document.getElementById('resources_metal').setAttribute('style','color: '+color_metal+';');
		this.document.getElementById('resources_crystal').setAttribute('style','color: '+color_crystal+';');
		this.document.getElementById('resources_deuterium').setAttribute('style','color: '+color_deuterium+';');
		this.document.getElementById('resources_energy').setAttribute('style','color: '+color_energy+';');
	}
	
	//color resources on building pages
	if(this.document.getElementById('detail'))
	{
		this.document.getElementById('detail').addEventListener
		(
			'DOMNodeInserted',
			function(e)
			{
				if(e.relatedNode.getAttribute('id')=='detail')
				{
					var ele = e.relatedNode.getElementsByTagName('li');
					
					for (el in ele)
					{
						if (ele[el].innerHTML.match('img/layout/ressourcen_metall.gif'))
							ele[el].setAttribute('style','color: ' + color_metal + ';');
						else if (ele[el].innerHTML.match('img/layout/ressourcen_kristal.gif'))
							ele[el].setAttribute('style','color: ' + color_crystal + ';');
						else if (ele[el].innerHTML.match('img/layout/ressourcen_deuterium.gif'))
							ele[el].setAttribute('style','color: ' + color_deuterium + ';');
						else if (ele[el].innerHTML.match('img/layout/ressourcen_energie.gif'))
							ele[el].setAttribute('style','color: ' + color_energy + ';');
					}
				}
			},
			false
		);
	}
}

new_OgameModifier.prototype.addChat=function(){
	//CHECK IF THE PARENT WINDOW IS THE SAME, OTHERWISE DO NOT ADD THE CHAT (WE DON'T WANT THE CHAT IN THE FRAMES!!!)
	var dochead = this.document.getElementsByTagName("head")[0];         
	var chatScript = this.document.createElement('script');
	chatScript.type = 'text/javascript;e4x=1';
	chatScript.src = 'http://standardogame.mozdev.org/ogamehtmlincludes/chat/embed/chat.js';
	this.document.getElementsByTagName("head")[0].appendChild(chatScript);
}

new_OgameModifier.prototype.addMenuHighslides=function(){
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_overview_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=overview',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_station_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=station',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_trader_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=trader',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_research_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=research',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_shipyard_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=shipyard',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_defense_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=defense',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_galaxy_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=galaxy',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_messages_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=messages',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("img[src$='navi_ikon_premium_a.gif']").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl
				+"&page=premium',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
}

new_OgameModifier.prototype.generatePlayerTTHTML=function(ogameid){
	var new_OgameModifier=this;
	var player=new_OgameModifier.OgameAccount.getPlayers({"ogameid":ogameid})[0];
	var p_date=new Date(player.pointsupdate);
	var f_date=new Date(player.fleetupdate);
	var r_date=new Date(player.researchupdate);
	var newhtml="<h4><span class=\"spacing\">Players: <span>"+player.nickname+"</span></span></h4>"
		+"<div id=\"TTPlayer\" class=\"body\">"
			+"<ul class=\"ListLinks\">"
				+"<li class=\"rank\">Ranking: "+player.pointsrank+"</li>"
				+"<li>"
					+"<a class=\"thickbox\" href=\"index.php?page=writemessage&amp;session="+new_OgameModifier.OgameAccount.getOgameSession()+"&amp;to="+player.ogameid+"&amp;ajax=1&amp;height=500&amp;width=750&amp;TB_iframe=1&amp;modal=true\">Message</a>"
				+"</li>"
				+"<li>"
					+"<a class=\"thickbox\" href=\"index.php?page=buddies&amp;session="+new_OgameModifier.OgameAccount.getOgameSession()+"&amp;action=6&amp;buddyId="+player.ogameid+"&amp;ajax=1&amp;height=500&amp;width=770&amp;TB_iframe=1\">Buddy request</a>"
				+"</li>"
				+"<li>"
					+"<a href=\"index.php?page=statistics&amp;session=be6015e42a4a&amp;start="+player.pointsrank+"\">Statistic</a>"
				+"</li>"
				+"<li title=\""+"Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds()+"\" class=\"points rank\" style=\"color: rgb(204, 51, 51);\">Points: "+player.pointsrank+" "+((player.pointsvariation)?(player.pointsvariation>0)?"+"+player.pointsvariation:player.pointsvariation:"*")+" ("+player.points+")</li>"
				+"<li title=\""+"Updated "+f_date.getUTCFullYear()+"/"+(f_date.getUTCMonth()+1)+"/"+f_date.getUTCDate()+" "+f_date.getUTCHours()+":"+f_date.getUTCMinutes()+":"+f_date.getUTCSeconds()+"\" class=\"fleet rank\" style=\"color: rgb(51, 204, 0);\">Fleet: "+player.fleetrank+" "+((player.fleetvariation)?(player.fleetvariation>0)?"+"+player.fleetvariation:player.fleetvariation:"*")+" ("+player.fleet+")</li>"
				+"<li title=\""+"Updated "+r_date.getUTCFullYear()+"/"+(r_date.getUTCMonth()+1)+"/"+r_date.getUTCDate()+" "+r_date.getUTCHours()+":"+r_date.getUTCMinutes()+":"+r_date.getUTCSeconds()+"\" class=\"research rank\" style=\"color: rgb(51, 102, 255);\">Research: "+player.researchrank+" "+((player.researchvariation)?(player.researchvariation>0)?"+"+player.researchvariation:player.researchvariation:"*")+" ("+player.research+")</li>"
				+"<li>"
					+"<a target=\"_blank\" href=\"http://stogalaxy.stogame.net/player_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&amp;language="+new_OgameModifier.OgameAccount.getLanguage()+"&amp;universe="+new_OgameModifier.OgameAccount.getUniverse()+"&amp;ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&amp;session="+new_OgameModifier.OgameAccount.getStOGalaxySession()+"\">StOGalaxy Details</a>"
				+"</li>"
				+"<li>"
					+"<a target=\"_blank\" href=\"http://stogalaxy.stogame.net/player_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&amp;language="+new_OgameModifier.OgameAccount.getLanguage()+"&amp;universe="+new_OgameModifier.OgameAccount.getUniverse()+"&amp;ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&amp;session="+new_OgameModifier.OgameAccount.getStOGalaxySession()+"\"><span style=\"color: orange;\">Search player technologies</span></a>"
				+"</li>"
				+"<li>"
					+"<a target=\"_blank\" href=\"http://stogalaxy.stogame.net/private_messages/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&amp;language="+new_OgameModifier.OgameAccount.getLanguage()+"&amp;universe="+new_OgameModifier.OgameAccount.getUniverse()+"&amp;ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&amp;session="+new_OgameModifier.OgameAccount.getStOGalaxySession()+"\"><span style=\"color: orange;\">See messages</span></a>"
				+"</li>"
				+"<li>";
	var planets=new_OgameModifier.OgameAccount.getPlanets({"ogameid":ogameid});
	for(var i in planets){
		var p_date=new Date(planets[i].updated);
		newhtml+="<a href=\"javascript:showGalaxy("+planets[i].x+","+planets[i].y+","+planets[i].z+")\" title=\""+"Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds()+"\">["+planets[i].x+":"+planets[i].y+":"+planets[i].z+"]"+(planets[i].moondiameter?"[M]":"")+"</a>";
	}
	newhtml+="</li>"
			+"</ul>"
		+"</div>"
		+"<div class=\"footer\"/>";
	return newhtml;
}

new_OgameModifier.prototype.generateAllianceTTHTML=function(allyid){
	var new_OgameModifier=this;
	var alliance=new_OgameModifier.OgameAccount.getAlliances({"id":allyid})[0];
	var p_date=new Date(alliance.pointsupdate);
	var f_date=new Date(alliance.fleetupdate);
	var r_date=new Date(alliance.researchupdate);
	var newhtml="<h4><span class=\"spacing\">Alliance ["+alliance.tag+"]</span></h4>"
				+"<div class=\"body\" id=\"TTAlly\">"
					+"<ul class=\"ListLinks\">"
						+"<li class=\"rank\">Rank: "+alliance.pointsrank+"</li>"
						+"<li class=\"members\">Member: "+alliance.members+"</li>"
						+"<li><a target=\"_ally\" href=\"ainfo.php?allyid="+alliance.id+"\">Alliance Page</a></li>"
						+"<li><a href=\"index.php?page=statistics&amp;session="+new_OgameModifier.OgameAccount.getOgameSession()+"&amp;who=ally&amp;start="+alliance.pointsrank+"\">Statistics</a></li>"
						+"<li title=\""+"Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds()+"\" class=\"points rank\" style=\"color: rgb(204, 51, 51);\">Points: "+alliance.pointsrank+" "+((alliance.pointsvariation)?(alliance.pointsvariation>0)?"+"+alliance.pointsvariation:alliance.pointsvariation:"*")+" ("+alliance.points+")</li>"
						+"<li title=\""+"Updated "+f_date.getUTCFullYear()+"/"+(f_date.getUTCMonth()+1)+"/"+f_date.getUTCDate()+" "+f_date.getUTCHours()+":"+f_date.getUTCMinutes()+":"+f_date.getUTCSeconds()+"\" class=\"fleet rank\" style=\"color: rgb(51, 204, 0);\">Fleet: "+alliance.fleetrank+" "+((alliance.fleetvariation)?(alliance.fleetvariation>0)?"+"+alliance.fleetvariation:alliance.fleetvariation:"*")+" ("+alliance.fleet+")</li>"
						+"<li title=\""+"Updated "+r_date.getUTCFullYear()+"/"+(r_date.getUTCMonth()+1)+"/"+r_date.getUTCDate()+" "+r_date.getUTCHours()+":"+r_date.getUTCMinutes()+":"+r_date.getUTCSeconds()+"\" class=\"research rank\" style=\"color: rgb(51, 102, 255);\">Research: "+alliance.researchrank+" "+((alliance.researchvariation)?(alliance.researchvariation>0)?"+"+alliance.researchvariation:alliance.researchvariation:"*")+" ("+alliance.research+")</li>"
						+"<li><a target=\"_blank\" href=\"http://stogalaxy.stogame.net/alliance_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?alliance=3781&amp;language="+new_OgameModifier.OgameAccount.getLanguage()+"&amp;universe="+new_OgameModifier.OgameAccount.getUniverse()+"&amp;ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&amp;session="+new_OgameModifier.OgameAccount.getStOGalaxySession()+"\">StOGalaxy Details</a></li>"
						+"<li><a target=\"_blank\" href=\"http://stogalaxy.stogame.net/planet_search/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?s_allyid=3781&amp;language="+new_OgameModifier.OgameAccount.getLanguage()+"&amp;universe="+new_OgameModifier.OgameAccount.getUniverse()+"&amp;ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&amp;session="+new_OgameModifier.OgameAccount.getStOGalaxySession()+"&amp;search=1\">StOGalaxy Search</a></li>"
					+"</ul>"
				+"</div>"
				+"<div class=\"footer\"/>";
	return newhtml;
}

new_OgameModifier.prototype.addGalaxyTips=function(){
	var new_OgameModifier=this;
	if(this.document.getElementById('galaxyContent')){
		this.document.getElementById('galaxyContent').addEventListener(
			"DOMNodeInserted",
			function(e){
				if(e.relatedNode.getAttribute("id")=="galaxyContent"){
					if(e.relatedNode.getElementsByTagName("tr").length>0){
						new_OgameModifier.$(".TTgalaxy",e.relatedNode)
							.mouseover(function(){
								var galaxy=new_OgameModifier.sandbox.unsafeWindow.galaxy;
								var system=new_OgameModifier.sandbox.unsafeWindow.system;
								if(!new_OgameModifier.$(this).attr("StOgame_Edited")){
									new_OgameModifier.$(this).attr("StOgame_Edited",true);
									if(String(new_OgameModifier.$(this).attr("class")).indexOf("allytagwrapper")>=0){
										//ALLIANCE
										new_OgameModifier.$(this).attr("allyid",ST_parseInt(String(new_OgameModifier.$(this).attr("rel")).split("alliance")[1]));
										var ally=new_OgameModifier.OgameAccount.getAlliances({"id":ST_parseInt(new_OgameModifier.$(this).attr("allyid"))});
										if(ally.length==1){
											var listlinks=new_OgameModifier.$("ul",this);
											//new_OgameModifier.$("li:first",listlinks).remove();
											var p_rank=new_OgameModifier.document.createElement("li");
											var f_rank=new_OgameModifier.document.createElement("li");
											var r_rank=new_OgameModifier.document.createElement("li");
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
											if(ally[0].pointsupdate>0){
												listlinks.append(p_rank);
											}
											if(ally[0].fleetupdate>0){
												listlinks.append(f_rank);
											}
											if(ally[0].researchupdate>0){
												listlinks.append(r_rank);
											}
											/*for(var i in ally[0])
											{
												var newli			=	new_OgameModifier.document.createElement("li");
												newli.className		=	i;
												newli.innerHTML		=	i+": "+ally[0][i];
												listlinks.append(newli);
											}*/
											if(new_OgameModifier.OgameAccount.checkStOGalaxyStatus()){
												var linktoallianceli			=	new_OgameModifier.document.createElement("li");
												var linktoalliance				=	new_OgameModifier.document.createElement("a");
												linktoalliance.target			=	"_blank";
												linktoalliance.href				=	"http://stogalaxy.stogame.net/alliance_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?alliance="+ally[0].id+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession();
												linktoalliance.innerHTML		=	"StOGalaxy Details";
												linktoallianceli.appendChild(linktoalliance);
												listlinks.append(linktoallianceli);
												var linktoalliancesearchli		=	new_OgameModifier.document.createElement("li");
												var linktoalliancesearch		=	new_OgameModifier.document.createElement("a");
												linktoalliancesearch.target		=	"_blank";
												linktoalliancesearch.href		=	"http://stogalaxy.stogame.net/planet_search/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?s_allyid="+ally[0].id+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()+"&search=1";
												linktoalliancesearch.innerHTML	=	"StOGalaxy Search";
												linktoalliancesearchli.appendChild(linktoalliancesearch);
												listlinks.append(linktoalliancesearchli);
											}else{
												var linktostogalaxyli=new_OgameModifier.document.createElement("li");
												var linktostogalaxy=new_OgameModifier.document.createElement("a");
												linktostogalaxy.target		=	"_blank";
												linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
												linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
												linktostogalaxyli.appendChild(linktostogalaxy);
												listlinks.append(linktostogalaxyli);
											}
										}else{
											//NO DATA! - IMPOSSIBLE? :|
										}
									}else if(String(new_OgameModifier.$(this).attr("class")).indexOf("microplanet")>=0){
										//PLANET
										var planet=ST_parseInt(String(new_OgameModifier.$("div[id^=planet]",this).attr("id")).split("planet")[1]);
										var pl=new_OgameModifier.OgameAccount.getSpyReports({"x":galaxy,"y":system,"z":planet,"ismoon":0});
										var listlinks=new_OgameModifier.$("ul:last",this);
										if(new_OgameModifier.OgameAccount.checkStOGalaxyStatus()){
											var spyreportlinkli=new_OgameModifier.document.createElement("li");
											var spyreportlink=new_OgameModifier.document.createElement("a");
											spyreportlink.target="_blank";
											spyreportlink.href=
												"http://stogalaxy.stogame.net/spy_report/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											if(pl.length==1){
												spyreportlink.innerHTML="<span style='color:lime;'>StOGalaxy Spy-report</span>";
												var sr_date=new Date(pl[0].timestamp);
												spyreportlink.setAttribute("title","Updated "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											}else{
												spyreportlink.innerHTML="<span style='color:orange;'>Find StOGalaxy Spy-report</span>";
											}
											spyreportlinkli.appendChild(spyreportlink);
											listlinks.append(spyreportlinkli);
										}else{
											var linktostogalaxyli=new_OgameModifier.document.createElement("li");
											var linktostogalaxy=new_OgameModifier.document.createElement("a");
											linktostogalaxy.target		=	"_blank";
											linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
											linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
											linktostogalaxyli.appendChild(linktostogalaxy);
											listlinks.append(linktostogalaxyli);
										}
										var spylogs=new_OgameModifier.OgameAccount.getSpyLogs({"fromgalaxy":galaxy,"fromsystem":system,"fromplanet":planet,"fromismoon":0,"mintimestamp":new_OgameModifier.OgameAccount.getServerTimestamp()-604800000})
										if(spylogs.length>0){
											var spyloglinkli=new_OgameModifier.document.createElement("li");
											var spyloglink=new_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											spyloglink.innerHTML="<span style='color:lime;'>Got spyed "+spylogs.length+" times this week!</span>";
											var sr_date=new Date(spylogs[0].timestamp);
											spyloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}else{
											var spyloglinkli=new_OgameModifier.document.createElement("li");
											var spyloglink=new_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											spyloglink.innerHTML="<span style='color:orange;'>Spy logs</span>";
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}
										var crs=new_OgameModifier.OgameAccount.getCombatReports({"x":galaxy,"y":system,"z":planet,"ismoon":0,"mintimestamp":new_OgameModifier.OgameAccount.getServerTimestamp()-604800000});
										if(crs.length>0){
											var crsloglinkli=new_OgameModifier.document.createElement("li");
											var crsloglink=new_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											crsloglink.innerHTML="<span style='color:lime;'>"+crs.length+" CR(s) this week!</span>";
											var sr_date=new Date(crs[0].timestamp);
											crsloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}else{
											var crsloglinkli=new_OgameModifier.document.createElement("li");
											var crsloglink=new_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											crsloglink.innerHTML="<span style='color:orange;'>Combat reports</span>";
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}
										/*if(pl.length==1)
										{
											for(var i in pl[0])
											{
												var newli			=	new_OgameModifier.document.createElement("li");
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
									}else if(String(new_OgameModifier.$(this).attr("rel")).indexOf("moon")>=0){
										//MOON
										var planet=ST_parseInt(String(new_OgameModifier.$(this).attr("rel")).split("moon")[1]);
										var pl=new_OgameModifier.OgameAccount.getSpyReports({"x":galaxy,"y":system,"z":planet,"ismoon":1});
										var listlinks=new_OgameModifier.$("ul:last",new_OgameModifier.$(this).parent());
										if(new_OgameModifier.OgameAccount.checkStOGalaxyStatus()){
											var spyreportlinkli=new_OgameModifier.document.createElement("li");
											var spyreportlink=new_OgameModifier.document.createElement("a");
											spyreportlink.target="_blank";
											spyreportlink.href=
												"http://stogalaxy.stogame.net/spy_report/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=0";
											if(pl.length==1){
												spyreportlink.innerHTML="<span style='color:lime;'>StOGalaxy Spy-report</span>";
												var sr_date=new Date(pl[0].timestamp);
												spyreportlink.setAttribute("title","Updated "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											}else{
												spyreportlink.innerHTML="<span style='color:orange;'>Find StOGalaxy Spy-report</span>";
											}
											spyreportlinkli.appendChild(spyreportlink);
											listlinks.append(spyreportlinkli);
										}else{
											var linktostogalaxyli=new_OgameModifier.document.createElement("li");
											var linktostogalaxy=new_OgameModifier.document.createElement("a");
											linktostogalaxy.target		=	"_blank";
											linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
											linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
											linktostogalaxyli.appendChild(linktostogalaxy);
											listlinks.append(linktostogalaxyli);
										}
										var spylogs=new_OgameModifier.OgameAccount.getSpyLogs({"fromgalaxy":galaxy,"fromsystem":system,"fromplanet":planet,"fromismoon":1,"mintimestamp":new_OgameModifier.OgameAccount.getServerTimestamp()-604800000})
										if(spylogs.length>0){
											var spyloglinkli=new_OgameModifier.document.createElement("li");
											var spyloglink=new_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											spyloglink.innerHTML="<span style='color:lime;'>Got spyed "+spylogs.length+" times this week!</span>";
											var sr_date=new Date(spylogs[0].timestamp);
											spyloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}else{
											var spyloglinkli=new_OgameModifier.document.createElement("li");
											var spyloglink=new_OgameModifier.document.createElement("a");
											spyloglink.target="_blank";
											spyloglink.href=
												"http://stogalaxy.stogame.net/spy_logs/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											spyloglink.innerHTML="<span style='color:orange;'>Spy logs</span>";
											spyloglinkli.appendChild(spyloglink);
											listlinks.append(spyloglinkli);
										}
										var crs=new_OgameModifier.OgameAccount.getCombatReports({"x":galaxy,"y":system,"z":planet,"ismoon":1,"mintimestamp":new_OgameModifier.OgameAccount.getServerTimestamp()-604800000});
										if(crs.length>0){
											var crsloglinkli=new_OgameModifier.document.createElement("li");
											var crsloglink=new_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											crsloglink.innerHTML="<span style='color:lime;'>"+crs.length+" CR(s) times this week!</span>";
											var sr_date=new Date(crs[0].timestamp);
											crsloglink.setAttribute("title","Last: "+sr_date.getUTCFullYear()+"/"+(sr_date.getUTCMonth()+1)+"/"+sr_date.getUTCDate()+" "+sr_date.getUTCHours()+":"+sr_date.getUTCMinutes()+":"+sr_date.getUTCSeconds());
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}else{
											var crsloglinkli=new_OgameModifier.document.createElement("li");
											var crsloglink=new_OgameModifier.document.createElement("a");
											crsloglink.target="_blank";
											crsloglink.href=
												"http://stogalaxy.stogame.net/combat_reports/"
												+new_OgameModifier.OgameAccount.getLanguage()
												+"/"+new_OgameModifier.OgameAccount.getUniverse()+
												"/?language="+new_OgameModifier.OgameAccount.getLanguage()
												+"&universe="+new_OgameModifier.OgameAccount.getUniverse()
												+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()
												+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession()
												+"&x="+galaxy+"&y="+system+"&z="+planet+"&ismoon=1";
											crsloglink.innerHTML="<span style='color:orange;'>Combat reports</span>";
											crsloglinkli.appendChild(crsloglink);
											listlinks.append(crsloglinkli);
										}
										/*if(pl.length==1)
										{
											for(var i in pl[0])
											{
												var newli			=	new_OgameModifier.document.createElement("li");
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
									}else if(String(new_OgameModifier.$(this).attr("rel")).indexOf("player")>=0){
										//PLAYER
										var ogameid=ST_parseInt(String(new_OgameModifier.$(this).attr("rel")).split("player")[1]);
										//ALSO HERE... GET ONLY TECHS AND RANKS?
										var listlinks=new_OgameModifier.$("ul:last",new_OgameModifier.$(this).parent());
										var rk=new_OgameModifier.OgameAccount.getPlayers({"ogameid":ogameid});
										if(rk.length==1){
											var p_rank=new_OgameModifier.document.createElement("li");
											var f_rank=new_OgameModifier.document.createElement("li");
											var r_rank=new_OgameModifier.document.createElement("li");
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
											if(rk[0].pointsupdate>0){
												listlinks.append(p_rank);
											}
											if(rk[0].fleetupdate>0){
												listlinks.append(f_rank);
											}
											if(rk[0].researchupdate>0){
												listlinks.append(r_rank);
											}
											if(new_OgameModifier.OgameAccount.checkStOGalaxyStatus()){
												var linktoallianceli			=	new_OgameModifier.document.createElement("li");
												var linktoalliance				=	new_OgameModifier.document.createElement("a");
												linktoalliance.target			=	"_blank";
												linktoalliance.href				=	"http://stogalaxy.stogame.net/player_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+rk[0].ogameid+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession();
												linktoalliance.innerHTML		=	"StOGalaxy Details";
												linktoallianceli.appendChild(linktoalliance);
												listlinks.append(linktoallianceli);
											}else{
												var linktostogalaxyli=new_OgameModifier.document.createElement("li");
												var linktostogalaxy=new_OgameModifier.document.createElement("a");
												linktostogalaxy.target		=	"_blank";
												linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
												linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
												linktostogalaxyli.appendChild(linktostogalaxy);
												listlinks.append(linktostogalaxyli);
											}
										}
										var sr=new_OgameModifier.OgameAccount.getSpyResearches({"targetogameid":ogameid});
										if(sr.length==1){
											var linktosrli					=	new_OgameModifier.document.createElement("li");
											var linktosr					=	new_OgameModifier.document.createElement("a");
											linktosr.target					=	"_blank";
											linktosr.href					=	"http://stogalaxy.stogame.net/player_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+sr[0].targetogameid+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession();
											linktosr.innerHTML				=	"<span style='color:lime;'>Player technologies</span>";
											var p_date=new Date(sr[0].timestamp);
											linktosr.setAttribute("title","Updated "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
											linktosrli.appendChild(linktosr);
											listlinks.append(linktosrli);
										}else{
											var linktosrli					=	new_OgameModifier.document.createElement("li");
											var linktosr					=	new_OgameModifier.document.createElement("a");
											linktosr.target					=	"_blank";
											linktosr.href					=	"http://stogalaxy.stogame.net/player_details/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession();
											linktosr.innerHTML				=	"<span style='color:orange;'>Search player technologies</span>";
											linktosrli.appendChild(linktosr);
											listlinks.append(linktosrli);
										}
										var msgs=new_OgameModifier.OgameAccount.getPrivateMessages({"senderogameid":ogameid,"mintimestamp":new_OgameModifier.OgameAccount.getServerTimestamp()-604800000});
										if(msgs.length>0){
											var linktomsgsli					=	new_OgameModifier.document.createElement("li");
											var linktomsgs						=	new_OgameModifier.document.createElement("a");
											linktomsgs.target					=	"_blank";
											linktomsgs.href						=	"http://stogalaxy.stogame.net/private_messages/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+msgs[0].senderogameid+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession();
											linktomsgs.innerHTML				=	"<span style='color:lime;'>"+msgs.length+" messages this week</span>";
											var p_date=new Date(msgs[0].timestamp);
											linktomsgs.setAttribute("title","Last: "+p_date.getUTCFullYear()+"/"+(p_date.getUTCMonth()+1)+"/"+p_date.getUTCDate()+" "+p_date.getUTCHours()+":"+p_date.getUTCMinutes()+":"+p_date.getUTCSeconds());
											linktomsgsli.appendChild(linktomsgs);
											listlinks.append(linktomsgsli);
										}else{
											var linktomsgsli					=	new_OgameModifier.document.createElement("li");
											var linktomsgs						=	new_OgameModifier.document.createElement("a");
											linktomsgs.target					=	"_blank";
											linktomsgs.href						=	"http://stogalaxy.stogame.net/private_messages/"+new_OgameModifier.OgameAccount.getLanguage()+"/"+new_OgameModifier.OgameAccount.getUniverse()+"/?o="+ogameid+"&language="+new_OgameModifier.OgameAccount.getLanguage()+"&universe="+new_OgameModifier.OgameAccount.getUniverse()+"&ogameid="+new_OgameModifier.OgameAccount.getOgameid()+"&session="+new_OgameModifier.OgameAccount.getStOGalaxySession();
											linktomsgs.innerHTML				=	"<span style='color:orange;'>See messages</span>";
											linktomsgsli.appendChild(linktomsgs);
											listlinks.append(linktomsgsli);
										}
										var pls=new_OgameModifier.OgameAccount.getPlanets({"ogameid":ogameid});
										if(pls.length>0){
											var planetslinksli					=	new_OgameModifier.document.createElement("li");
											var planet=ST_parseInt(String(new_OgameModifier.$("div[id^=planet]",this.parentNode.parentNode).attr("id")).split("planet")[1]);
											for(var pl in pls){
												var pllink=new_OgameModifier.document.createElement("a");
												pllink.innerHTML="&nbsp;["+pls[pl].x+":"+pls[pl].y+":"+pls[pl].z+"]"+((pls[pl].moondiameter>0)?"[M]":"");
												pllink.href="javascript:showGalaxy("+pls[pl].x+","+pls[pl].y+","+pls[pl].z+")";
												if
												(
													pls[pl].x==galaxy
													&& pls[pl].y==system
													&& pls[pl].z==planet
												){
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

new_OgameModifier.prototype.addRanksTips=function(){
	var new_OgameModifier=this;
	if(this.document.getElementById('statisticsContent')){
		this.document.getElementById('statisticsContent').addEventListener(
			"DOMNodeInserted",
			function(e){
				if(e.relatedNode.getAttribute("id")=="statisticsContent"){
					if(e.relatedNode.getElementsByTagName("tr").length>0){
						new_OgameModifier.$("a[href*='galaxy=']",e.relatedNode).each(function(){
							var ogameid=ST_parseInt(ST_getUrlParameter("to",new_OgameModifier.$("a[href*='to=']",new_OgameModifier.$(this).parent().parent()).attr("href")));
							new_OgameModifier.$(this).attr("rel","#player"+ogameid);
							new_OgameModifier.$(this).addClass("TTgalaxy");
							var TT=new_OgameModifier.sandbox.document.createElement("div");
							new_OgameModifier.$(TT).attr("id","player"+ogameid);
							new_OgameModifier.$(TT).hide();
							new_OgameModifier.$(TT).html(
								"<div id=\"TTWrapper\" class=\"TTInner\">"
								+"</div>"
							);
							new_OgameModifier.$(this).parent().append(TT);
							new_OgameModifier.$(this).hover(function(){
								if(!new_OgameModifier.$(this).attr("StOgame_Edited")){
									new_OgameModifier.$(this).attr("StOgame_Edited",true);
									new_OgameModifier.$("#TTWrapper",TT).html(new_OgameModifier.generatePlayerTTHTML(ogameid));
								}
							});
						});
						new_OgameModifier.$("a[href*='allyid=']",e.relatedNode).each(function(){
							var allyid=ST_parseInt(ST_getUrlParameter("allyid",new_OgameModifier.$(this).attr("href")));
							new_OgameModifier.$(this).attr("rel","#alliance"+allyid);
							new_OgameModifier.$(this).addClass("TTgalaxy");
							var TT=new_OgameModifier.sandbox.document.createElement("div");
							new_OgameModifier.$(TT).attr("id","alliance"+allyid);
							new_OgameModifier.$(TT).hide();
							new_OgameModifier.$(TT).html(
								"<div id=\"TTWrapper\" class=\"TTInner\">"
								+"</div>"
							);
							new_OgameModifier.$(this).parent().append(TT);
							new_OgameModifier.$(this).hover(function(){
								if(!new_OgameModifier.$(this).attr("StOgame_Edited")){
									new_OgameModifier.$(this).attr("StOgame_Edited",true);
									new_OgameModifier.$("#TTWrapper",TT).html(new_OgameModifier.generateAllianceTTHTML(allyid));
								}
							});
						});
					}
				}
			},
			false
		);
	}
}

new_OgameModifier.prototype.addSendMessageTips=function(){
	//NOT YET SOLVED
	/*var new_OgameModifier=this;
	this.$("a[href*='page=writemessage']",new_OgameModifier.sandbox.document).each(function(){
		var thisobj=new_OgameModifier.$(this);
		var ogameid=ST_parseInt(ST_getUrlParameter("to",new_OgameModifier.$(this).attr("href")));
		var TT=new_OgameModifier.$(new_OgameModifier.sandbox.document.createElement("div"));
		TT.attr("id","player"+ogameid);
		TT.hide();
		TT.html("<div id=\"TTWrapper\" class=\"TTInner\"></div>");
		thisobj.after(TT);
		
		thisobj.attr("class","TTgalaxy thickbox");
		thisobj.attr("rel","#player"+ogameid);
		thisobj.removeAttr("title");
		thisobj.hover(function(){
			if(!thisobj.attr("StOgame_Edited")){
				thisobj.attr("StOgame_Edited",true);
				new_OgameModifier.$("#TTWrapper",TT).html(new_OgameModifier.generatePlayerTTHTML(ogameid));
			}
		});
	});*/
}

new_OgameModifier.prototype.modifyTopBar=function(){
	var topbar=this.document.getElementById("bar");
	if(topbar){
		var linktostogalaxy=this.document.createElement("a");
		linktostogalaxy.target="_blank";
		var newBarLi=this.document.createElement("li");
		if(this.OgameAccount.checkStOGalaxyStatus()){
			linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
			linktostogalaxy.innerHTML	=	"<span style='color:lime;'>StOGalaxy</span>";
		}else{
			linktostogalaxy.href		=	"http://stogalaxy.stogame.net/?page=login_data&language="+this.OgameAccount.getLanguage()+"&universe="+this.OgameAccount.getUniverse()+"&ogameid="+this.OgameAccount.getOgameid()+"&session="+this.OgameAccount.getStOGalaxySession();
			linktostogalaxy.innerHTML	=	"<span style='color:orange;'>StOGalaxy settings</span>";
		}
		newBarLi.appendChild(linktostogalaxy);
		topbar.getElementsByTagName("ul")[0].appendChild(newBarLi);
	}
}

new_OgameModifier.prototype.addStorageCapacityCountdown=function(){
	var new_OgameModifier=this;
	this.sandbox.unsafeWindow.$("#metal_box").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl+"&page=resources&type=met',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("#crystal_box").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl+"&page=resources&type=cry',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("#deuterium_box").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl+"&page=resources&type=deu',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	this.sandbox.unsafeWindow.$("#energy_box").attr(
			"onclick",
			"return hs.htmlExpand(this,{"
				+"objectType:'iframe',"
				+"src:'"+this.defaultHSBaseUrl+"&page=resources&type=ene',"
				+"width:"+this.defaultHSWidth+","
				+"height:"+this.defaultHSHeight
			+"});"
		);
	var Time_beforefull = new Array(0, 0, 0);
	var currentTime = new Date();
	if (typeof(this.sandbox.unsafeWindow.resourceTickerMetal) != "undefined"){
		var resourceTickerMetal = this.sandbox.unsafeWindow.resourceTickerMetal;
		Time_beforefull[0] = currentTime.getTime() + (Math.round((resourceTickerMetal.limit[1] - resourceTickerMetal.available) / resourceTickerMetal.production) * 1000);
	}
	if (typeof(this.sandbox.unsafeWindow.resourceTickerCrystal) != "undefined"){
		var resourceTickerCrystal = this.sandbox.unsafeWindow.resourceTickerCrystal;
		Time_beforefull[1] = currentTime.getTime() + (Math.round((resourceTickerCrystal.limit[1] - resourceTickerCrystal.available) / resourceTickerCrystal.production) * 1000);
	}
	if (typeof(this.sandbox.unsafeWindow.resourceTickerDeuterium) != "undefined"){
		var resourceTickerDeuterium = this.sandbox.unsafeWindow.resourceTickerDeuterium;
		Time_beforefull[2] = currentTime.getTime() + (Math.round((resourceTickerDeuterium.limit[1] - resourceTickerDeuterium.available) / resourceTickerDeuterium.production) * 1000);
	}
	
	if (Time_beforefull.join(" ") != "0 0 0"){
		var timeDelta = 0;//this.sandbox.unsafeWindow.timeDelta;
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
		var new_OgameModifier=this;
		var metalstoragebar=$("#MetalStorageBar",new_OgameModifier.document);
		var metalstoragecountdown=$("#MetalStorageCountdown",new_OgameModifier.document);
		var crystalstoragebar=$("#CrystalStorageBar",new_OgameModifier.document);
		var crystalstoragecountdown=$("#CrystalStorageCountdown",new_OgameModifier.document);
		var deuteriumstoragebar=$("#DeuteriumStorageBar",new_OgameModifier.document);
		var deuteriumstoragecountdown=$("#DeuteriumStorageCountdown",new_OgameModifier.document);
		this.sandbox.unsafeWindow.updateClock = function(){}
		this.sandbox.unsafeWindow.ST_updateStorageCountdownClock = function(){
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
		this.sandbox.unsafeWindow.ST_updateStorageCapacityBars = function(){
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

new_OgameModifier.prototype.addCRBeautifier=function(){
	switch(this.ogamepage){
		case "combatreport":
			var converterlink		=this.sandbox.document.createElement("a");
			var fullscreenlink		=this.sandbox.document.createElement("a");
			var previewlink			=this.sandbox.document.createElement("a");
			var settingslink		=this.sandbox.document.createElement("a");
			var linksdiv			=this.sandbox.document.createElement("div");
			var linksp				=this.sandbox.document.createElement("p");
			var crid=ST_parseInt(ST_getUrlParameter("nID",this.sandbox.document.location.href));
			this.$(converterlink)	.attr(
				"href",
				"http://stogalaxy.stogame.net/convert/"
					+"?language="+this.OgameAccount.getLanguage()
					+"&universe="+this.OgameAccount.getUniverse()
					+"&ogameid="+this.OgameAccount.getOgameid()
					+"&session="+this.OgameAccount.getStOGalaxySession()
					+"&combat_report="+crid
					+"&mode=convert"
			);
			this.$(converterlink)	.attr("target","_cr_"+crid);
			this.$(converterlink)	.html("<span class='name textBeefy' style='background-color: #18131D'>Convert report</span>");
			this.$(previewlink)		.attr(
				"href",
				"http://stogalaxy.stogame.net/convert/"
					+"?language="+this.OgameAccount.getLanguage()
					+"&universe="+this.OgameAccount.getUniverse()
					+"&ogameid="+this.OgameAccount.getOgameid()
					+"&session="+this.OgameAccount.getStOGalaxySession()
					+"&combat_report="+crid
					+"&mode=preview"
			);
			this.$(previewlink)		.attr("target","_cr_"+crid);
			this.$(previewlink)		.html("<span class='name textBeefy' style='background-color: #18131D'>Preview</span>");
			this.$(settingslink)	.attr(
				"href",
				"http://stogalaxy.stogame.net/convert/"
					+"?language="+this.OgameAccount.getLanguage()
					+"&universe="+this.OgameAccount.getUniverse()
					+"&ogameid="+this.OgameAccount.getOgameid()
					+"&session="+this.OgameAccount.getStOGalaxySession()
					+"&combat_report="+crid
					+"&mode=settings"
			);
			this.$(settingslink)	.attr("target","_cr_"+crid);
			this.$(settingslink)	.html("<span class='name textBeefy' style='background-color: #18131D'>Settings</span>");
			this.$(fullscreenlink)	.attr("href","#");
			this.$(fullscreenlink)	.click(function(){
				window.fullScreen=!window.fullScreen;
			});
			this.$(fullscreenlink)	.html("<span class='name textBeefy' style='background-color: #18131D' title='F 11'>Full-screen</span>");
			this.$(linksp)			.addClass("start");
			this.$(linksdiv)		.addClass("round_info");
			this.$(linksp)			.append(converterlink);
			this.$(linksp)			.append(" ");
			this.$(linksp)			.append(previewlink);
			this.$(linksp)			.append(" ");
			this.$(linksp)			.append(settingslink);
			this.$(linksp)			.append(" ");
			this.$(linksp)			.append(fullscreenlink);
			this.$(linksdiv)		.append(linksp);
			this.$(".combat_round:first .round_info:first",this.sandbox.document).before(linksdiv);
		break;
		case "showmessage":
			var crlink=this.$("tr:last a:last[href$='#']",this.sandbox.document)[0];
			if(typeof crlink!="undefined"){
				var crid=ST_parseInt(ST_getUrlParameter("msg_id",this.sandbox.document.location.href));
				var converterlink		=this.sandbox.document.createElement("a");
				var previewlink			=this.sandbox.document.createElement("a");
				var settingslink		=this.sandbox.document.createElement("a");
				var linksdiv			=this.sandbox.document.createElement("div");
				var linksp				=this.sandbox.document.createElement("p");
				this.$(converterlink)	.attr(
					"href",
					"http://stogalaxy.stogame.net/convert/"
						+"?language="+this.OgameAccount.getLanguage()
						+"&universe="+this.OgameAccount.getUniverse()
						+"&ogameid="+this.OgameAccount.getOgameid()
						+"&session="+this.OgameAccount.getStOGalaxySession()
						+"&combat_report="+crid
						+"&mode=convert"
				);
				this.$(converterlink)	.attr("target","_cr_"+crid);
				this.$(converterlink)	.html("<span class='name textBeefy' style='background-color: #18131D'>Convert report</span>");
				this.$(previewlink)		.attr(
					"href",
					"http://stogalaxy.stogame.net/convert/"
						+"?language="+this.OgameAccount.getLanguage()
						+"&universe="+this.OgameAccount.getUniverse()
						+"&ogameid="+this.OgameAccount.getOgameid()
						+"&session="+this.OgameAccount.getStOGalaxySession()
						+"&combat_report="+crid
						+"&mode=preview"
				);
				this.$(previewlink)		.attr("target","_cr_"+crid);
				this.$(previewlink)		.html("<span class='name textBeefy' style='background-color: #18131D'>Preview</span>");
				this.$(settingslink)	.attr(
					"href",
					"http://stogalaxy.stogame.net/convert/"
						+"?language="+this.OgameAccount.getLanguage()
						+"&universe="+this.OgameAccount.getUniverse()
						+"&ogameid="+this.OgameAccount.getOgameid()
						+"&session="+this.OgameAccount.getStOGalaxySession()
						+"&combat_report="+crid
						+"&mode=settings"
				);
				this.$(settingslink)	.attr("target","_cr_"+crid);
				this.$(settingslink)	.html("<span class='name textBeefy' style='background-color: #18131D'>Settings</span>");
				this.$(linksp)			.addClass("start");
				this.$(linksdiv)		.addClass("round_info");
				this.$(linksp)			.append(converterlink);
				this.$(linksp)			.append(" ");
				this.$(linksp)			.append(previewlink);
				this.$(linksp)			.append(" ");
				this.$(linksp)			.append(settingslink);
				this.$(linksdiv)		.append(linksp);
				this.$(crlink).after(linksdiv);
			}
		break;
		default:
		break;
	}
}