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
function Activity
(
	language,
	universe,
	ogameid,
	x,
	y,
	z
)
{
	try
	{
		this.language			=	language;
		this.universe			=	universe;
		this.ogameid			=	ogameid;
		this.x					=	x;
		this.y					=	y;
		this.z					=	z;
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


Activity.prototype.load=function()
{
	try
	{
		//LOAD THE PREVIOUS ACTIVITY FROM DB
		var getactivityquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
				+"timestamp "
			+"FROM "
				+"activities "
			+"WHERE "
				+"x=?1 "
				+"AND "
				+"y=?2 "
				+"AND "
				+"z=?3 "
			+"ORDER BY "
				+"timestamp DESC "
			+"LIMIT "
				+"0,1"
		);
		getactivityquery.bindInt32Parameter(0,this.x);
		getactivityquery.bindInt32Parameter(1,this.y);
		getactivityquery.bindInt64Parameter(2,this.z);
		if(getactivityquery.executeStep())
		{
			this.timestamp		=	getactivityquery.getInt64(0);
			this.maxstamp		=	this.timestamp;
		}
		else
		{
			this.timestamp		=	0;
			this.maxstamp		=	0;
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


Activity.prototype.set=function(data)
{
	try
	{
		//data.timestamp == 0 means there that an asterisk was recorded
		var timestamp=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()-data.timestamp;
		var min_stamp=(data.timestamp==0)?(timestamp-900000)	:(timestamp-data.timestamp*60000);
		var max_stamp=(data.timestamp==0)?(timestamp)			:(timestamp-data.timestamp*60000);
		if
		(
			//this.timestamp<min_stamp -- OVVIO!!!
			this.maxstamp<(min_stamp-60000)
		)
		{
			this.maxstamp	=	max_stamp;
			this.timestamp	=	min_stamp;
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

Activity.prototype.save=function()
{
	try
	{
		if(this.timestamp>0)
		{
			var setactivityquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"INSERT INTO "
					+"activities "
						+"( "
							+"x, "
							+"y, "
							+"z, "
							+"timestamp "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4 "
						+") "
			);
			setactivityquery.bindInt32Parameter(0,this.x);
			setactivityquery.bindInt32Parameter(1,this.y);
			setactivityquery.bindInt32Parameter(2,this.z);
			setactivityquery.bindInt64Parameter(3,this.timestamp);
			//setactivityquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setactivityquery);
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