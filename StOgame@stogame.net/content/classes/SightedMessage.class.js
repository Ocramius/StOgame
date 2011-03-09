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
function SightedMessage
(
	language,
	universe,
	ogameid,
	messageid
)
{
	try
	{
		this.language			=	language;
		this.universe			=	universe;
		this.ogameid			=	ogameid;
		this.messageid			=	messageid;
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

SightedMessage.prototype.save=function()
{
	try
	{
		if(this.messageid>0)
		{
			var setmessagequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"INSERT INTO "
					+"sightedmessages "
						+"( "
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
							+"perc "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4, "
							+"?5, "
							+"?6, "
							+"?7, "
							+"?8, "
							+"?9, "
							+"?10, "
							+"?11 "
						+") "
			);
			setmessagequery.bindInt64Parameter(0,this.messageid);
			setmessagequery.bindInt64Parameter(1,this.timestamp);
			setmessagequery.bindInt32Parameter(2,this.fromgalaxy);
			setmessagequery.bindInt32Parameter(3,this.fromsystem);
			setmessagequery.bindInt32Parameter(4,this.fromplanet);
			setmessagequery.bindInt32Parameter(5,this.fromismoon);
			setmessagequery.bindInt32Parameter(6,this.togalaxy);
			setmessagequery.bindInt32Parameter(7,this.tosystem);
			setmessagequery.bindInt32Parameter(8,this.toplanet);
			setmessagequery.bindInt32Parameter(9,this.toismoon);
			setmessagequery.bindInt32Parameter(10,this.perc);
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setmessagequery);
			//setmessagequery.execute();
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

SightedMessage.prototype.load=function()
{
	try
	{
		var getmessagequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
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
				+"messageid=?1 "
		);
		getmessagequery.bindInt64Parameter(0,this.messageid);
		if(getmessagequery.executeStep())
		{
			this.timestamp		=	getmessagequery.getInt64(1);
			this.fromgalaxy		=	getmessagequery.getInt32(2);
			this.fromsystem		=	getmessagequery.getInt32(3);
			this.fromplanet		=	getmessagequery.getInt32(4);
			this.fromismoon		=	getmessagequery.getInt32(5);
			this.togalaxy		=	getmessagequery.getInt32(6);
			this.tosystem		=	getmessagequery.getInt32(7);
			this.toplanet		=	getmessagequery.getInt32(8);
			this.toismoon		=	getmessagequery.getInt32(9);
			this.perc			=	getmessagequery.getInt32(10);
			this.submitted		=	getmessagequery.getInt32(11);
		}
		else
		{
			this.timestamp		=	0;
			this.fromgalaxy		=	0;
			this.fromsystem		=	0;
			this.fromplanet		=	0;
			this.fromismoon		=	0;
			this.togalaxy		=	0;
			this.tosystem		=	0;
			this.toplanet		=	0;
			this.toismoon		=	0;
			this.perc			=	0;
			this.submitted		=	0;
		}
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

SightedMessage.prototype.set=function(data)
{
	try
	{
		var save_changes=false;
		for(var i in data)
		{
			if
			(
				typeof this[i]!="undefined"
				&& this[i]!=data[i]
			)
			{
				this[i]=ST_parseInt(data[i]);
				save_changes=true;
			}
		}
		if(save_changes)
		{
			this.save();
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