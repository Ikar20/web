const express=require('express');
const path = require('path');
const app=express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
app.use(express.json())

function saveToModgoDB(object, collection_name) {
  dbo.collection(collection_name).insertOne(object, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
}


app.post("/addNews", function(req, res){
	news_obj = {
		img: req.body.imgSrc,
      title: req.body.newsTitle,
      text: req.body.newsBody,
	}
  MongoClient.connect(url, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("mydb");
	    dbo.collection("news").insertOne(news_obj, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted");
	 	});
	 res.send(news_obj);
	db.close();
  });

});

app.post("/addAppeal", function(req, res){
	appeal_obj = {
		text: req.body.text,
      date: req.body.date,
      time: req.body.time,
      author: req.body.author
	}
  MongoClient.connect(url, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db("mydb");
	    dbo.collection("appeals").insertOne(appeal_obj, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted");
	 	});
	 res.send(appeal_obj);
	db.close();
  });

});


app.get('/fans_appeal.html', (req, res) => {
    const htmlFile = req.url.slice(1);
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("appeals").find().toArray((err, items) => {
        res.render("fans_appeal", {
	      appeals: items,
	    });
      });
      db.close();
    });
    
})

app.get('/news.html', (req, res) => {
    const htmlFile = req.url.slice(1);
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("news").find().toArray((err, items) => {
      	console.log(items);
        res.render("news", {
          news: items
        });
      });
      db.close();
    });
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
})

app.get('/*', (req, res) => {
  if(req.url.endsWith('.html')) {
    const htmlFile = req.url.slice(1);
    res.sendFile(path.join(__dirname, './'+htmlFile));
  }
  else {
    res.sendFile(path.join(__dirname, './error.html'));
  }
})


const port =8080;
app.listen(port,()=>{
console.log(`App running on ${port}`);
}) 
