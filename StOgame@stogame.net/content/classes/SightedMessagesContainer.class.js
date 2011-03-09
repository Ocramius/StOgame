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
function SightedMessagesContainer(language,universe,ogameid)
{
	try
	{
		this.language			=	language;
		this.universe			=	universe;
		this.ogameid			=	ogameid;
		this.sightedmessages	=	new Array();
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

SightedMessagesContainer.prototype.set=function(data)
{
	try
	{
		if(data.messageid)
		{
			if(!this.sightedmessages[data.messageid])
			{
				this.sightedmessages[data.messageid]=new SightedMessage(this.language,this.universe,this.ogameid,data.messageid);
			}
			this.sightedmessages[data.messageid].set(data);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"set",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

SightedMessagesContainer.prototype.get=function(filter)
{
	try
	{
		var fields=[
			"messageid",
			"timestamp",
			"fromgalaxy",
			"fromsystem",
			"fromplanet",
			"fromismoon",
			"togalaxy",
			"tosystem",
			"toplanet",
			"toismoon",
			"perc",
			"submitted"
		];
		var searchstring="SELECT "
							+"messageid, "
							+"timestamp, "
							+"fromgalaxy, "
							+"fromsystem, "
							+"fromplanet, "
							+"fromismoon, "
							+"togalaxy, "
							+"tosystem, "
							+"toplanet, "
							+"toismoon, "
							+"perc, "
							+"submitted "
						+"FROM "
							+"sightedmessages "
						+"WHERE "
							+"1";
		for(var i in fields)
		{
			if(typeof filter[fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+"="	+filter[fields[i]];
			}
			if(typeof filter["min"+fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+">="	+filter["min"+fields[i]];
			}
			if(typeof filter["max"+fields[i]]=="number")
			{
				searchstring+=" AND "+fields[i]+">="	+filter["max"+fields[i]];
			}
		}
		searchstring+=" ORDER BY messageid DESC";
		var returnedmessages=[];
		var getmessagesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getmessagesquery.executeStep())
		{
			returnedmessages.push
			(
				{
					"messageid":	getmessagesquery.getInt64(0),
					"timestamp":	getmessagesquery.getInt64(1),
					"fromgalaxy":	getmessagesquery.getInt32(2),
					"fromsystem":	getmessagesquery.getInt32(3),
					"fromplanet":	getmessagesquery.getInt32(4),
					"fromismoon":	getmessagesquery.getInt32(5),
					"togalaxy":		getmessagesquery.getInt32(6),
					"tosystem":		getmessagesquery.getInt32(7),
					"toplanet":		getmessagesquery.getInt32(8),
					"toismoon":		getmessagesquery.getInt32(9),
					"perc":			getmessagesquery.getInt32(10),
					"submitted":	getmessagesquery.getInt32(11)
				}
			);
		}
		return returnedmessages;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"get",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}