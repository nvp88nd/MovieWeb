document.querySelectorAll('.save-movie-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const movieId = btn.dataset.movieId;

        try {
            const res = await fetch(`/saveMovie/${movieId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (res.status === 401) {
                alert('Bạn cần đăng nhập để lưu phim.');
                window.location.href = '/login';
                return;
            }

            const data = await res.json();

            if (data.success) {
                const icon = btn.querySelector('i');
                if (data.action === 'add') {
                    icon.classList.add('fas');
                    icon.classList.remove('far');
                } else {
                    icon.classList.add('far');
                    icon.classList.remove('fas');
                }
            } else {
                console.error('Save failed:', data.message);
            }
        } catch (err) {
            console.error(err);
        }
    });
});
