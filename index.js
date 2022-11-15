let Parser = require('rss-parser');
let parser = new Parser();


let URL = 'https://feeds.twit.tv/sn_video_hd.xml';
const getURL = async () =>
{
    let feed = await parser.parseURL(URL);
    console.log(feed.title)
    let html = ''
    feed.items.forEach(item => {
       // console.log(item.title + ':' + item.link)
        html += item.description
        console.log(item.title + ': ' + item.guid)
    })

}
getURL();