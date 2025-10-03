const { where } = require('sequelize');
const db = require('../models');
const axios = require('axios');
const movieService = require('./movie');

exports.syncEpisodes = async (slug, movieId) => {
    const detailUrl = `https://ophim1.com/phim/${slug}`;
    try {
        const response = await axios.get(detailUrl);
        let totalEpisodes = 0;
        const episodesData = response.data.episodes;

        // Đồng bộ thể loại, quốc gia
        await movieService.updateMovieV2(movieId, response.data.movie);

        // Đồng bộ tập phim
        for (const server of episodesData) {
            const serverName = server.server_name || 'Unknown Server';
            for (const ep of server.server_data) {
                await db.Episode.findOrCreate({
                    where: {
                        movie_id: movieId,
                        server_name: serverName,
                        episode_name: ep.name
                    },
                    defaults: {
                        video_url: ep.link_embed || '',
                    }
                });
                totalEpisodes++;
            }
        }
        return totalEpisodes;
    } catch (error) {
        console.error('Lỗi đồng bộ tập phim:', error);
    }
}

exports.syncMovieEpisodes = async (movieId, req, res) => {
    try {
        const movie = await db.Movie.findByPk(movieId);
        if (!movie) {
            req.flash('error_msg', 'Phim không tồn tại hoặc chưa được thêm');
            return res.redirect('/admin/movies');
        }

        const episodes = await this.syncEpisodes(movie.slug, movie.id);

        if (episodes) {
            req.flash('success_msg', 'Đồng bộ tập phim thành công');
        } else {
            req.flash('error_msg', 'Đồng bộ tập phim thất bại');
        }

        return res.redirect('/admin/' + movie.id + '/episode');
    } catch (error) {
        req.flash('error_msg', error.message || 'Lỗi khi đồng bộ tập phim');
        return res.redirect('/admin/' + movieId + '/episode');
    }
}

exports.checkMovieExist = async (slug) => {
    return await db.Movie.findOne({ where: { slug: slug } });
}

exports.syncAllMovies = async () => {
    try {
        const movies = await db.Movie.findAll({ attributes: ['slug', 'id'] });
        for (const movie of movies) {
            await this.syncEpisodes(movie.slug, movie.id);
        }
        console.log('✅ Đã đồng bộ hóa tất cả phim.');
        return true;
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ hóa tất cả phim:', error.message);
        return false;
    }
}