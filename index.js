

const path = require('path');
const lib = require('./settings');
let ejs = require('ejs');




let express = require('express');
let app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page

app.use(express.static(__dirname + '/views'));
// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(80);
console.log('Server is listening on port 80');

const test = async () =>
{
    await lib.showData().then((result) => {
        
        let show = [];
        result.forEach(item => {
          let data = {};
          data.title = item.title;
          data.url = item.url;
          show.push(data)
        })
        app.get('/', function(req, res) {
            res.render('pages/index',{show,});
          });
    }) 
}

test();