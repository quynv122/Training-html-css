function editProduct(id) {
  const products = getProducts();

  // tìm sản phẩm theo id
  const product = products.find((p) => p.id === id);

  if (!product) {
    showToast("error", "Không tìm thấy dữ liệu sản phẩm");
    currentPage = 1;
    currentKeyword = "";
    currentPriceSort = "";
    updateView();
    return;
  }

  // Lưu dữ liệu cũ
  let oldName = product.name;
  let oldPrice = product.price;
  let oldStatus = product.status;
  let oldDescription = product.description;

  // Các element
  const modal = document.querySelector(".modal");
  const modalTitle = document.querySelector(".modal__title");
  const cancelBtn = document.querySelector(".modal__btn--cancel");
  const saveBtn = document.querySelector(".modal__btn--submit");
  const inputName = document.getElementById("productName");
  const inputPrice = document.getElementById("productPrice");
  const inputStatus = document.getElementById("productStatus");
  const inputDescription = document.getElementById("productDesc");

  // Đổ dữ liệu cũ lên form
  modalTitle.textContent = "Chỉnh sửa thông tin sản phẩm";
  saveBtn.textContent = "Lưu";
  cancelBtn.textContent = "Hủy";
  inputName.value = oldName;
  inputPrice.value = oldPrice;
  inputStatus.value = oldStatus;
  inputDescription.value = oldDescription || "";

  modal.classList.add("active");

  // === GẮN SỰ KIỆN ===
  saveBtn.addEventListener("click", handleAgree);
  cancelBtn.addEventListener("click", handleCancel);

  function handleCancel() {
    modal.classList.remove("active");
    clearError();
    saveBtn.removeEventListener("click", handleAgree);
    cancelBtn.removeEventListener("click", handleCancel);
  }

  function handleAgree() {
    clearError();
    let valid = true;

    const newName = inputName.value.trim();
    const newPrice = inputPrice.value.trim();
    const newStatus = inputStatus.value;
    const newDescription = inputDescription.value.trim();

    // Validate
    if (newName === "") {
      document.querySelector(".modal__error--name").textContent =
        "Vui lòng nhập tên sản phẩm";
      valid = false;
    }
    if (newPrice === "") {
      document.querySelector(".modal__error--price").textContent =
        "Vui lòng nhập giá sản phẩm";
      valid = false;
    } else if (isNaN(newPrice) || Number(newPrice) <= 0) {
      document.querySelector(".modal__error--price").textContent =
        "Giá sản phẩm phải là số lớn hơn 0";
      valid = false;
    }

    if (!valid) return;

    // Nếu không thay đổi gì thì thoát
    if (
      newName === oldName &&
      newPrice === oldPrice &&
      newStatus === oldStatus &&
      newDescription === oldDescription
    ) {
      showToast("warning", "Không có thay đổi nào được lưu");
      return;
    }

    // Cập nhật sản phẩm
    const newProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            name: newName,
            price: newPrice,
            status: newStatus,
            description: newDescription,
          }
        : p
    );

    saveProducts(newProducts);
    updateView();
    showToast("success", "Cập nhật sản phẩm thành công!");
    handleCancel();
  }

  function clearError() {
    document.querySelectorAll(".modal__error").forEach((e) => (e.textContent = ""));
  }
}
