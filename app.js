/* eslint-disable no-use-before-define */
const express = require('express');
const { pRateLimit } = require('p-ratelimit');

const ffmpegPath = ('./node_modules/ffmpeg-static/ffmpeg.exe');

const fs = require('fs');
const genThumbnail = require('simple-thumbnail');

const app = express();
const bodyParser = require('body-parser');

const Parser = require('rss-parser');

const parser = new Parser();

const path = require('node:path');

const limit = pRateLimit({
  interval: 1000, // 1000 ms == 1 second
  rate: 30, // 30 API calls per interval
  concurrency: 20, // no more than 10 running at once
  maxDelay: 1200000, // an API call delayed > 2 sec is rejected
});

const show = [];
// eslint-disable-next-line prefer-const
let showData = [];
// eslint-disable-next-line prefer-const
let podcast = [];
// eslint-disable-next-line prefer-const
let output = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.listen(8080);

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

  let artwork = getFilenameFromUrl(feed.image.url);
  artwork = path.parse(artwork).name;
  artwork = `${artwork.toString()}.jpg`;

  const files = `/static/cache/album_art/${artwork}`;

  name.artwork = files;
  name.podcast = data;

  showData.push(name);

  feed.items.forEach(async (item) => {
    const shows = {
      name: name.title,
      title: item.title,
      link: item.guid,
      image: artwork,
      url: data,
      content: item.content,
    };
    show.push(shows);
  });

  await setData(feed);
};

const setData = async (feed) => {
  feed.items.forEach(async (item) => {
    if (item.guid.includes('http')) {
      let result = getFilenameFromUrl(item.guid);
      result = path.parse(result).name;
      result = `${result.toString()}.jpg`;
      const file = `./public/cache/${result}`;
      await createThumbnails(item, file, result);
    }
  });
};

const loadData = async () => {
  twitVideo.forEach(async (element) => {
    await loadFeed(element.title);
  });
};

const createThumbnails = async (item, file, result) => {
  try {
    if (!fs.existsSync(file)) {
      await limit(() => genThumbnail(item.guid, `./public/cache/${result}`, '1110x?', {
        vf: 'select=gt(scene\\,0.5)', seek: '00:03.15', path: ffmpegPath,
      }));
    }
  } catch (error) {
    console.log(error);
  }
};

loadData();

app.get('/', (req, res) => {
  res.render('pages/index', {
    showData,
  });
});

app.get('/Live', (req, res) => {
  res.render('pages/Live', {
  });
});

app.post('/', async (req, res) => {
  const test = req.body.podcast;

  const test2 = req.body.show;
  if (req.body.podcast) {
    getPodcast(test);
  }
  if (req.body.show) {
    getShow(test2);
  }

  res.end('yes');
});

console.log('Server is listening on port 8080');
const getPodcast = (test) => {
  output.length = 0;

  show.forEach((element) => {
    if (element.url === test) {
      let result = getFilenameFromUrl(element.link);
      result = path.parse(result).name;
      result = `${result.toString()}.jpg`;
      output.push({
        title: element.title,
        link: element.link,
        webm: result,
        content: element.content,
      });
    }
  });

  app.get('/show', (request, response) => {
    response.render('pages/show', {
      output, test,
    });
  });
};

const getShow = (test2) => {
  podcast.length = 0;
  console.log(test2);

  output.forEach((element) => {
    if (element.link === test2) {
      let result = getFilenameFromUrl(element.link);
      result = path.parse(result).name;
      result = `${result.toString()}.jpg`;
      podcast.push({
        title: element.title,
        link: element.link,
        webm: result,
        summary: element.content,
      });
    }
  });

  app.get('/player', (reqs, rese) => {
    rese.render('pages/player', {
      podcast,
    });
  });
};

function getFilenameFromUrl(url) {
  const { pathname } = new URL(url);
  const index = pathname.lastIndexOf('/');
  return pathname.substring(index + 1); // if index === -1 then index+1 will be 0
}
