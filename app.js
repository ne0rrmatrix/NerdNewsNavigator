/* eslint-disable no-use-before-define */
const express = require('express');
const jsdom = require('jsdom');
const ffmpeg = require('ffmpeg-static');
const https = require('https');

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

const fullPath = path.join(__dirname, '/views/');

const show = [];
// eslint-disable-next-line prefer-const
let showData = [];
// eslint-disable-next-line prefer-const
let podcast = [];
// eslint-disable-next-line prefer-const
let output = [];
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
      name: name.title, title: item.title, link: item.guid, image: feed.image.url, url: data,
    };
    show.push(shows);
  });
  feed.items.forEach(async (item) => {
    if (item.guid.includes('http')) {
      let result = getFilenameFromUrl(item.guid);
      result = path.parse(result).name;
      result = `${result.toString()}.jpg`;
      const file = `./views/pages/cache/${result}`;
      if (fs.existsSync(file)) {
        console.log(`thumbnail ${file} file exists`);
      } else {
        try {
          console.log(`Generating thumbmail for ${item.guid}`);
          await genThumbnail(item.guid, `./views/pages/cache/${result}`, '540x?', {
            vf: 'select=gt(scene\\,0.5)', seek: '00:01.15', path: ffmpegPath,
          });
          console.log(`Generated thumbnail for ${item.guid}`);
        } catch (error) {
          console.log(`error generating thumbnail for ${item.guid}`);
        }
      }
    }
  });
  console.log('Done Generating thumbnails!');
};
/*
process.on('uncaughtException', (e) => {
  console.log(`Uncaught Exception: ${e.message}`);
  process.exit(1);
});
*/
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
// eslint-disable-next-line prefer-const

app.set('view engine', 'ejs');

app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(fullPath));

app.post('/', async (req, res) => {
  const test = req.body.podcast;

  const test2 = req.body.show;

  if (req.body.podcast) {
    output.length = 0;
    show.forEach((element) => {
      if (element.url === test) {
        let result = getFilenameFromUrl(element.link);
        result = path.parse(result).name;
        result = `${result.toString()}.jpg`;
        output.push({
          // eslint-disable-next-line max-len, object-shorthand
          name: element.name, title: element.title, link: element.link, image: element.image, url: element.url, webm: result, show: element.guid,
        });
      }
    });
    app.get('/pages/show', (request, response) => {
      response.render('pages/show', {
        output, test,
      });
    });
  }
  if (req.body.show) {
    podcast.length = 0;
    console.log(test2);
    output.forEach((element) => {
      if (element.link === test2) {
        let result = getFilenameFromUrl(element.link);
        result = path.parse(result).name;
        result = `${result.toString()}.jpg`;
        podcast.push({
          // eslint-disable-next-line max-len, object-shorthand
          name: element.name, title: element.title, link: element.link, image: element.image, url: element.url, webm: result, show: element.show,
        });
      }
    });
    app.get('/pages/player', (reqs, rese) => {
      rese.render('pages/player', {
        podcast,
      });
      console.log(podcast);
    });
  }

  res.end('yes');
});

app.listen(8080);
console.log('Server is listening on port 8080');

async function checkUrlExists(url) {
  const domain = (new URL(url));
  try {
    https.get(domain, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request failed.\n'
                          + 'Status Code: $(statusCode)');
        console.log(error.message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function getFilenameFromUrl(url) {
  const { pathname } = new URL(url);
  const index = pathname.lastIndexOf('/');
  return pathname.substring(index + 1); // if index === -1 then index+1 will be 0
}
