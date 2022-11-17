const express = require('express')
const app = express()
const Parser = require('rss-parser')
const parser = new Parser()

const feeds = () => {
  const twitFeedsVideo = [
    { AllAboutAndroid: 'https://feeds.twit.tv/aaa_video_hd.xml' },
    { FlossWeekly: 'https://feeds.twit.tv/floss_video_hd.xml' },
    { HandsOnMac: 'https://feeds.twit.tv/hom_video_hd.xml' },
    { HandsOnPhotography: 'https://feeds.twit.tv/hop_video_hd.xml' },
    { HandsOnWindows: 'https://feeds.twit.tv/howin_video_hd.xml' },
    { IosToday: 'https://feeds.twit.tv/ipad_video_hd.xml' },
    { MackBreakWeekly: 'https://feeds.twit.tv/mbw_video_hd.xml' },
    { SecurityNow: 'https://feeds.twit.tv/sn_video_hd.xml' },
    { TheTEchGuy: 'https://feeds.twit.tv/ttg_video_hd.xml' },
    { TechNewsWeekly: 'https://feeds.twit.tv/tnw_video_hd.xml' },
    { ThisWeekInEnterpriseTech: 'https://feeds.twit.tv/twiet_video_hd.xml' },
    { ThisWeekInGoogle: 'https://feeds.twit.tv/twig_video_hd.xml' },
    { ThisWeekInTech: 'https://feeds.twit.tv/twit_video_hd.xml' },
    { TwitEvents: 'https://feeds.twit.tv/events_video_hd.xml' },
    { TwitNews: 'https://feeds.twit.tv/specials_video_hd.xml' },
    { TechBreak: 'https://feeds.twit.tv/bits_video_hd.xml' },
    { TwitThrowBack: 'https://feeds.twit.tv/throwback_video_large.xml' },
    { TotalLeo: 'https://feeds.twit.tv/leo_video_hd.xml' },
    { TotalAnt: 'https://feeds.twit.tv/ant_video_hd.xml' },
    { TotalJason: 'https://feeds.twit.tv/jason_video_hd.xml' },
    { TotalMikah: 'https://feeds.twit.tv/mikah_video_hd.xml' }
  ]
  return twitFeedsVideo
}

const LoadData = () => {
  const data = feeds()
  data.forEach(element => {
    Object.keys(element).forEach(function (key) {
      // console.log(element[key])
      loadFeed(element[key])
    })
  })
}
const showData = []
let showTitle
const podcast = []
const loadFeed = async (data) => {
  const feed = await parser.parseURL(data)
  //* console.log(feed.title + '\n')
  showTitle = feed.title
  showData.push({ title: feed.title }, { summary: feed.summary })
  feed.items.forEach(item => {
    const show = { title: item.title, link: item.guid, details: item.content }
    podcast.push(show)
    //  console.log('\n' + item.title + ':' + item.content + '\n' + item.guid)
  })
}
LoadData()
app.get('/', (req, res) => {
  res.render('pages/index', {
    showTitle, podcast
  })
})

// set the view engine to ejs
app.set('view engine', 'ejs')

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
  res.render('pages/index')
})

// about page

app.get('/player', (req, res) => {
  res.render('pages/player', {
    showTitle, podcast
  })
})

app.listen(8080)
console.log('Server is listening on port 8080')
