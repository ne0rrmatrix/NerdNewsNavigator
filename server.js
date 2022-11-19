const express = require('express');
const jsdom = require('jsdom');
const ffmpeg = require('ffmpeg-static');

const ffmpegPath = ('./node_modules/ffmpeg-static/ffmpeg.exe');

const dom = new jsdom.JSDOM('');
const jquery = require('jquery')(dom.window);
const fs = require('fs');
const genThumbnail = require('simple-thumbnail');

const app = express();
const bodyParser = require('body-parser');

const Parser = require('rss-parser');

const parser = new Parser();

const path = require('node:path');
const { title } = require('node:process');
const { verify } = require('crypto');

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

const getMetaData = async (data) => {
  let i = 0;
  const feed = await parser.parseURL(data);
  feed.items.forEach(async (item) => {
    if (item.guid.includes('.mp4')) {
      const str = String(item.title);
      const result = str.split(' ')[0] + i;

      await genThumbnail(item.guid, `./views/${result}.jpg`, '540x?', {
        vf: 'select=gt(scene\\,0.5)', seek: '00:00.15', path: ffmpegPath,
      })
        .then(async () => {
          setTimeout(() => {
            console.log(item.guid);
            console.log('done');
            i += 1;
          });
        });
    }
  });
};
const loadMetaData = async () => {
  twitVideo.forEach((element) => {
    getMetaData(element.title);
  });
};
const loadFeed = async (data) => {
  const feed = await parser.parseURL(data);
  const name = {};
  name.title = feed.title;
  name.summary = feed.description;
  name.artwork = feed.image.url;
  name.podcast = data;
  showData.push(name);
  feed.items.forEach(async (item) => {
    const shows = {
      // eslint-disable-next-line max-len
      name: name.title, title: item.title, link: item.guid, image: feed.image.url, url: data,
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
loadMetaData();
app.get('/', (req, res) => {
  res.render('pages/index', {
    showData,
  });
});
// eslint-disable-next-line prefer-const
let output = [];
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(fullPath));
let test;
app.post('/', async (req, res) => {
  test = req.body.podcast;
  show.forEach(async (element) => {
    if (element.url === test) {
      console.log(element.link);
      output.push({
        // eslint-disable-next-line max-len, object-shorthand
        name: element.name, title: element.title, link: element.link, image: element.image, url: element.url, webm: element.webm,
      });
    }
  });

  app.get('/pages/show', (request, response) => {
    response.render('pages/show', {
      output, test,
    });
  });
  res.end('yes');
});

app.get('/player', (req, res) => {
  res.render('pages/player', {
    show,
  });
});

app.listen(8080);
console.log('Server is listening on port 8080');
