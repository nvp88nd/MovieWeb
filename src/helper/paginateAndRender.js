const renderAdmin = require('../helper/renderAdmin');
const paginate = require('../helper/paginate');

module.exports = async function paginateAndRender(req, res, title, model, view, limit, { include = [], order = [] }) {
    const page = parseInt(req.query.page) || 1;

    const { rows, currentPage, totalPages, pages } = await paginate(model, page, limit, {
        include,
        order
    });

    renderAdmin(res, view, {
        title,
        [model.name.toLowerCase() + 's']: rows,
        totalPages,
        currentPage,
        pages
    });
}