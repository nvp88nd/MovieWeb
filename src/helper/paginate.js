module.exports = async function paginate(model, page = 1, limit = 24, options = {}) {
    const offset = (page - 1) * limit;

    const { count, rows } = await model.findAndCountAll({
        ...options,
        limit,
        offset,
        distinct: true
    });

    const totalPages = Math.ceil(count / limit);

    function getPageNumbers(current, total) {
        const pages = [];

        if (total < 3) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        }
        else {
            if (current > 1 && current < total) {
                pages.push(current - 1);
                pages.push(current);
                pages.push(current + 1);
            } else if (current === 1) {
                pages.push(current);
                pages.push(current + 1);
            } else if (current === total) {
                pages.push(current - 1);
                pages.push(current);
            }
        }

        return pages;
    }


    return {
        rows,
        count,
        totalPages,
        pages: getPageNumbers(page, totalPages),
        currentPage: page
    };
};
