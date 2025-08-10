const axios = require('axios');
const db = require('../models');

async function syncGenresAndCountries() {
    try {
        for (let page = 1; page <= 50; page++) {
            const listUrl = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
            const listResponse = await axios.get(listUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            const items = listResponse.data.items || [];

            const genreSet = new Map();
            const countrySet = new Map();

            for (const item of items) {
                const slug = item.slug;
                const detailUrl = `https://ophim1.com/phim/${slug}`;

                try {
                    const detailResponse = await axios.get(detailUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });

                    const movie = detailResponse.data.movie;

                    if (Array.isArray(movie.category)) {
                        for (const genre of movie.category) {
                            genreSet.set(genre.slug, genre.name);
                        }
                    }

                    if (Array.isArray(movie.country)) {
                        for (const country of movie.country) {
                            countrySet.set(country.slug, country.name);
                        }
                    }
                } catch (detailErr) {
                    console.warn(`Lỗi khi lấy chi tiết phim ${slug}:`, detailErr.message);
                }
            }

            // Insert genres
            for (const [slug, name] of genreSet) {
                await db.Genre.findOrCreate({
                    where: { slug },
                    defaults: { name }
                });
                //console.log(`✔ Genre: ${name}`);
            }

            // Insert countries
            for (const [slug, name] of countrySet) {
                await db.Country.findOrCreate({
                    where: { slug },
                    defaults: { name }
                });
                //console.log(`✔ Country: ${name}`);
            }
        }
        console.log('✅ Đồng bộ hoàn tất!');
    } catch (error) {
        console.error('❌ Lỗi đồng bộ:', error.message);
    }
}

syncGenresAndCountries();
