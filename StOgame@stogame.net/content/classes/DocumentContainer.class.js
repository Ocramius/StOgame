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

//document_to_be_parsed.documents[language][server] contiene il nostro ultimo document

function DocumentContainer()
{
	try
	{
		this.documents=new Array();
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

DocumentContainer.prototype.setDocument=function(document,language,server)
{
	try
	{
		if(typeof this.documents[language]=="undefined")
		{
			this.documents[language]=new Array();
		}
		this.documents[language][server]=document;
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setDocument",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

document_to_be_parsed=new DocumentContainer();