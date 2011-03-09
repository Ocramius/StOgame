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
function Messages(language,universe,ogameid,AccountDB)
{
	try
	{
		this.language		=	language;
		this.universe		=	universe;
		this.ogameid		=	ogameid;
		this.messages_by_id	=	new Array();
		
		this.messages		=	new MessagesContainer(this.language,this.universe,this.ogameid);
		this.sentmessages	=	new SentMessagesContainer(this.language,this.universe,this.ogameid);
		this.circularmails	=	new CircularMailsContainer(this.language,this.universe,this.ogameid);
		this.spyreports		=	new SpyReportContainer(this.language,this.universe,this.ogameid);
		this.sightedmessages=	new SightedMessagesContainer(this.language,this.universe,this.ogameid);
		this.fleetlogs		=	new Array();	//fleetlogs are not yet managed
		this.combatreports	=	new	CombatReportContainer(this.language,this.universe,this.ogameid)
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