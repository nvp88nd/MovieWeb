module.exports.slugify = (text) => {
    return text
        .toString()
        .normalize('NFD')                   // Tách ký tự và dấu
        .replace(/[\u0300-\u036f]/g, '')     // Xóa dấu
        .toLowerCase()
        .replace(/\s+/g, '-')                // Đổi khoảng trắng thành -
        .replace(/[^a-z0-9-]/g, '')          // Xóa ký tự không hợp lệ
        .replace(/-+/g, '-')                 // Gom nhiều dấu - liên tiếp thành 1
        .replace(/^-+|-+$/g, '');            // Xóa - ở đầu và cuối
};
