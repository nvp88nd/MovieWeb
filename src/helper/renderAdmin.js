
function renderAdmin(res, view, options = {}) {
    res.render(view, { ...options, layout: false }, (err, html) => {
        if (err) throw err;
        res.render('layouts/admin-layout', { ...options, body: html, layout: false });
    });
}

module.exports = renderAdmin;
