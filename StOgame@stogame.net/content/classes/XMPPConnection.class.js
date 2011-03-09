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
/*
Funzioni
X-aprire/chiudere chat
-blinkare/non blinkare chat (grafica)
X-aprire tab
X-chiudere tab
X-selezionare tab
-blinkare/non blinkare tab (grafica)


-marcare messaggi di una chat come letti
-stampare a video i messaggi di una chat (grafica)
-aggiungere/rimuovere utenti in una room (grafica)


Variabili
-finestre aperte con la chat

-chat aperta/chiusa
-tab aperto/""

-lista dei tabs
	-messaggi
	-non letti
	-utenti
*/


function XMPPConnection(language,universe,ogameid){
	try
	{
		this.language=language;
		this.universe=universe;
		this.ogameid=ogameid;
		this.account={
			"jid": 					this.universe+this.language+this.ogameid+'@stogame.net/StOGalaxy',
			"cleanjid":				this.universe+this.language+this.ogameid,
			"resource":				"StOGalaxy",
			"connectionHost":		"stogame.net",
			"connectionPort":		5222,
			"_connectionPort":		5222,
			"password":				"",
			//allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].stogalaxy.password,
			//ST_MD5(this.universe+this.language+this.ogameid),
			"connectionSecurity":	0
		};
		this.connectiontrial=0;
		var XMPPConnection=this;
		
		this.chatdata={
			//CHAT DATA IN HERE
			"windows":	{
				"openwindows":		new Array(),
				"replicate_cmd":	function(cmd,params)
				{
					//alert("replicating "+cmd+"("+params+")");
					for(var i in chatdata.windows.openwindows)
					{
						//alert(i)
						try
						{
							chatdata.windows.openwindows[i].chatmodifier[cmd](params);
						}
						catch(e)
						{
							alert(e);
							delete chatdata.windows.openwindows[i];
						}
					}
				}
			},
			"connected":false,
			"open":		false,
			"tab":		"",
			"tabs":		new Array(),
			/*
				tab structure:
				{
					messages:	new Array(),
					unread:		0,
					users:		new Array()
				}
			*/
			"methods":	{
				"addWindow":		function(win)
				{
					var length=chatdata.windows.openwindows.length;
					chatdata.windows.openwindows[length]=win;
					return length;
				},
				"removeWindow":		function(id)
				{
					if(chatdata.windows.openwindows[id])
					{
						delete chatdata.windows.openwindows[id];
					}
				},
				"setOpenStatus":	function(open)
				{
					chatdata.open=open?true:false;
					chatdata.windows.replicate_cmd("_setOpenStatus",{"open":chatdata.open});
				},
				"setActiveTab":		function(tab)
				{
					//MARK MESSAGES AS READ?
					if(tab!=chatdata.tab)
					{
						chatdata.tab=(typeof chatdata.tabs[tab]!="undefined")?tab:"";
						chatdata.windows.replicate_cmd("_setActiveTab",{"tab":chatdata.tab});
					}
				},
				"openTab":			function(tab)
				{
					tab=String(tab);
					if(typeof chatdata.tabs[tab]=="undefined")
					{
						chatdata.tabs[tab]={
							"messages":	new Array(),
							"unread":	0,
							"users":	new Array()
						}
						chatdata.windows.replicate_cmd("_openTab",{"tab":tab});
					}
				},
				"closeTab":			function(tab)
				{
					tab=String(tab);
					if(typeof chatdata.tabs[tab]!="undefined")
					{
						delete chatdata.tabs[tab];
						chatdata.windows.replicate_cmd("_closeTab",{"tab":tab});
						if(tab==chatdata.tab)
						{
							chatdata.methods.setActiveTab(chatdata.tab);
						}
					}
				},
				
				"addUser":			function(tab,user,stanza)
				{
					tab=String(tab);
					user=String(user);
					if(typeof chatdata.tabs[tab]=="undefined")
					{
						chatdata.methods.openTab(tab);
					}
					if(typeof chatdata.tabs[tab].users[user]=="undefined")
					{
						chatdata.tabs[tab].users[user]={"stanza":stanza};
						chatdata.windows.replicate_cmd("_addUser",{"tab":tab,"user":user});
					}
				},
				"removeUser":		function(tab,user)
				{
					tab=String(tab);
					user=String(user);
					if(typeof chatdata.tabs[tab]=="undefined")
					{
						chatdata.methods.openTab(tab);
					}
					if(typeof chatdata.tabs[tab].users[user]!="undefined")
					{
						delete chatdata.tabs[tab].users[user];
						chatdata.windows.replicate_cmd("_removeUser",{"tab":tab,"user":user});
					}
				},
				"appendMessage":	function(tab,message)
				{
					//alert("appendMessage ok!")
					tab=String(tab);
					if(typeof chatdata.tabs[tab]=="undefined")
					{
						chatdata.methods.openTab(tab);
					}
					chatdata.tabs[tab].messages.push(message);
					chatdata.tabs[tab].unread++;
					chatdata.windows.replicate_cmd("_appendMessages",{"tab":tab});
				},
				"markAsRead":		function(tab,decrement)
				{
					tab=String(tab);
					decrement=Math.abs(ST_parseInt(decrement));
					if(typeof chatdata.tabs[tab]!="undefined")
					{
						chatdata.tabs[tab].unread=Math.max(0,chatdata.tabs[tab].unread-decrement);
						chatdata.windows.replicate_cmd("_markAsRead",{"tab":tab});
					}
				},
				"getConnectionStatus":	function()
				{
					return chatdata.connected;
				},
				"getOpenStatus":	function()
				{
					return chatdata.open;
				},
				"getTabs":			function()
				{
					return chatdata.tabs;
				},
				"getActiveTab":		function()
				{
					return chatdata.tab;
				}
				//FUNCTIONS TO GET MESSAGES HERE...
			}
		}
		var chatdata=this.chatdata;
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

XMPPConnection.prototype.checkconnection=function(){
	try{
		if(
			typeof XMPP!="undefined"
			&& !this.isConnected()
		){
			//this.disconnect();
			this.chatdata.connected=false;
			this.connect();
		}
	}catch(e){
		st_errors.adderror(
			e,
			"checkconnection",
			"see_how_to_retrieve_html",
			"no_interesting_vars"
		)
	}
}

XMPPConnection.prototype.connect=function(){
	try{
		this.account.password=allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].stogalaxy.password;
		var xmppconnection=this;
		if(typeof this.account.password!="undefined" && this.account.password.length>0){
			XMPP.up(this.account,function(){xmppconnection.onconnection()});
			//CHECK CONNECTION STATUS AFTER 15 SECONDS TO AVOID ANY PROBLEMS WITH THE FROZEN CONNECTOR INDICATOR
			setTimeout(
				function(){
					if(!xmppconnection.isConnected()){
						xmppconnection.disconnect();
						if(xmppconnection.connectiontrial<3){
							xmppconnection.connectiontrial++;
							xmppconnection.checkconnection();
						}else{
							//AFTER TRYING CONNECTION 3 TIMES, TRY TO CONNECT AFTER 10 MINUTES IF NOT REQUESTED BEFORE
							setTimeout(
								function(){
									xmppconnection.connectiontrial=0;
									xmppconnection.checkconnection();
								},
								600000
							);
						}
					}
				},
				15000
			);
		}
	}catch(e){
		st_errors.adderror(
			e,
			"connect",
			"",
			""
		)
	}
}

XMPPConnection.prototype.onconnection=function(){
	try{
		this.chatdata.connected=true;
		if(typeof this.channel=="undefined"){
			this.channel = XMPP.createChannel();
			var xmppconnection=this;
			this.channel.on(
				{
					event		:	'message',
					direction	:	'in',
					account		:	this.account.jid
		        },
				function(message){
					xmppconnection.manageIncomingMessageEvent(message);
				}
			);
			this.channel.on(
				{
					event		:	'message',
					direction	:	'out',
					account		:	this.account.jid
		        },
				function(message)
				{
					xmppconnection.manageOutgoingMessageEvent(message);
				}
			);
			this.channel.on(
				{
					event		:	'connector',
					account		:	this.account.jid
		        },
				function(connector)
				{
					xmppconnection.manageIncomingConnectorEvent(connector);
				}
			);
			this.channel.on(
				{
					event		:	'presence',
					direction	:	'in',
					account		:	this.account.jid
		        },
				function(presence)
				{
					xmppconnection.manageIncomingPresenceEvent(presence);
				}
			);
			this.channel.on(
				{
					event		:	'presence',
					direction	:	'out',
					account		:	this.account.jid
		        },
				function(presence)
				{
					xmppconnection.manageOutgoingPresenceEvent(presence);
				}
			);
			this.channel.on(
				{
					event		:	'iq',
					direction	:	'in',	//MANAGE OUTGOING? :\ MANAGE INCOMING? SHOULD BE DONE THROUGH REPLIES...
					account		:	this.account.jid
		        },
				function(iq)
				{
					xmppconnection.manageIncomingIqEvent(iq);
				}
			);
		}
	}catch(e){
		st_errors.adderror(
			e,
			"onconnection",
			"",
			""
		)
	}
}

XMPPConnection.prototype.manageIncomingConnectorEvent=function(connector){
	try{
		/*var description="|connector|\n\n"
		for(var varname in connector)
		{
			description+=varname+": "+connector[varname]+"\n\n"
		}
		alert(description)*/
	}catch(e){
		st_errors.adderror(
			e,
			"manageIncomingConnectorEvent",
			"",
			""
		)
	}
}

XMPPConnection.prototype.manageIncomingIqEvent=function(iq){
	try{
		//var description="|iq|\n\n"
		//for(var varname in iq)
		//{
		//	description+=varname+": "+iq[varname]+"\n\n"
		//}
		//WHEN IS IQ USED? :\
		//alert(description)
	}catch(e){
		st_errors.adderror(
			e,
			"manageIncomingIqEvent",
			"",
			""
		)
	}
}

XMPPConnection.prototype.manageIncomingPresenceEvent=function(presence){
	try{
		if(!presence.stanza..@stamp.toString().length>0){
			var stamp=new Date(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
			presence.stanza.presence+=<x stamp={stamp.getUTCFullYear()+""+((String(stamp.getUTCMonth()+1).length==2)?(stamp.getUTCMonth()+1):"0"+(stamp.getUTCMonth()+1))+""+((String(stamp.getUTCDate()).length==2)?(stamp.getUTCDate()):"0"+(stamp.getUTCDate()))+"T"+((String(stamp.getUTCHours()).length==2)?(stamp.getUTCHours()):"0"+(stamp.getUTCHours()))+":"+((String(stamp.getUTCMinutes()).length==2)?(stamp.getUTCMinutes()):"0"+(stamp.getUTCMinutes()))+":"+((String(stamp.getUTCSeconds()).length==2)?(stamp.getUTCSeconds()):"0"+(stamp.getUTCSeconds()))} xmlns="jabber:x:delay"/>;
		}
		if(
			(
				presence.stanza.@from.indexOf("@conference.stogame.net/")==presence.stanza.@from.indexOf("@")
				|| (
					presence.stanza.@from.indexOf("@irc.stogame.net/")==presence.stanza.@from.indexOf("@")
					&& presence.stanza.@from.indexOf("%")>0
					&& presence.stanza.@from.indexOf("%")<presence.stanza.@from.indexOf("@")
				)
			)
			&& presence.stanza.@from.indexOf("@")>0
		){
			//if(presence.stanza.x)
			//{
				//SET <x stamp=''
				//<message from="_test_@conference.stogame.net/Zibibbo84" to="680EN101288@stogame.net/StOGalaxy" type="groupchat" id="_12420516565371009">
					//<body>prot</body>
					//<x stamp="20090511T15:05:43" xmlns="jabber:x:delay"/>
					//<meta account="680EN101288@stogame.net/StOGalaxy" direction="in" xmlns="http://hyperstruct.net/xmpp4moz/protocol/internal"/>
				//</message>
				//allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].stogalaxy.password	
			//}
			var roomname=presence.stanza.@from.split("/")[0].toLowerCase();
			var nickname=presence.stanza.@from.split("/")[1];
			if(!this.chatdata.tabs[roomname]){
				//this.chatdata.methods.openTab(roomname);
				this.chatdata.methods.addUser(roomname,nickname,presence.stanza);
				/*this.chatdata.tabs[roomname]=
				{
					type:	"multi-user-chat",
					host:	(presence.stanza.@to.indexOf("@conference.stogame.net/")==presence.stanza.@to.indexOf("@"))?"jabber":"irc",
					users:	new Array(),
					topic:	"",
					title:	"",
					id:		roomname,
					blink:	true,
					Messages:		new Array(),
					MessagesToRead:	new Array()
				}*/
				/*this.chatdata.tabs[roomname].users[nickname]=
				{
					"nickname":	nickname
				}*/
			}else{
				if(presence.stanza.@type=="unavailable"){
					/*
					//REMOVE USER
					delete this.chats.tabs[roomname].users[nickname];
					this.chatwindows.delUser(roomname,nickname);
					this.chatwindows.closeTab(roomname);
					*/
					this.chatdata.methods.removeUser(roomname,nickname);
				}else if(presence.stanza.@type=="error"){
					//DO NOTHING - ERROR - DO NOT JOIN ROOM
				}else{
					/*this.chats.tabs[roomname].users[nickname]=
					{
						"nickname":	nickname
					}
					this.chatwindows.addUser(roomname,nickname);*/
					this.chatdata.methods.addUser(roomname,nickname,presence.stanza);
				}
			}
			this.chatdata.methods.appendMessage(roomname,presence.stanza);
		}
	}catch(e){
		st_errors.adderror(
			e,
			"manageIncomingPresenceEvent",
			"",
			""
		)
	}
}

XMPPConnection.prototype.manageOutgoingPresenceEvent=function(presence){
	try{
		//NOT NEEDED?
		/*if(!presence.stanza..@stamp.toString().length>0)
		{
			var stamp=new Date(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
			presence.stanza+=<x stamp={stamp.getUTCFullYear()+""+((String(stamp.getUTCMonth()+1).length==2)?(stamp.getUTCMonth()+1):"0"+(stamp.getUTCMonth()+1))+""+((String(stamp.getUTCDate()).length==2)?(stamp.getUTCDate()):"0"+(stamp.getUTCDate()))+"T"+((String(stamp.getUTCHours()).length==2)?(stamp.getUTCHours()):"0"+(stamp.getUTCHours()))+":"+((String(stamp.getUTCMinutes()).length==2)?(stamp.getUTCMinutes()):"0"+(stamp.getUTCMinutes()))+":"+((String(stamp.getUTCSeconds()).length==2)?(stamp.getUTCSeconds()):"0"+(stamp.getUTCSeconds()))} xmlns="jabber:x:delay"/>;
		}*/
		if(
			(
				presence.stanza.@to.indexOf("@conference.stogame.net/")==presence.stanza.@to.indexOf("@")
				|| (
					presence.stanza.@to.indexOf("@irc.stogame.net/")==presence.stanza.@to.indexOf("@")
					&& presence.stanza.@to.indexOf("%")>0
					&& presence.stanza.@to.indexOf("%")<presence.stanza.@to.indexOf("@")
				)
			)
			&& presence.stanza.@to.indexOf("@")>0
			&& presence.stanza.@type!="error"
		){
			var roomname=presence.stanza.@to.split("/")[0].toLowerCase();
			var nickname=presence.stanza.@to.split("/")[1];
			if(
				presence.stanza.@type=="unavailable"
				&& (typeof this.chatdata.tabs[roomname]!="undefined")
			){
				this.chatdata.methods.closeTab(roomname);
				//this.chatwindows.delUser(roomname,nickname);
			}else if(!this.chatdata.tabs[roomname]){
				this.chatdata.methods.openTab(roomname);
				this.chatdata.methods.appendMessage(roomname,presence.stanza);
				//this.chatdata.methods.addUser(roomname,nickname);
				/*this.chats.tabs[roomname]=
				{
					type:	"multi-user-chat",
					host:	(presence.stanza.@to.indexOf("@conference.stogame.net/")==presence.stanza.@to.indexOf("@"))?"jabber":"irc",
					users:	new Array(),
					topic:	"",
					title:	"",
					id:		roomname,
					blink:	true,
					Messages:		new Array(),
					MessagesToRead:	new Array()
				}*/
				/*this.chats.tabs[roomname].users[nickname]=
				{
					"nickname":	nickname
				}*/
				//this.chatwindows.addTab(roomname);
				//this.chatwindows.addUser(roomname,nickname);
			}
		}
	}catch(e){
		st_errors.adderror(
			e,
			"manageOutgoingPresenceEvent",
			"",
			""
		)
	}
}

XMPPConnection.prototype.manageIncomingMessageEvent=function(message){
	try{
		if(!message.stanza..@stamp.toString().length>0){
			//alert(message.stanza..@stamp.toString())
			//SET <x stamp=''
			//<message from="_test_@conference.stogame.net/Zibibbo84" to="680EN101288@stogame.net/StOGalaxy" type="groupchat" id="_12420516565371009">
				//<body>prot</body>
				//<x stamp="20090511T15:05:43" xmlns="jabber:x:delay"/>
				//<meta account="680EN101288@stogame.net/StOGalaxy" direction="in" xmlns="http://hyperstruct.net/xmpp4moz/protocol/internal"/>
			//</message>
			var stamp=new Date(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
			message.stanza.message+=<x stamp={stamp.getUTCFullYear()+""+((String(stamp.getUTCMonth()+1).length==2)?(stamp.getUTCMonth()+1):"0"+(stamp.getUTCMonth()+1))+""+((String(stamp.getUTCDate()).length==2)?(stamp.getUTCDate()):"0"+(stamp.getUTCDate()))+"T"+((String(stamp.getUTCHours()).length==2)?(stamp.getUTCHours()):"0"+(stamp.getUTCHours()))+":"+((String(stamp.getUTCMinutes()).length==2)?(stamp.getUTCMinutes()):"0"+(stamp.getUTCMinutes()))+":"+((String(stamp.getUTCSeconds()).length==2)?(stamp.getUTCSeconds()):"0"+(stamp.getUTCSeconds()))} xmlns="jabber:x:delay"/>;
		}
		//var description="|message|<-IN\n\n"
		//for(var varname in message)
		//{
		//	description+=varname+": "+message[varname]+"\n\n"
		//}
		//alert(description)
		
		if(message.@type="groupchat"){
			var from=message.stanza.@from.split("/")[0].toLowerCase();
			var nickname=message.stanza.@from.split("/")[1];
		}else{
			var from=message.stanza.@from.toLowerCase();
			var nickname=message.stanza.nick;
		}
		//alert("appending incoming message")
		this.chatdata.methods.appendMessage(from,message.stanza);
		/*if(!this.chats.tabs[from])
		{
			//WE USE TO BUILD ONLY NON-MUC CONTAINERS HERE - MUC CONTAINERS BUILT THROUGH PRESENCE EXCHANGES
			this.chats.tabs[from]=
			{
				type:	"chat",
				topic:	"",
				title:	"",
				id:		from,
				blink:	true,
				Messages:		new Array(),
				MessagesToRead:	new Array()
			}
			this.chatwindows.addTab(from);
		}
		if(message.stanza.subject)
		{
			this.chats.tabs[from].topic=String(message.stanza.subject);
			this.chatwindows.updateTab(from);
		}
		if(message.stanza.nick)
		{
			this.chats.tabs[from].nickname=message.stanza.nick;
			this.chatwindows.updateTab(from);
		}*/
		/*if(this.chats.tabs[from].type=="chat")
		{
			this.chats.tabs[from].MessagesToRead.push
			(
				{
					"sender"	:	1,		//0 -> you sent this message, 1-> he sent this message
					"stanza"	:	message.stanza,
					"timestamp"	:	(parseInt(message.stanza..@stamp)>0)?(ST_parseInt(Date.UTC(message.stanza..@stamp.substring(0,4), message.stanza..@stamp.substring(4,6), message.stanza..@stamp.substring(6,8), message.stanza..@stamp.substring(9,11), message.stanza..@stamp.substring(12,14), message.stanza..@stamp.substring(15,17)))):(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())
					//,
					//"body"		:	XML("<message><body/></message>").body,
					//"topic"		:	XML("<message><topic/></message>").topic						//TOPIC O TITLE? :\
				}
			);
		}
		else
		{
			this.chats.tabs[from].MessagesToRead.push
			(
				{
					"sender"	:	nickname,
					"stanza"	:	message.stanza,
					"timestamp"	:	(parseInt(message.stanza..@stamp)>0)?(ST_parseInt(Date.UTC(message.stanza..@stamp.substring(0,4), message.stanza..@stamp.substring(4,6), message.stanza..@stamp.substring(6,8), message.stanza..@stamp.substring(9,11), message.stanza..@stamp.substring(12,14), message.stanza..@stamp.substring(15,17)))):(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp())
					//,
					//"body"		:	XML("<message><body/></message>").body,
					//"topic"		:	XML("<message><topic/></message>").topic						//TOPIC O TITLE? :\
				}
			);
		}*/
	}catch(e){
		st_errors.adderror(
			e,
			"manageIncomingMessageEvent",
			"",
			""
		)
	}
}

XMPPConnection.prototype.manageOutgoingMessageEvent=function(message){
	try{
		if(!message.stanza..@stamp.toString().length>0){
			//alert(message.stanza..@stamp.toString())
			//SET <x stamp=''
			//<message from="_test_@conference.stogame.net/Zibibbo84" to="680EN101288@stogame.net/StOGalaxy" type="groupchat" id="_12420516565371009">
				//<body>prot</body>
				//<x stamp="20090511T15:05:43" xmlns="jabber:x:delay"/>
				//<meta account="680EN101288@stogame.net/StOGalaxy" direction="in" xmlns="http://hyperstruct.net/xmpp4moz/protocol/internal"/>
			//</message>
			var stamp=new Date(allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp());
			message.stanza.message+=<x stamp={stamp.getUTCFullYear()+""+((String(stamp.getUTCMonth()+1).length==2)?(stamp.getUTCMonth()+1):"0"+(stamp.getUTCMonth()+1))+""+((String(stamp.getUTCDate()).length==2)?(stamp.getUTCDate()):"0"+(stamp.getUTCDate()))+"T"+((String(stamp.getUTCHours()).length==2)?(stamp.getUTCHours()):"0"+(stamp.getUTCHours()))+":"+((String(stamp.getUTCMinutes()).length==2)?(stamp.getUTCMinutes()):"0"+(stamp.getUTCMinutes()))+":"+((String(stamp.getUTCSeconds()).length==2)?(stamp.getUTCSeconds()):"0"+(stamp.getUTCSeconds()))} xmlns="jabber:x:delay"/>;
		}
		/*var description="|message|->OUT\n\n"
		for(var varname in message)
		{
			description+=varname+": "+message[varname]+"\n\n"
		}
		alert(description)*/
		if(message.stanza.@type=="chat"){
			var to=message.stanza.@to.toLowerCase();
			this.chatdata.methods.appendMessage(to,message.stanza);
			/*
			if(!this.chats.tabs[to])
			{
				this.chats.tabs[to]=
				{
					type:	"chat",
					topic:	"",
					title:	"",
					id:		to,
					blink:	true,
					Messages:		new Array(),
					MessagesToRead:	new Array()
				};
			}
			if(this.chats.tabs[to].type=="chat")
			{
				//alert("message to non-muc! storing \n\n"+message.stanza)
				this.chats.tabs[to].MessagesToRead.push
				(
					{
						"sender"	:	0,		//0 -> you sent this message, 1-> he sent this message
						"stanza"	:	message.stanza,
						"timestamp"	:	allaccounts.accounts[allaccounts.accountindex[this.language][this.universe][this.ogameid]].getServerTimestamp()
						//,
						//"body"		:	XML("<message><body/></message>").body,
						//"topic"		:	XML("<message><topic/></message>").topic						//TOPIC O TITLE? :\
					}
				);
			}*/
			//ONLY FOR CHAT - GROUPCHAT RECEIVES MESSAGES BOUNCED BACK
			//BUILD CONTAINERS FOR MESSAGES IF NEEDED, OTHERWISE JUST PUSH THE MESSAGES...
		}
	}catch(e){
		st_errors.adderror(
			e,
			"manageOutgoingMessageEvent",
			"",
			""
		)
	}
}

XMPPConnection.prototype.disconnect=function(){
	try{
		XMPP.down(this.account);
	}catch(e){
		st_errors.adderror(
			e,
			"disconnect",
			"",
			""
		)
	}
}

XMPPConnection.prototype.isConnected=function(){
	try{
		return XMPP.isUp(this.account.jid);
	}catch(e){
		st_errors.adderror(
			e,
			"disconnect",
			"",
			""
		)
	}
}

XMPPConnection.prototype.getChat=function(){
	try{
		var methods=this.chatdata.methods;
		return{
			//"chatdata":				this.chatdata,	//FOR TEST PURPOSES ONLY! NOT ACCESSIBLE IN FINAL RELEASE
			"addWindow":			function(win)			{return methods.addWindow(win);			},
			"removeWindow":			function(id)			{methods.removeWindow(id);				},
			"setOpenStatus":		function(open)			{methods.setOpenStatus(open);			},
			"setActiveTab":			function(tab)			{methods.setActiveTab(tab);				},
			"openTab":				function(tab)			{methods.openTab(tab);					},
			"closeTab":				function(tab)			{methods.closeTab(tab);					},
			//"addUser":			function(tab,user)		{methods.addUser(tab,user);				},
			//"removeUser":			function(tab,user)		{methods.removeUser(tab,user);			},
			//"appendMessage":		function(tab,message)	{methods.appendMessage(tab,message);	},
			"markAsRead":			function(tab,decrement)	{methods.markAsRead(tab,decrement);		},
			"getConnectionStatus":	function()				{return methods.getConnectionStatus();	},
			"getOpenStatus":		function()				{return methods.getOpenStatus();		},
			"getTabs":				function()				{return methods.getTabs();				},
			"getActiveTab":			function()				{return methods.getActiveTab();			}
		};
	}catch(e){
		st_errors.adderror(
			e,
			"getChat",
			"",
			""
		)
	}
}

XMPPConnection.prototype.send=function(stanza,callbackfunction){
	try{
		if(this.isConnected()){
			XMPP.send(
				this.account,
				stanza,
				function(reply){callbackfunction(reply);}
			);
			return true;
		}else{
			this.checkconnection();
			return false;
		}
	}catch(e){
		st_errors.adderror(
			e,
			"send",
			"",
			""
		)
	}
}