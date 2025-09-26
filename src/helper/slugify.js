// module.exports.slugify = (text) => {
//     return text
//         .toString()
//         .normalize('NFD')                   // Tách ký tự và dấu
//         .replace(/[\u0300-\u036f]/g, '')     // Xóa dấu
//         .toLowerCase()
//         .replace(/\s+/g, '-')                // Đổi khoảng trắng thành -
//         .replace(/[^a-z0-9-]/g, '')          // Xóa ký tự không hợp lệ
//         .replace(/-+/g, '-')                 // Gom nhiều dấu - liên tiếp thành 1
//         .replace(/^-+|-+$/g, '');            // Xóa - ở đầu và cuối
// };
module.exports.slugify = (text) => {
    return text
        .toString()
        .normalize('NFD')                   // Tách ký tự và dấu
        .replace(/[\u0300-\u036f]/g, '')    // Xóa dấu (sắc, huyền, hỏi, ngã, nặng)
        .replace(/đ/g, 'd')                 // đ → d
        .replace(/Đ/g, 'd')                 // Đ → d
        .replace(/ß/g, 'ss')                // ß → ss
        .replace(/[^a-zA-Z0-9\s-]/g, '')    // Xóa ký tự không hợp lệ (giữ chữ, số, khoảng trắng, -)
        .toLowerCase()
        .replace(/\s+/g, '-')               // Khoảng trắng → -
        .replace(/-+/g, '-')                // Gom nhiều dấu - liên tiếp thành 1
        .replace(/^-+|-+$/g, '');           // Xóa - ở đầu/cuối
};
