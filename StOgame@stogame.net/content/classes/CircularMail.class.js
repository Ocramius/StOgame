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
function CircularMail
(
	language,
	universe,
	ogameid,
	messageid
)
{
	try
	{
		this.type				=	"circularmail";
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

CircularMail.prototype.get=function()
{
	try
	{
		return {
			"messageid":	this.messageid,
			"timestamp":	this.timestamp,
			"allyid":		this.allyid,
			"message":		this.message,
			"submitted":	this.submitted
		};
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

CircularMail.prototype.set=function(data)
{
	try
	{
		var save_changes=false;
		for(var i in data)
		{
			if(this[i]!=data[i])
			{
				save_changes=true;
				this[i]=data[i];
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

CircularMail.prototype.load=function()
{
	try
	{
		var getcircularmailquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
				+"messageid, "
				+"timestamp, "
				+"allyid, "
				+"message, "
				+"submitted "
			+"FROM "
				+"circularmails "
			+"WHERE "
				+"messageid=?1"
		);
		getcircularmailquery.bindInt64Parameter(0,this.messageid);
		if(getcircularmailquery.executeStep())
		{
			this.timestamp	=	getcircularmailquery.getInt64(1);
			this.allyid		=	getcircularmailquery.getInt64(2);
			this.message	=	getcircularmailquery.getUTF8String(3);
			this.submitted	=	getcircularmailquery.getInt64(4);
		}
		else
		{
			this.timestamp	=	0;
			this.allyid		=	0;
			this.message	=	"";
			this.submitted	=	0;
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

CircularMail.prototype.save=function()
{
	try
	{
		if(this.messageid>0)
		{
			var setcircularmailquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"INSERT INTO "
					+"circularmails "
						+"( "
							+"messageid, "
							+"timestamp, "
							+"allyid, "
							+"message "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4 "
						+") "
			);
			setcircularmailquery.bindInt64Parameter(0,this.messageid);
			setcircularmailquery.bindInt64Parameter(1,this.timestamp);
			setcircularmailquery.bindInt64Parameter(2,this.allyid);
			setcircularmailquery.bindUTF8StringParameter(3,this.message);
			//setcircularmailquery.execute();
			allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].storagemanager.push(setcircularmailquery);
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