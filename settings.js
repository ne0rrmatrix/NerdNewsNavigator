const { url } = require('inspector');
let Parser = require('rss-parser');
let parser = new Parser();

class Podcast {
    constructor(title, URL) {
        this.title = title;
        this.URL = URL;
    }
    gettitle() {
        return this.title;
    }
    getURL() {
        return this.URL;
    }
    
    
    settitle(title)
    {
        this.title.push(title);
    }
    setURL(URL){
        this.URL.push(URL);
    }
    
}

class Show {
    constructor(title,URL) {
        this.title = title;
        this.URL = URL;

    }
    gettitle() {
        return this.title;
    }
    getURL() {
        return this.URL;
    }
    settitle(title)
    {
        this.title = title;
    }
    setURL(URL)
    {
        this.URL = URL;
    }
}
const getDataFromURL = async (podcast) =>
{
    let url = podcast.getURL();
    let feed = await parser.parseURL(url);
    let list = [];
    return new Promise((resolve,reject) => {
        feed.items.forEach(item => {
            let show = new Show();
           show.settitle(item.title);
           show.setURL(item.guid);
           list.push(show);
        })
        resolve(list)
    })
}
const createPodcasts = async () =>
{
    let list = [];
    const securityNow = new Podcast('Security Now','https://feeds.twit.tv/sn_video_hd.xml' );
    const thisWeekInGoogle = new Podcast('Twig','https://feeds.twit.tv/twig_video_hd.xml')
    list.push(securityNow);
    list.push(thisWeekInGoogle)
    return list;
}
const showData = async () =>
{
   
    let data = []
    const podcast = await createPodcasts();
    for (const element of podcast)
    {
        let result = await getDataFromURL(element)
        for (const item of result)
        {
             data.push({title: item.gettitle(), url: item.getURL()})
        }
    }
   return data;
}
module.exports = { getDataFromURL,createPodcasts,showData,Podcast,Show };