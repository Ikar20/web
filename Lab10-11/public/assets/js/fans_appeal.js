function newAppeal(){
	var newAppealText = document.getElementById("newAppealText").value.trim();
	if (newAppealText === undefined || newAppealText.length == 0){
		alert("Enter valid appeal!");
		return;
	}
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var newAppeal = {
		text: newAppealText,
		date: date,
		time: time,
		author: "Jack"
	};

	var serialNewAppeal = JSON.stringify(newAppeal);
	dataProvider.addNew("appeal", serialNewAppeal);

	document.getElementById("newAppealText").value = "";
}

function showAppeals(showLast = false, existingAppeals = false){
	if (!existingAppeals){
		var existingAppeals = dataProvider.getExisting("appeal");
	}
	if (showLast && existingAppeals.length != 0){
		existingAppeals = [existingAppeals.slice(-1)[0]];
	}
	for (appeal in existingAppeals){
		appeal = JSON.parse(existingAppeals[appeal]);
		var newDiv = document.createElement("div");
		newDiv.className = "row mt-3 p-3 appeal";
		var innerDiv1 = document.createElement("div");
		innerDiv1.className = "col-4 col-md-2 justify-content-center text-center bg-light";
		var innerDiv2 = document.createElement("div");
		innerDiv2.className = "col-8 col-md-10 bg-light";
		newDiv.appendChild(innerDiv1);
		newDiv.appendChild(innerDiv2);

		innerDiv1.appendChild(document.createTextNode(appeal.author));
		innerDiv1.appendChild(document.createElement("br"));
		innerDiv1.appendChild(document.createTextNode(appeal.date));
		innerDiv1.appendChild(document.createElement("br"));
		innerDiv1.appendChild(document.createTextNode(appeal.time));

		innerDiv2.appendChild(document.createTextNode(appeal.text));
		var parent = document.getElementById("container");
		parent.appendChild(newDiv);
	}
}

showAppeals();

function handleConnectionChange(event){
    if(event.type == "offline"){
        console.log("You lost connection.");
    }
    if(event.type == "online"){
    	var parent = document.getElementById("container");
		parent.innerHTML = "";
		showAppeals();
        console.log("You are now back online.");
        dataProvider.clearStorage("appeal");
    }
}
window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);
