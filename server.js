let express = require('express');
let app = express();

let Parser = require('rss-parser');
let parser = new Parser();
let showTitle;
let podcast = [];
let loadFeed = async () => {
    let feed = await parser.parseURL('https://feeds.twit.tv/sn_video_hd.xml');
    console.log(feed.title + '\n');
    showTitle = feed.title;
    feed.items.forEach(item => {
        const show = {title: item.title, link: item.guid ,details: item.content}
        podcast.push(show);
      //  console.log('\n' + item.title + ':' + item.content + '\n' + item.guid)
})
}
loadFeed();
app.get('/', (req, res) => {
    res.render('pages/index', {
        showTitle,podcast
    })
})

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// about page

app.get('/player', (req, res) => {
  res.render('pages/player', {
    showTitle,podcast
  })
});

app.listen(8080);
console.log('Server is listening on port 8080');