document.addEventListener("DOMContentLoaded", () => {
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    confirmDeleteModal.addEventListener("show.bs.modal", function (event) {
        const button = event.relatedTarget;
        const url = button.getAttribute("data-url");
        const name = button.getAttribute("data-name");

        const form = confirmDeleteModal.querySelector("#deleteForm");
        form.action = url;

        const message = confirmDeleteModal.querySelector("#deleteMessage");
        message.textContent = `Bạn có chắc chắn muốn xóa "${name}" không?`;
    });
});
