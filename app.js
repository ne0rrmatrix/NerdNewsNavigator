const bodyParser = require('body-parser');
const path = require('node:path');

const express = require('express');

const app1 = express(); // Compliant
app1.disable('x-powered-by');
const app = express();

const Parser = require('rss-parser');

const parser = new Parser();
const fs = require('fs');

const show = [];
const showData = [];
const podcast = [];
const output = [];
const twitVideo = [];
const location = path.join(__dirname, 'public');
app1.set('view engine', 'ejs');
app1.set('views', path.join(__dirname, 'views'));
app1.use(bodyParser.urlencoded({ extended: false }));
app1.use(bodyParser.json({ type: 'application/*+json' }));
app1.use('/static', express.static(path.join(__dirname, 'public')));
app1.listen(8080);

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
      name: name.title,
      title: item.title,
      link: item.enclosure.url,
      image: feed.image.url,
      url: data,
      content: item.content,
      thumbnail: item.itunes.image,
    };
    show.push(shows);
  });
};

const loadPodcasts = async () => {
  twitVideo.forEach(async (element) => {
    await loadFeed(element.title);
  });
};

const getPodcast = async (test) => {
  output.length = 0;

  show.forEach((element) => {
    if (element.url === test) {
      output.push({
        title: element.title,
        link: element.link,
        content: element.content,
        thumbnail: element.thumbnail,
      });
    }
  });
};

const getShow = async (test2) => {
  podcast.length = 0;
  output.forEach((element) => {
    if (element.link === test2) {
      podcast.push({
        title: element.title,
        link: element.link,
        summary: element.content,
        thumbnail: element.thumbnail,
      });
    }
  });
  app1.get('/player', (req, res) => {
    res.render('pages/player', {
      podcast,
    });
  });
};
const createFile = (jsonContent) => {
  if (!fs.existsSync(`${location}/output.json`)) {
    fs.writeFile(`${location}/output.json`, jsonContent, 'utf-8', (err) => {
      if (err) {
        console.log('An error has occurred while writing JSON Object to file.');
        return console.log(err);
      }
      console.log('JSON file has been saved.');
      return err;
    });
  }
};
const readFile = () => {
  setTimeout(() => {
    if (fs.existsSync(`${location}/output.json`)) {
      fs.readFile(`${location}/output.json`, (err, data) => {
        if (err) throw err;
        const video = JSON.parse(data);
        video.forEach(async (element) => {
          twitVideo.push(element);
        });
        loadPodcasts();
      });
    }
  }, 1000);
};
const loadfile = () => {
  const twit = '[{ "title": "https://feeds.twit.tv/aaa_video_hd.xml" },{ "title": "https://feeds.twit.tv/floss_video_hd.xml" },{ "title": "https://feeds.twit.tv/hom_video_hd.xml" },{ "title": "https://feeds.twit.tv/hop_video_hd.xml" },{ "title": "https://feeds.twit.tv/howin_video_hd.xml" },{ "title": "https://feeds.twit.tv/ipad_video_hd.xml" },{ "title": "https://feeds.twit.tv/mbw_video_hd.xml" },{ "title": "https://feeds.twit.tv/sn_video_hd.xml" },{ "title": "https://feeds.twit.tv/ttg_video_hd.xml" },{ "title": "https://feeds.twit.tv/tnw_video_hd.xml" },{ "title": "https://feeds.twit.tv/twiet_video_hd.xml" },{ "title": "https://feeds.twit.tv/twig_video_hd.xml" },{ "title": "https://feeds.twit.tv/twit_video_hd.xml" },{ "title": "https://feeds.twit.tv/events_video_hd.xml" },{ "title": "https://feeds.twit.tv/specials_video_hd.xml" },{ "title": "https://feeds.twit.tv/bits_video_hd.xml" },{ "title": "https://feeds.twit.tv/throwback_video_large.xml" },{ "title": "https://feeds.twit.tv/leo_video_hd.xml" },{ "title": "https://feeds.twit.tv/ant_video_hd.xml" },{ "title": "https://feeds.twit.tv/jason_video_hd.xml" },{ "title": "https://feeds.twit.tv/mikah_video_hd.xml" }]';
  //* parse json
  const jsonObj = JSON.parse(twit);

  //* stringify JSON Object
  const jsonContent = JSON.stringify(jsonObj);

  createFile(jsonContent);
  readFile();
};

loadfile();

const appSetPodcast = (test) => {
  app1.get('/show', async (request, res) => {
    res.render('pages/show', {
      output,
      test,
    });
  });
};

const appGetPodcast = async (test) => {
  await getPodcast(test);
  appSetPodcast(test);
};

app1.post('/', async (req, res) => {
  const test = req.body.podcast;
  const test2 = req.body.show;

  if (req.body.podcast) {
    await appGetPodcast(test);
    res.end('yes');
  }

  if (req.body.show) {
    await getShow(test2);
    res.end('yes');
  }
});

app1.get('/', async (req, res) => {
  res.render('pages/index', {
    showData,
  });
});

app1.get('/Live', (req, res) => {
  res.render('pages/Live', {});
});

console.log('Server is listening on port 8080');
