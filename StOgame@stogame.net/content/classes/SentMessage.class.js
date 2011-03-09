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
function SentMessage
(
	language,
	universe,
	ogameid,
	targetogameid
)
{
	try
	{
		this.language			=	language;
		this.universe			=	universe;
		this.ogameid			=	ogameid;
		this.targetogameid		=	targetogameid;
		this.timestamp			=	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp();
		this.replytomessageid	=	0;
		this.title				=	"";
		this.message			=	"";
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

//UNUSED FOR NOW
/*
SentMessage.prototype.load=function()
{
	try
	{
		var getmessagequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
			"SELECT "
				+"replytomessageid, "
				+"timestamp, "
				+"targetogameid, "
				+"title, "
				+"message, "
				+"submitted "
			+"FROM "
				+"sentmessages "
			+"WHERE "
				+"timestamp=?1"
		);
		getmessagequery.bindInt64Parameter(0,this.timestamp);
		if(getmessagequery.executeStep())
		{
			this.replytomessageid	=	getmessagequery.getInt64(1);
			this.timestamp			=	getmessagequery.getInt64(1);
			this.targetogameid		=	getmessagequery.getInt64(2);
			this.title				=	getmessagequery.getUTF8String(3);
			this.message			=	getmessagequery.getUTF8String(4);
			this.submitted			=	getmessagequery.getInt64(5);
		}
		else
		{
			this.replytomessageid	=	0;
			this.timestamp			=	0;
			this.targetogameid		=	0;
			this.title				=	"";
			this.message			=	"";
			this.submitted			=	0;
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
}*/

SentMessage.prototype.set=function(data)
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

SentMessage.prototype.save=function()
{
	try
	{
		if(this.targetogameid>0)
		{
			var setmessagequery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(
				"INSERT INTO "
					+"sentmessages "
						+"( "
							+"replytomessageid, "
							+"timestamp, "
							+"targetogameid, "
							+"title, "
							+"message "
						+") "
						+"VALUES "
						+"( "
							+"?1, "
							+"?2, "
							+"?3, "
							+"?4, "
							+"?5 "
						+") "
			);
			setmessagequery.bindInt64Parameter(0,this.replytomessageid);
			setmessagequery.bindInt64Parameter(1,this.timestamp);
			setmessagequery.bindInt32Parameter(2,this.targetogameid);
			setmessagequery.bindUTF8StringParameter(3,this.title);
			setmessagequery.bindUTF8StringParameter(4,this.message);
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