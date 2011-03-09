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
function CircularMailsContainer(language,universe,ogameid)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.circularmails	=	new	Array();
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

CircularMailsContainer.prototype.set=function(data)
{
	try
	{
		if
		(
			data.messageid
			&& data.messageid>0
		)
		{
			if(!this.circularmails[data.messageid])
			{
				this.circularmails[data.messageid]=new CircularMail
				(
					this.language,
					this.universe,
					this.ogameid,
					data.messageid
				);
			}
			this.circularmails[data.messageid].set(data);
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

CircularMailsContainer.prototype.get=function(filter)
{
	try
	{
		var CircularMailsContainer=this;
		var fields=[
			"messageid",
			"timestamp",
			"allyid",
			"submitted"
		];
		var searchstring="SELECT "
							+"messageid, "
							+"timestamp, "
							+"allyid, "
							+"message, "
							+"submitted "
						+"FROM "
							+"circularmails "
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
		if(typeof filter["message"]!="undefined")
		{
			searchstring+=" AND message LIKE '%"+filter["message"].replace(/\'/ig,"")+"%'";
		}
		searchstring+=" ORDER BY messageid DESC";
		var returnedcircularmails=[];
		var getcircularmailsquery=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].AccountDB.createStatement(searchstring);
		while(getcircularmailsquery.executeStep())
		{
			returnedcircularmails.push
			(
				{
					"messageid":			getcircularmailsquery.getInt64(0),
					"timestamp":			getcircularmailsquery.getInt64(1),
					"allyid":				getcircularmailsquery.getInt64(2),
					"message":				getcircularmailsquery.getUTF8String(3),
					"submitted":			getcircularmailsquery.getInt64(4),
					"get":					function()
					{
						if(!CircularMailsContainer.circularmails[this.messageid])
						{
							CircularMailsContainer.circularmails[this.messageid]=new CircularMail(CircularMailsContainer.language,CircularMailsContainer.universe,CircularMailsContainer.ogameid,this.messageid);
						}
						return CircularMailsContainer.circularmails[this.messageid].get();
					}
				}
			);
		}
		return returnedcircularmails;
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