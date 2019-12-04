var src;
var img = document.getElementById("imgPreview");
function addImg(files){
	var reader = new FileReader();
	reader.onload = function(){
		src = reader.result;
		img.src = src;

	};
	reader.readAsDataURL(files[0]);

}

function addNewsFromForm(){
	var newsTitle = document.getElementById("newsTitle").value.trim();
	var newsBody = document.getElementById("newsBody").value.trim();
	if(newsTitle == undefined || newsTitle == "" || newsBody == undefined || newsBody == "" || src == undefined){
		alert("Please, enter valid input");
		return;
	}

	news = {
		imgSrc: img.src,
		newsTitle: newsTitle,
		newsBody: newsBody
	}
	dataProvider.addNew("news", JSON.stringify(news));

	document.getElementById("newsTitle").value = "";
	document.getElementById("newsBody").value = "";
	img.src = "./assets/imgs/empty.jpg";
	src = undefined;
	alert("News added");
}

function showNews(existingNews = false){
	if (!existingNews){
		var existingNews = dataProvider.getExisting("news");
	}
	for (news in existingNews){
		news = JSON.parse(existingNews[news]);

		var newDiv = document.createElement("div");
		newDiv.className = "col-12 col-md-4 col-lg-3";

		var img = document.createElement('img');
		img.className = "img-fluid  new-img";
		img.src = news.imgSrc;

		var h4 = document.createElement("h4");
		h4.className = "h4";
		h4.innerHTML = news.newsTitle;

		newDiv.appendChild(img);
		newDiv.appendChild(h4);
		newDiv.appendChild(document.createTextNode(news.newsBody));

		var parent = document.getElementById("container");
		parent.appendChild(newDiv);
	}
}
