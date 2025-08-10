
function renderWithLayout(res, view, options = {}) {
    res.render('layouts/admin-layout', {
        ...options,
        body: res.render(view, options, (err, html) => html)
    });
}

exports.dashboard = (req, res) => {
    renderWithLayout(res, 'admin/dashboard', { title: 'Admin Dashboard' });
};

exports.moviesList = (req, res) => {
    renderWithLayout(res, 'admin/movies-list', { title: 'Danh sách phim' });
};
