function renderComment(c, prepend = false) {
    const div = document.createElement("div");
    div.className = "d-flex mb-3 bg-dark p-2 rounded";
    div.innerHTML = `
    <img src="/images/test.jpg" width="40" height="40" class="me-2 rounded-circle">
    <div>
      <div class="fw-bold">
        ${c.User.username}
        <span class="text-secondary fs-7"><i class="fas fa-clock"></i> ${c.timeAgo}</span>
      </div>
      <div>${c.content}</div>
    </div>
  `;
    if (prepend) {
        commentsDiv.insertBefore(div, commentsDiv.firstChild);
    } else {
        commentsDiv.appendChild(div);
    }
}

let page = 1;
const commentsDiv = document.getElementById("comments");
const loadBtn = document.getElementById("loadComments");
const movieId = document.querySelector(".bi.bi-chat-left-text").dataset.movieId;
async function loadComments(initial = false) {
    const res = await fetch(`/comments?movie_id=${movieId}&page=${page}`);
    const data = await res.json();

    if (initial) {
        commentsDiv.innerHTML = "";
        page = 1;
    }

    data.comments.forEach(c => {
        renderComment(c);
    });

    if (data.totalComments <= page * 5) {
        loadBtn.style.display = "none";
    } else {
        loadBtn.style.display = "block";
    }
    page++;
}
loadComments(true);
loadBtn.addEventListener("click", () => loadComments());

cmtForm = document.getElementById("cmtForm");
if (cmtForm) {
    cmtForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const content = document.getElementById("cmtContent").value.trim();
        const movieId = this.dataset.movieId;
        console.log(content + ' ' + movieId);
        if (!content) {
            alert("Nội dung bình luận không được để trống!");
            return;
        }

        try {
            const res = await fetch("/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ movie_id: movieId, content })
            });

            const data = await res.json();
            const c = data.comment;

            if (!res.ok) {
                alert(data.message || "Lỗi khi gửi bình luận");
                return;
            }

            const commentsContainer = document.querySelector(".mt-3");
            const newComment = document.createElement("div");
            newComment.className = "d-flex mb-3 bg-dark p-2 rounded";
            newComment.innerHTML = `
        <img src="/images/test.jpg" alt="avatar" width="40" height="40" class="me-2 rounded-circle">
        <div>
          <div class="fw-bold">
            ${c.user.username}
            <span class="text-secondary fs-7"><i class="fas fa-clock"></i> Vừa xong</span>
          </div>
          <div>${c.content}</div>
        </div>
      `;
            commentsContainer.prepend(newComment);

            document.getElementById("cmtContent").value = "";
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi gửi bình luận");
        }
    });
}

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

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.message || 'Lỗi khi lưu phim.');
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