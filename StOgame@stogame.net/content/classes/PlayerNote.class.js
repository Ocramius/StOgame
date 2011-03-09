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
function PlayerNote
(
	account,
	ogameid,
	added
)
{
	try
	{
		this.account			=	account;
		this.ogameid			=	ogameid;
		this.added				=	((added>0)?(added):(this.account.getServerTimestamp()));
		this.updated			=	0;
		this.note				=	"";
		//this.load(); //UNNECESSARY FOR NOW
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

PlayerNote.prototype.load=function()
{
	try
	{
		var getnotequery=this.account.AccountDB.createStatement(
			"SELECT "
				+"added, "
				+"updated, "
				+"note "
			+"FROM "
				+"player_notes "
			+"WHERE "
				+"ogameid=?1 "
				+"AND "
				+"added=?2 "
		);
		getnotequery.bindInt32Parameter(0,this.ogameid);
		getnotequery.bindInt64Parameter(1,this.added);
		if(getnotequery.executeStep())
		{
			this.added			=	getnotequery.getInt64(0);
			this.updated		=	getnotequery.getInt64(1);
			this.note			=	getnotequery.getUTF8String(2);
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

PlayerNote.prototype.set=function(note)
{
	try
	{
		this.note=note;
		this.updated=this.account.getServerTimestamp();
		this.save();
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

PlayerNote.prototype.save=function()
{
	try
	{
		var setnotequery=this.account.AccountDB.createStatement(
			"INSERT INTO "
				+"player_notes "
					+"( "
						+"ogameid, "
						+"added, "
						+"updated, "
						+"note "
					+") "
					+"VALUES "
					+"( "
						+"?1, "
						+"?2, "
						+"?3, "
						+"?4 "
					+") "
		);
		setnotequery.bindInt32Parameter(0,this.ogameid);
		setnotequery.bindInt64Parameter(1,this.added);
		setnotequery.bindInt64Parameter(2,this.updated);
		setnotequery.bindUTF8StringParameter(3,this.note);
		setnotequery.execute();
		//this.account.storagemanager.push(setnotequery);
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