const axios = require('axios');
const db = require('../models');

async function syncEpisodes(movieSlug) {
    const detailUrl = `https://ophim1.com/phim/${movieSlug}`;
    try {
        const response = await axios.get(detailUrl);
        const movieData = response.data;

        if (!movieData.movie || !movieData.episodes) {
            console.error(`Không tìm thấy tập phim cho bộ phim: ${movieSlug}`);
            return;
        }

        const movieInfo = movieData.movie;

        const [movie] = await db.Movie.findOrCreate({
            where: { slug: movieSlug },
            defaults: {
                title: movieInfo.name,
                origin_name: movieInfo.origin_name,
                year: movieInfo.year || null,
                thumb_url: movieInfo.thumb_url || '',
                poster_url: movieInfo.poster_url || '',
                description: movieInfo.content || '',
                status: movieInfo.status || ''
            }
        });

        let totalEpisodes = 0;

        for (const server of movieData.episodes) {
            const serverName = server.server_name || 'Unknown Server';
            for (const ep of server.server_data) {
                await db.Episode.findOrCreate({
                    where: {
                        movie_id: movie.id,
                        server_name: serverName,
                        episode_name: ep.name,
                    },
                    defaults: {
                        video_url: ep.link_embed || '',
                    }
                });
                totalEpisodes++;
            }
            await db.Movie.update(
                { updated_at: new Date() },
                { where: { id: movie.id } }
            );
        }

        console.log(`✅ Đã đồng bộ hóa ${totalEpisodes} tập phim.`);
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ hóa tập phim:', error.message);
    }
}

//syncEpisodes('knock-out'); 

async function syncAllMovies() {
    try {
        const movies = await db.Movie.findAll({ attributes: ['slug'] });
        for (const movie of movies) {
            await syncEpisodes(movie.slug);
        }
        console.log('✅ Đã đồng bộ hóa tất cả phim.');
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ hóa tất cả phim:', error.message);
    }
}

module.exports = {
    syncEpisodes,
    syncAllMovies
};