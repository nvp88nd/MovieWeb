const axios = require('axios');
const db = require('../models');
const movieService = require('../services/movie');
//const slugify = require('slugify');

// Crawl và lưu 1 bộ phim theo slug
async function crawlMovie(slug) {
    const detailUrl = `https://ophim1.com/phim/${slug}`;

    try {
        const response = await axios.get(detailUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const movieData = response.data.movie;

        await movieService.crawlMovie(movieData);

        console.log(`✅ Đã crawl xong phim: ${movieData.title}`);
    } catch (err) {
        console.error('❌ Lỗi khi crawl phim:', err.message);
    }
}

async function crawlPageOneMovies() {
    const url = 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1';
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const movies = response.data.items || [];
        for (const movie of movies) {
            await crawlMovie(movie.slug);
        }
    } catch (err) {
        console.error('❌ Lỗi khi crawl trang phim:', err.message);
    }
}

crawlPageOneMovies();