const totalPages = parseInt(document.getElementById('pagination').dataset.totalPages);

function goToPage() {
    const page = parseInt(document.getElementById('goPage').value);
    if (page && page >= 1 && page <= totalPages) {
        window.location.href = '?page=' + page;
    } else {
        alert("Vui lòng nhập số trang hợp lệ!");
    }
}