document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items");

    // Hàm tải danh sách giỏ hàng từ server
    const loadCart = () => {
      fetch("/cart")
        .then((response) => response.json())
        .then((cartItems) => {
          cartContainer.innerHTML = ""; // Xóa nội dung cũ

          if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Giỏ hàng của bạn hiện tại trống.</p>";
            return;
          }

          cartItems.forEach((item) => {
            const product = item.productId;
            const cartItemHtml = `
            <div class="cart-item" data-id="${item._id}">
              <div class="d-flex align-items-center">
                <img src="${item.image || './assets/default.png'}" alt="${item.name}" class="img-fluid" style="width: 50px; height: 50px;" />
                <div class="cart-item-details ms-3">
                  <p class="cart-item-title m-0"><strong>${item.name}</strong></p>
                  <p class="cart-item-price m-0 text-muted">$${item.price}</p>
                  <p class="m-0">Số lượng: ${item.quantity}</p>
                </div>
              </div>
              <div class="cart-item-actions mt-2">
                <button class="btn btn-warning btn-sm edit-btn" 
                  data-cart-id="${item._id}" 
                  data-quantity="${item.quantity}" 
                  data-bs-toggle="modal" 
                  data-bs-target="#editModal">Sửa</button>
                <button class="btn btn-danger btn-sm delete-btn" 
                  data-cart-id="${item._id}">Xóa</button>
              </div>
            </div>
          `;
            cartContainer.innerHTML += cartItemHtml;
          });
        })
        .catch((error) => console.error("Error loading cart:", error));
    };

    const handleSaveEdit = () => {
      const productId = document.getElementById("editCartItemId").value;
      const newQuantity = document.getElementById("editQuantity").value;

      // Kiểm tra tính hợp lệ
      if (!newQuantity || isNaN(newQuantity) || parseInt(newQuantity, 10) <= 0) {
        alert("Vui lòng nhập số lượng hợp lệ lớn hơn 0.");
        return;
      }

      fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: parseInt(newQuantity, 10) || undefined,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
          } else {
            alert("Cập nhật số lượng thành công.");
            loadCart(); 
            const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
            editModal.hide();
          }
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
          alert("Cập nhật thất bại. Vui lòng thử lại.");
        });
    };

    const handleDelete = (productId) => {
      if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
        fetch(`/api/cart/${productId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              alert(data.message);
            }
            loadCart(); // Tải lại giỏ hàng
          })
          .catch((error) => {
            console.error("Error deleting cart item:", error);
            alert("Xóa sản phẩm thất bại. Vui lòng thử lại.");
          });
      }
    };

    // Gán sự kiện cho các nút trong giỏ hàng
    cartContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const btn = e.target;
        document.getElementById("editCartItemId").value = btn.dataset.cartId;
        document.getElementById("editQuantity").value = btn.dataset.quantity;
        document.getElementById("editName").value = btn.dataset.name;
        document.getElementById("editPrice").value = btn.dataset.price;
        document.getElementById("editImage").value = btn.dataset.image;

        const editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
      }

      if (e.target.classList.contains("delete-btn")) {
        const productId = e.target.dataset.cartId;
        handleDelete(productId);
      }
    });

    // Gán sự kiện cho nút lưu chỉnh sửa
    document.getElementById("saveEditBtn").addEventListener("click", handleSaveEdit);

    // Tải nội dung giỏ hàng khi trang được tải
    loadCart();

    // Tải header và footer (nếu cần)
    fetch("/header.html")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("header").innerHTML = html;
      })
      .catch((error) => console.error("Error loading header:", error));

    fetch("/footer.html")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("footer").innerHTML = html;
      })
      .catch((error) => console.error("Error loading footer:", error));
  });