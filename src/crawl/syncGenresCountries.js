const axios = require('axios');
const db = require('../models');

async function syncGenresAndCountries() {
    try {
        const response = await axios.get('https://ophim1.com/v1/api/the-loai', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = response.data.data || [];
        const genres = data.items || [];
        for (const genre of genres) {
            await db.Genre.findOrCreate({
                where: { slug: genre.slug },
                defaults: { name: genre.name }
            });
        }

        const countryResponse = await axios.get('https://ophim1.com/v1/api/quoc-gia', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data2 = countryResponse.data.data || [];
        const countries = data2.items || [];
        for (const country of countries) {
            await db.Country.findOrCreate({
                where: { slug: country.slug },
                defaults: { name: country.name }
            });
        }

        console.log('✅ Đồng bộ hoàn tất!');
    } catch (error) {
        console.error('❌ Lỗi đồng bộ:', error.message);
    }
}

syncGenresAndCountries();
