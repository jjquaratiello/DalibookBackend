const express = require('express');
const axios = require('axios');
const YouTubeVideo = require("../models/YoutubeVideo");
const router = express.Router();


const YOUTUBE_API_KEY = 'AIzaSyAbro2pr1tKNl-WVEzUbIuB5f7BYTJ2F0Y';

router.post('/fetch-videos', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required.' });
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 50,
        q: query,
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
    });

    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      query, // Save the query associated with the video
    }));

    for (const video of videos) {
      await YouTubeVideo.updateOne(
        { videoId: video.videoId }, 
        { $set: video },
        { upsert: true } 
      );
    }

    res.status(200).json({ message: `Videos for query "${query}" fetched and stored successfully.` });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos.', error });
  }
});



router.get('/videos/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const videos = await YouTubeVideo.find({ query }).sort({ publishedAt: -1 }).limit(50);

    if (videos.length === 0) {
      return res.status(404).json({ message: `No videos found for query "${query}".` });
    }

    //console.log("Videos sent to frontend:", videos);
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error retrieving videos:', error);
    res.status(500).json({ message: 'Failed to retrieve videos.', error });
  }
});



module.exports = router;
