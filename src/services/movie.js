const db = require('../models');

exports.getAllMovies = async () => {
    return await db.Movie.findAll();
};

exports.getMovieById = async (id) => {
    return await db.Movie.findByPk(id);
};

exports.crawlMovie = async (movieData) => {
    try {
        // 1. Lưu thông tin phim
        const [movie, created] = await db.Movie.findOrCreate({
            where: { slug: movieData.slug },
            defaults: {
                title: movieData.name,
                origin_name: movieData.origin_name,
                year: movieData.year || null,
                thumb_url: movieData.thumb_url || '',
                poster_url: movieData.poster_url || '',
                description: movieData.content || '',
                status: movieData.status || ''
            }
        });

        // 2. Lưu thể loại
        if (Array.isArray(movieData.category)) {
            for (const genre of movieData.category) {
                const [g] = await db.Genre.findOrCreate({
                    where: { slug: genre.slug },
                    defaults: { name: genre.name }
                });
                await movie.addGenre(g);
            }
        }

        // 3. Lưu quốc gia
        if (Array.isArray(movieData.country)) {
            for (const country of movieData.country) {
                const [c] = await db.Country.findOrCreate({
                    where: { slug: country.slug },
                    defaults: { name: country.name }
                });
                await movie.addCountry(c);
            }
        }
        return { movie, created };
    } catch (error) {
        throw error;
    }
}

exports.updateMovie = async (movieId, movieData) => {
    try {
        const movie = await db.Movie.findByPk(movieId, {
            include: [db.Genre, db.Country]
        });
        if (!movie) throw new Error('Movie not found');

        // 1. Cập nhật thông tin phim
        await movie.update({
            title: movieData.name,
            origin_name: movieData.origin_name,
            year: movieData.year || null,
            thumb_url: movieData.thumb_url || '',
            poster_url: movieData.poster_url || '',
            description: movieData.content || '',
            status: movieData.status || ''
        });

        // 2. Cập nhật thể loại
        if (Array.isArray(movieData.category)) {
            const currentGenreSlugs = movie.Genres.map(g => g.slug);
            const newGenreSlugs = movieData.category.map(g => g.slug);

            // Thêm genre mới
            for (const genre of movieData.category) {
                if (!currentGenreSlugs.includes(genre.slug)) {
                    const [g] = await db.Genre.findOrCreate({
                        where: { slug: genre.slug },
                        defaults: { name: genre.name }
                    });
                    await movie.addGenre(g);
                }
            }

            // Xóa genre không còn
            for (const genre of movie.Genres) {
                if (!newGenreSlugs.includes(genre.slug)) {
                    await movie.removeGenre(genre);
                }
            }
        }

        // 3. Cập nhật quốc gia
        if (Array.isArray(movieData.country)) {
            const currentCountrySlugs = movie.Countries.map(c => c.slug);
            const newCountrySlugs = movieData.country.map(c => c.slug);

            // Thêm country mới
            for (const country of movieData.country) {
                if (!currentCountrySlugs.includes(country.slug)) {
                    const [c] = await db.Country.findOrCreate({
                        where: { slug: country.slug },
                        defaults: { name: country.name }
                    });
                    await movie.addCountry(c);
                }
            }

            // Xóa country không còn
            for (const country of movie.Countries) {
                if (!newCountrySlugs.includes(country.slug)) {
                    await movie.removeCountry(country);
                }
            }
        }

        return movie;
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
}
