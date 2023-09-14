const axios = require('axios');
const config = require('../config/config.js');

async function searchMedia(req, res) {
    const { title } = req.query || {};

    try {
        if (title) {
            const apiRes = await axios.get(`http://www.omdbapi.com/?s=${title}&apikey=${config.OMDB_API_KEY}`);

            if (apiRes.data.Response === 'True') {
                return res.json(apiRes.data.Search.map(item => {
                    return {
                        Title: item.Title,
                        Year: item.Year,
                        ExternalID: item.imdbID,
                        Type: item.Type,
                        Image: item.Poster
                    }
                }));
            }
        }

    } catch (error) {
        //console.log(error);
    }

    return res.json([]);
}

async function getMedia(req, res) {
    var movie = {}
    const externalID = req.params.id;

    try {
        if (externalID) {
            var apiRes = await axios.get(`http://www.omdbapi.com/?i=${externalID}&apikey=${config.OMDB_API_KEY}`);
            if (apiRes.data.Response === 'True') {
                movie = apiRes.data;

                return res.json(
                    {
                        Title: movie.Title,
                        Year: movie.Year,
                        Genre: movie.Genre,
                        Director: movie.Director,
                        Writer: movie.Writer,
                        Actors: movie.Actors,
                        Description: movie.Plot,
                        Image: movie.Poster,
                        ExternalID: movie.imdbID,
                        Type: movie.Type,
                        Seasons: movie.totalSeasons
                    }
                );
            }
        }
    } catch (error) {
        //console.log(error);
    }

    return res.json({});
}

module.exports = { searchMedia, getMedia };