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
function GlobalTooltip()
{
	this.alertsService=Components.classes["@mozilla.org/alerts-service;1"]
		.getService(Components.interfaces.nsIAlertsService);
	this.alertsClickListener={
		observe: function(subject,topic,data)
		{
			if(topic=="alertclickcallback")
			{
				var responseactiontype=data.substring(0,data.indexOf("|"));
				responseactiontypedata=responseactiontype.split(",");
				responseactiontype=responseactiontypedata[responseactiontypedata.length-1];
				if(responseactiontypedata.length==4)
				{
					var language=responseactiontypedata[0];
					var universe=responseactiontypedata[1];
					var ogameid=responseactiontypedata[2];
				}
				var responseactiondata=data.substring(data.indexOf("|")+1,topic.length);
				switch(responseactiontype)
				{
					case "error":
						st_errors.submit(ST_parseInt(responseactiondata));
					break;    
					case "transfererror":
					break;
					
					case "fleetincoming":
					break;
					case "fleetarrived":
					break;
					
					case "buildingupgrading":
					break;
					case "buildingupgraded":
						//language+","+universe+","+ogameid+","+objsplit.gid
					break;
					
					case "buildingdowngrading":
					break;
					case "buildingdowngraded":
						//language+","+universe+","+ogameid+","+objsplit.gid
					break;
					
					case "researchending":
					break;
					case "researchended":
					break;
					
					case "depotfilling":
					break;
					case "depotfull":
					break;
					
					case "news":
						gBrowser.selectedTab=gBrowser.addTab
						(
							"http://stogalaxy.stogame.net/index.php?"
								+"page=news"
								+"&language="+language
								+"&universe="+universe
								+"&ogameid="+ogameid
								+"&session="+allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sessionid
						);
					break;
					case "newprivatemessage":
					break;
					case "newallymessage":
					break;
					case "newspyreports":
					break;
					case "newtagboardnews":
					break;
					case "newtagboardmessages":
					break;
					case "stogalaxy_wrong_settings":
						gBrowser.selectedTab=gBrowser.addTab
						(
							"http://stogalaxy.stogame.net/config/index.php?"
								+"page=stogalaxy"
								+"&language="+language
								+"&universe="+universe
								+"&ogameid="+ogameid
								+"&session="+allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].stogalaxy.sessionid
						);
					break;
				}
			}
		}
	}
}

GlobalTooltip.prototype.tip=function
(
	language,
	universe,
	ogameid,
	type,
	imagename,
	soundname,
	title,
	text,
	listenerparameters
)
{
	try
	{
		if(allaccounts.accounts[allaccounts.accountindex[language][universe][ogameid]].options.getOption("tooltip",listenerparameters.substring(0,listenerparameters.indexOf("|")))!=-1)
		{
			//PUT OPTION HERE
			this.alertsService.showAlertNotification
			(
				"chrome://StOgame/content/tooltipicons/"+imagename+".png",
				title,
				text,
				true,
				language+","+universe+","+ogameid+","+type+"|"+listenerparameters,
				this.alertsClickListener
			);
			//"chrome://StOgame/tooltipsounds/"+soundname+".wav"
		}
	}
	catch(e)
	{
		//NO language, universe, ogameid
		this.alertsService.showAlertNotification
		(
			"chrome://StOgame/content/tooltipicons/"+imagename+".png",
			title,
			text,
			true,
			type+"|"+listenerparameters,
			this.alertsClickListener
		);
		//"chrome://StOgame/tooltipsounds/"+soundname+".wav"
	}
}

globaltooltip=new GlobalTooltip();