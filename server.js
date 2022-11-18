const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const Parser = require('rss-parser');

const parser = new Parser();

const path = require('node:path');
const { title } = require('node:process');

const fullPath = path.join(__dirname, '/views/');
const show = [];
// eslint-disable-next-line prefer-const
let showData = [];
// eslint-disable-next-line prefer-const
let podcast = [];
const twitVideo = [
  { title: 'https://feeds.twit.tv/aaa_video_hd.xml' },
  { title: 'https://feeds.twit.tv/floss_video_hd.xml' },
  { title: 'https://feeds.twit.tv/hom_video_hd.xml' },
  { title: 'https://feeds.twit.tv/hop_video_hd.xml' },
  { title: 'https://feeds.twit.tv/howin_video_hd.xml' },
  { title: 'https://feeds.twit.tv/ipad_video_hd.xml' },
  { title: 'https://feeds.twit.tv/mbw_video_hd.xml' },
  { title: 'https://feeds.twit.tv/sn_video_hd.xml' },
  { title: 'https://feeds.twit.tv/ttg_video_hd.xml' },
  { title: 'https://feeds.twit.tv/tnw_video_hd.xml' },
  { title: 'https://feeds.twit.tv/twiet_video_hd.xml' },
  { title: 'https://feeds.twit.tv/twig_video_hd.xml' },
  { title: 'https://feeds.twit.tv/twit_video_hd.xml' },
  { title: 'https://feeds.twit.tv/events_video_hd.xml' },
  { title: 'https://feeds.twit.tv/specials_video_hd.xml' },
  { title: 'https://feeds.twit.tv/bits_video_hd.xml' },
  { title: 'https://feeds.twit.tv/throwback_video_large.xml' },
  { title: 'https://feeds.twit.tv/leo_video_hd.xml' },
  { title: 'https://feeds.twit.tv/ant_video_hd.xml' },
  { title: 'https://feeds.twit.tv/jason_video_hd.xml' },
  { title: 'https://feeds.twit.tv/mikah_video_hd.xml' },
];

let showTitle;
const loadFeed = async (data) => {
  const feed = await parser.parseURL(data);
  const name = {};
  name.title = feed.title;
  name.summary = feed.description;
  name.artwork = feed.image.url;
  name.podcast = data;
  showData.push(name);
  feed.items.forEach((item) => {
    const shows = {
      name: name.title, title: item.title, link: item.guid, details: item.content,

    };
    show.push(shows);
  });
};

const load = async () => {
  twitVideo.forEach((element) => {
    loadFeed(element.title);
  });
};

load();
app.get('/', (req, res) => {
  res.render('pages/index', {
    showData,
  });
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(fullPath));

app.post('/', (req, res) => {
  const test = req.body.podcast;
  console.log(test);
  app.render('pages/show', {
    show,
  });
  res.end('yes');
});
app.get('/pages/show', (req, res) => {
  res.render('pages/show', {
    show,
  });
});
app.get('/player', (req, res) => {
  res.render('pages/player', {
    show,
  });
});

app.listen(8080);
console.log('Server is listening on port 8080');
