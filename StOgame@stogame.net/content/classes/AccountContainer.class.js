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
//CON allaccounts.getAccount(language,universe) recuperiamo dati sull'account attuale sotto forma di oggetto accountdata
function AccountContainer()
{
	try
	{
		this.accounts=st_accountspool.accounts;
		this.accountindex=st_accountspool.accountindex;
		this.lastaccounts=st_accountspool.lastaccounts;
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

AccountContainer.prototype.getAccount=function(language,universe,ogameid,creationallowed)
{
	try
	{
		if(ogameid==0)
		{
			var cookiepieces=document_to_be_parsed.documents[language][universe].cookie.split("login_");
			if(cookiepieces.length>1)
			{
				ogameid=ST_parseInt(cookiepieces[cookiepieces.length-1]);
			}
		}
		if(typeof this.lastaccounts[language]=="undefined")
		{
			this.lastaccounts[language]=new Array();
		}
		if(creationallowed)
		{
			if(
				(ogameid>0)
				&& (this.lastaccounts[language][universe]!=ogameid)
			)
			{
				this.lastaccounts[language][universe]=ogameid;
				var setlastaccountsquery=StOgameDB.createStatement(
					"INSERT INTO "
						+"last_accounts "
							+"( "
								+"ogameid, "
								+"language, "
								+"universe "
							+") "
						+"VALUES "
							+"( "
								+"?1, "
								+"?2, "
								+"?3 "
							+") "
				);
				setlastaccountsquery.bindInt32Parameter			(0, ogameid);
				setlastaccountsquery.bindUTF8StringParameter	(1, language);
				setlastaccountsquery.bindInt32Parameter			(2, universe);
				setlastaccountsquery.execute();
			}
			else
			{
				//DEPRECATED? COOKIES SHOULD ALWAYS WORK...
				if(this.lastaccounts[language][universe]>0)
				{
					ogameid=this.lastaccounts[language][universe];
				}
				else
				{
					var getlastaccountsquery=StOgameDB.createStatement(
						"SELECT "
							+"ogameid "
						+"FROM "
							+"last_accounts "
						+"WHERE "
							+"language = ?1 "
							+"AND "
							+"universe = ?2 "
						+"LIMIT "
							+"0, 1"
					);
					getlastaccountsquery.bindUTF8StringParameter(0, language);
					getlastaccountsquery.bindInt32Parameter		(1, universe);
					if(getlastaccountsquery.executeStep())
					{
						ogameid	=	getlastaccountsquery.getInt32(0);
						this.lastaccounts[language][universe]=ogameid;
					}
				}
			}
		}
		if(
			(typeof this.accountindex[language]=="undefined")
			||(typeof this.accountindex[language][universe]=="undefined")
			||(typeof this.accountindex[language][universe][ogameid]=="undefined")
			||(this.accounts[this.accountindex[language][universe][ogameid]]==-1)
		)
		{
			return this.setAccount(language,universe,ogameid,creationallowed);
		}
		else
		{
			return this.accounts[this.accountindex[language][universe][ogameid]];
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"getAccount",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

AccountContainer.prototype.setAccount=function(language,universe,ogameid,creationallowed)
{
	try
	{
		if(ogameid>0)
		{
			if((typeof this.accountindex[language])=="undefined")
			{
				this.accountindex[language]=new Array();
			}
			if((typeof this.accountindex[language][universe])=="undefined")
			{
				this.accountindex[language][universe]=new Array();
			}
			if(this.accounts[this.accountindex[language][universe][ogameid]]!=-1)
			{
				if(creationallowed)
				{
					var insertaccountquery=StOgameDB.createStatement(
						"INSERT INTO "
							+"accounts "
								+"( "
									+"ogameid, "
									+"language, "
									+"universe "
								+") "
							+"VALUES "
								+"( "
									+"?1, "
									+"?2, "
									+"?3 "
								+") "
					);
					insertaccountquery.bindInt32Parameter			(0, ogameid);
					insertaccountquery.bindUTF8StringParameter		(1, language);
					insertaccountquery.bindInt32Parameter			(2, universe);
					insertaccountquery.execute();
					this.accountindex[language][universe][ogameid]=this.accounts.length;
					this.accounts[this.accounts.length]=new Account(language,universe,ogameid);
				}
				else
				{
					return 0;
				}
			}
			else
			{
				this.accounts[this.accountindex[language][universe][ogameid]]=new Account(language,universe,ogameid);
			}
			//this.accounts[this.accounts.length-1].events.RunEvents(true);
			return this.accounts[this.accounts.length-1];
		}
		else
		{
			return 0;
		}
	}
	catch(e)
	{
		st_errors.adderror
		(
			e,
			"setAccount",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}



var allaccounts=new AccountContainer();