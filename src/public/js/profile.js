document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-profile').addEventListener('click', () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Chưa đăng nhập!');
            window.location.href = '/login';
            return;
        }

        fetch('/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Không thể lấy thông tin người dùng');
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = '/profile';
                }
            })
            .catch(err => {
                console.error(err);
                window.location.href = '/login';
            });
    });
});
