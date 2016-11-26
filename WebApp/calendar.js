/*

	Hackathon URo Challenge - Projet : CapsulProtect

*/

var events = [];

var website = {templateName:"calendar", calendarMinHour:07, calendarMaxHour:23, selectedHour:0};

var calendar = {};

calendar.addEvent = function(data)
{
	events.push(data);
}

calendar.askEvent = function(id)
{
	website.selectedHour = id;
	calendar.printTemplate({templateName:"addEvent"});
}

calendar.addEvent({hour:10, type:"drink", quantity:250, nature:"water"});
calendar.addEvent({hour:11, type:"piss", quantity:250});

calendar.getEvent = function(hour)
{
	for (var i = 0; events[i]; i++)
	{
		if (events[i].hour == hour)
		{
			return events[i];
		}
	}
}

calendar.getDay = function(dateString)
{
	var daysOfWeek = new Array('Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa');
	return daysOfWeek[new Date(dateString).getDay()];
}

calendar.getTemplate = function(data)
{
	var templateHtml = "";
	if (data.templateName == "calendar")
	{
		templateHtml += "<div id=\"calendar-month\">Novembre</div>";
		templateHtml += "<div id=\"calendar-days-text\">Me - Je - Ve - <div class=\"calendar-days-text-present\">Sa</div> - Di - Lu - Ma</div>";
		templateHtml += "<div id=\"calendar-days-number\">23 - 24 - 25 - <div class=\"calendar-days-number-present\">26</div>- 27 - 28 - 29</div>";
		templateHtml += "<div id=\"calendar-renderer\">";
		for (var i = website.calendarMinHour; i <= website.calendarMaxHour; i++)
		{
			var infos = calendar.getEvent(i);
			if (typeof infos != "undefined")
			{
				var insert = infos.hour + " - " + infos.type;
				var onclick = "calendar.viewEvent(" + i + ")";
			}
			else
			{
				var insert = "";
				var onclick = "calendar.askEvent(" + i + ")";
			}
			templateHtml += "<div class=\"calendar-renderer-line\" onclick=\"" + onclick + "\"><div class=\"calendar-renderer-line-hour\">" + i + "H</div><div class=\"calendar-renderer-line-content\">" + insert + "</div></div>";
		}
		templateHtml += "</div>";
	}
	else if (data.templateName == "addEvent")
	{
		templateHtml += "<div id=\"calendar-month\">Add Event</div>";

		templateHtml += "<select id=\"formSelector\" onchange=\"calendar.printInput()\">";
			templateHtml += "<option unselected>Choisissez votre action</option>";
			templateHtml += "<option id=\"drink\">Drink</option>";
			templateHtml += "<option id=\"piss\">Piss</option>";
		templateHtml += "</select>";
		templateHtml += "<div id=\"form\"></div>";
	}
	else if (data.templateName == "viewEvent")
	{
		var infos = calendar.getEvent(website.selectedHour);	
		templateHtml += "<div id=\"calendar-month\">View Event</div>";
		templateHtml += "A " + infos.hour + " heure";
		if (infos.kind == "drink")
		{
			templateHtml += "J'ai bu " + infos.quantity + "ml de " + infos.nature;
		}
		else if (infos.kind == "piss")
		{
			templateHtml += "J'ai uriné " + infos.quantity + "ml";
		}
		templateHtml += "<div onclick=\"calendar.printTemplate({'templateName':'calendar'})\">Revenir au Calendrier</div>";
	}
	website.templateName = data.templateName;
	return templateHtml;
}

calendar.viewEvent = function(id)
{
	website.selectedHour = id;
	calendar.printTemplate({templateName:"viewEvent"});
}

calendar.printInput = function()
{
	var e = document.getElementById("formSelector");
	var form = e.options[e.selectedIndex].id;
	console.log(form);
	var formHtml = "";
	if (form == "piss")
	{
		formHtml += "Je viens d'aller uriner";
		formHtml += "<input id=\"kind\" style=\"display:none\" value=\"piss\"/>";
		formHtml += "J'ai uriné <input  id=\"quantity\" value=\"\"> ml";
	}
	else if (form == "drink")
	{
		formHtml += "Je viens de boire";
		formHtml += "<input id=\"kind\" style=\"display:none\" value=\"drink\"/>";

		formHtml += "J'ai bu <input id=\"quantity\" value=\"\"> ml de <input id=\"nature\" value=\"\">";
	}
	formHtml += "<div onclick=\"calendar.recordEvent()\">Enregistrer</div>";
	document.getElementById("form").innerHTML = formHtml;
}

calendar.recordEvent = function()
{
	//alert("enregistrement");
	var type = document.getElementById("kind").value;
	var quantity = document.getElementById("quantity").value;
	if (type == "drink")
	{
		var nature = document.getElementById("nature").value;
		calendar.addEvent({hour:website.selectedHour, type:"drink", quantity:quantity, nature:nature});
	}
	else if (type == "piss")
	{
		calendar.addEvent({hour:website.selectedHour, type:"piss", quantity:quantity});
	}
	calendar.printTemplate({templateName:"calendar"});
}

calendar.printTemplate = function(data)
{
	var calendarCorpse = calendar.getTemplate(data);
	document.getElementById("main").innerHTML = calendarCorpse;
}

calendar.start = function()
{
	calendar.printTemplate({templateName:website.templateName});
}

function init()
{
	document.write("<div id=\"main\"></div>");
	calendar.start();
}

init();