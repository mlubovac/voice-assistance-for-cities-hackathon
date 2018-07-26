const axios = require('axios')

module.exports = async (location) => {
    const response = await axios({
        method: 'get',
        url: 'https://query.yahooapis.com/v1/public/yql',
        params: {
            format: 'json',
            q: `select * from geo.places where text="${location}"`
        }
    })

    return response.data.query.results.place.centroid
}