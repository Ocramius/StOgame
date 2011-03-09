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
function MessagesContainer(language,universe,ogameid)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.messages		=	new	Array();
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

MessagesContainer.prototype.set=function(data)
{
	try
	{
		if
		(
			data.messageid
			&& data.messageid>0
		)
		{
			if(!this.messages[data.messageid])
			{
				this.messages[data.messageid]=new Message
				(
					this.language,
					this.universe,
					this.ogameid,
					data.messageid
				);
			}
			this.messages[data.messageid].set(data);
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"set",
			"",
			"messageid="+data.messageid
		)
	}
}

MessagesContainer.prototype.get=function(filter)
{
	try
	{
		var MessagesContainer=this;
		var fields=[
			"messageid",
			"timestamp",
			"senderogameid",
			"submitted"
		];
		var searchstring="SELECT "
							+"messageid, "
							+"timestamp, "
							+"senderogameid, "
							+"title, "
							+"message, "
							+"submitted "
						+"FROM "
							+"messages "
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
		if(typeof filter["title"]!="undefined")
		{
			searchstring+=" AND title LIKE '%"+filter["title"].replace(/\'/ig,"")+"%'";
		}
		if(typeof filter["message"]!="undefined")
		{
			searchstring+=" AND message LIKE '%"+filter["message"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY messageid DESC";
		var returnedmessages=[];
		var getmessagesquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getmessagesquery.executeStep())
		{
			returnedmessages.push
			(
				{
					"messageid":			getmessagesquery.getInt64(0),
					"timestamp":			getmessagesquery.getInt64(1),
					"senderogameid":		getmessagesquery.getInt64(2),
					"title":				getmessagesquery.getUTF8String(3),
					"message":				getmessagesquery.getUTF8String(4),
					"submitted":			getmessagesquery.getInt64(5),
					"get":					function()
					{
						if(!MessagesContainer.messages[this.messageid])
						{
							MessagesContainer.messages[this.messageid]=new Message(MessagesContainer.language,MessagesContainer.universe,MessagesContainer.ogameid,this.messageid);
						}
						return MessagesContainer.messages[this.messageid].get();
					}
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