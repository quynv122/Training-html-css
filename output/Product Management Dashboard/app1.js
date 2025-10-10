const rowPerPage = 5;
let currentPage = 1;
let currentKeyword = "";
let currentPriceSort = "";

renderTable(getProducts());

function renderTable(
  data,
  currentPage = 1,
  totalPage = Math.ceil(data.length / rowPerPage),
  totalRow = data.length
) {
  // vô hiệu hóa nút chuyển trang
  document.querySelector(".pagination__btn--next").disabled = true;
  document.querySelector(".pagination__btn--prev").disabled = true;

  //làm trống dữ liệu bảng
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  // xử lý phaan trang
  if (currentPage > totalPage) currentPage = totalPage;
  if (currentPage <= 0) currentPage = 1;

  // xử lý dữ liệu để render
  const renderData = data.slice(
    (currentPage - 1) * rowPerPage,
    currentPage * rowPerPage
  );

  // nếu không có sản phẩm
  if (renderData.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan=6 class="table__cell table__cell--blank">No products!</td>`;
    tbody.appendChild(tr);
  } else {
    renderData.forEach((product, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("table__row");
      tr.setAttribute("data-id", product.id);
      tr.innerHTML += ` 
                    <td class="table__cell">${index + 1}</td>
                    <td class="table__cell">${product.name}</td>
                    
                    <td class="table__cell">${formatVietnameseCurrency(
                      Number(product.price) // chuyển số sang tiền vnd
                    )}</td>
                    <td class="table__cell">
                        <span class="status-badge ${product.status}">${
        product.status
      }</span>
                    </td>
                    <td class="table__cell table__cell--actions">
                        <div  class="table__action-btn table__action-btn--edit">
                            Edit
                        </div>
                        <div  class="table__action-btn table__action-btn--delete">
                            Delete
                        </div>
                    </td>`;

      tbody.appendChild(tr);
    });
  }

  // hiển thị dữ liệu của phần pagination
  document.getElementById("total-row").textContent = totalRow;
  document.getElementById("current-page").textContent = currentPage;
  document.getElementById("total-page").textContent = totalPage;

  // hiển thị keyword nên iput search nếu đang tìm kiếm
  document.querySelector(".table__search-input").value = currentKeyword;

  // kiểm tra, hiển thị icon sort
  const sortIcon = document.querySelector(".sort-icon");
  sortIcon.classList.remove("asc", "desc");

  if (currentPriceSort === "asc") {
    sortIcon.classList.add("asc");
  }
  if (currentPriceSort === "desc") {
    sortIcon.classList.add("desc");
  }

  // kiểm tra dữ liệu để active nút chuyển trang
  if (currentPage < totalPage) {
    document.querySelector(".pagination__btn--next").disabled = false;
  }
  if (currentPage > 1) {
    document.querySelector(".pagination__btn--prev").disabled = false;
  }
}

// xóa sản phẩm
function deleteProduct(id) {
  // mở popup comfirm, set nội dung cho popup
  const popupComfirm = document.querySelector(".popup-comfirm");
  const popupTitle = document.querySelector(".popup-comfirm__title");
  const popupMess = document.querySelector(".popup-comfirm__mess");
  const popupBtnAgree = document.querySelector(".popup-comfirm__btn--agree");
  const popupBtnCancel = document.querySelector(".popup-comfirm__btn--cancel");

  popupTitle.textContent = "CONFIRM PRODUCT DELETION";
  popupMess.textContent = "Are you sure you want to delete this product?";
  popupBtnAgree.textContent = "Delete Product";
  popupBtnCancel.textContent = "Cancel";

  popupComfirm.classList.add("active");

  // gắn EventListener cho 2 nút agree, cancel của popup
  popupBtnAgree.addEventListener("click", handleAgree);
  popupBtnCancel.addEventListener("click", handleCancel);

  // hàm xử lý khi hủy
  function handleCancel() {
    closePopup();
  }

  // hàm xử lý khi đống ý
  function handleAgree() {
    let products = getProducts(); // lấy dữ liệu từ localstorage
    let newProducts = products.filter((product) => product.id !== id); // lọc bỏ phần tử theo id
    saveProducts(newProducts); // lưu dữ liệu mới vào localstorage
    updateView(); // render table
    closePopup(); // đóng modal,  clear EventListener
    showToast("success", "Product deleted"); // hien thị thông báo
  }

  // hàm đóng popup và clear EventListener
  function closePopup() {
    popupComfirm.classList.remove("active");
    popupBtnAgree.removeEventListener("click", handleAgree);
    popupBtnCancel.removeEventListener("click", handleCancel);
  }
}

// hàm thêm sản phẩm
function addProduct() {
  // mở modal,form + set nội dung
  const modal = document.querySelector(".modal");
  const modalTitle = document.querySelector(".modal__title");
  const submitBtn = document.querySelector(".modal__btn--submit");
  const cancelBtn = document.querySelector(".modal__btn--cancel");

  modalTitle.textContent = "Add Product";
  submitBtn.textContent = "Add";
  cancelBtn.textContent = "Cancel";
  modal.classList.add("active");

  // gẵn sự kiên click cho 2 nút trong modal
  submitBtn.addEventListener("click", handleAgree);
  cancelBtn.addEventListener("click", handleClose);

  // hàm xử lý khi thêm sản phẩm
  function handleAgree() {
    clearError(); // xóa err cũ

    let valid = true;

    // lấy dữ liệu từ input form
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const productStatus = document.getElementById("productStatus");
    const productDescription = document.getElementById("productDesc");

    // validate và hiển thị err
    if (productName.value.trim() === "") {
      document.querySelector(".modal__error--name").textContent =
        "Please enter the product name.";
      valid = false;
    } else if (productName.value.trim().length > 50) {
      document.querySelector(".modal__error--name").textContent =
        "Product name is too long.";
      valid = false;
    }
    if (productPrice.value === "") {
      document.querySelector(".modal__error--price").textContent =
        "Please enter the product price.";
      valid = false;
    } else if (isNaN(productPrice.value) || productPrice.value <= 0) {
      document.querySelector(".modal__error--price").textContent =
        "The product price must be a number greater than 0.";
      valid = false;
    } else if (productPrice.value.length > 9) {
      document.querySelector(".modal__error--price").textContent =
        "Product price is too high.";
      valid = false;
    }
    // nếu dữ liệu hợp lệ
    if (valid) {
      // tạo product mới từ dữ liệu form
      let newProduct = {
        name: productName.value,
        price: productPrice.value,
        status: productStatus.value,
        description: productDescription.value,
        id: genID(), // tạo id ngẫu nhiên
      };
      let products = getProducts(); // lấy dữ liệu tù localstorage
      products.push(newProduct); // thêm product mới
      saveProducts(products); // lưu dũ liệu mới vào localstorage

      // reset lọc, tìm kiếm, chuyển trang + render table
      currentPage = 1;
      currentKeyword = "";
      currentPriceSort = "";
      renderTable(products, currentPage);

      // xóa dữ liệu input
      document.querySelector(".modal__form").reset();
      showToast("success", "Product added successfully."); // hiển thị thông báo
      handleClose();
    }
  }

  // hàm xử lý khi hủy
  function handleClose() {
    closeModal(); // đóng modal, clear EventListener
    clearError(); // xóa error
  }

  // hàm đóng modal + clear EventListener
  function closeModal() {
    modal.classList.remove("active");
    submitBtn.removeEventListener("click", handleAgree);
    cancelBtn.removeEventListener("click", handleClose);
  }

  // hàm clear err
  function clearError() {
    document.querySelectorAll(".modal__error").forEach((e) => {
      e.textContent = "";
    });
  }
}

function editProduct(id) {
  const products = getProducts();

  // tìm sản phẩm theo id
  const product = products.find((p) => p.id === id);

  // nếu không tìm thấy sản phẩm
  if (!product) {
    showToast("error", "No product data found.");
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

  const modal = document.querySelector(".modal");
  const modalTitle = document.querySelector(".modal__title");
  const cancelBtn = document.querySelector(".modal__btn--cancel");
  const saveBtn = document.querySelector(".modal__btn--submit");
  const inputName = document.getElementById("productName");
  const inputPrice = document.getElementById("productPrice");
  const inputStatus = document.getElementById("productStatus");
  const inputDescription = document.getElementById("productDesc");

  // Đổ dữ liệu lên form
  modalTitle.textContent = "Edit Product Information.";
  saveBtn.textContent = "Update";
  cancelBtn.textContent = "Cancel";
  inputName.value = oldName;
  inputPrice.value = oldPrice;
  inputStatus.value = oldStatus;
  inputDescription.value = oldDescription;

  modal.classList.add("active");

  // gắn sự kiện cho 2 nút save, cancel
  saveBtn.addEventListener("click", handleAgree);
  cancelBtn.addEventListener("click", handleClose);

  // hàm xử lý khi đóng modal
  function handleClose() {
    modal.classList.remove("active");
    clearError();
    document.querySelector(".modal__form").reset(); // xóa dữ liệu input trên form

    // xóa EventListener
    saveBtn.removeEventListener("click", handleAgree); // xóa EventListener
    cancelBtn.removeEventListener("click", handleClose);
  }

  function handleAgree() {
    clearError();
    let valid = true;

    // lấy dữ liệu mới trên form
    const newName = inputName.value.trim();
    const newPrice = inputPrice.value.trim();
    const newStatus = inputStatus.value;
    const newDescription = inputDescription.value.trim();

    // Validate dữ liệu
    if (newName === "") {
      document.querySelector(".modal__error--name").textContent =
        "Please enter the product name.";
      valid = false;
    } else if (newName.length > 50) {
      document.querySelector(".modal__error--name").textContent =
        "Product name is too long.";
      valid = false;
    }
    if (newPrice === "") {
      document.querySelector(".modal__error--price").textContent =
        "Please enter the product price.";
      valid = false;
    } else if (isNaN(newPrice) || Number(newPrice) <= 0) {
      document.querySelector(".modal__error--price").textContent =
        "The product price must be a number greater than 0.";
      valid = false;
    } else if (newPrice.length > 9) {
      document.querySelector(".modal__error--price").textContent =
        "Product price is too high.";
      valid = false;
    }

    if (!valid) return;

    // Nếu không thay đổi gì
    if (
      newName === oldName &&
      newPrice === oldPrice &&
      newStatus === oldStatus &&
      newDescription === oldDescription
    ) {
      showToast("warning", "No changes were saved.");
      return;
    }

    // Cập nhật thông tin sanr phẩm
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
    currentPriceSort = "";
    currentPage = 1;
    updateView();
    handleClose();
    showToast("success", "Product updated successfully!");
  }

  // hàm xóa err
  function clearError() {
    document
      .querySelectorAll(".modal__error")
      .forEach((e) => (e.textContent = ""));
  }
}

// hàm lấy dữ liệu đã lưu từ localsorage
function getProducts() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  return products;
}

// hàm lưu dữ liệu vào localsorage
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// hàm tạo ra chuỗingẫu nhiên dùng làm id
function genID() {
  let id = crypto.randomUUID();
  return id;
}

// vô hiệu hóa sự kiện mặc định của form
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
});

// hàm đổi số sang tiền (vnd)
function formatVietnameseCurrency(number) {
  if (isNaN(number)) return "0 ₫";
  return number
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace("₫", "₫");
}

// hàm hiernr thị thông báo, toast
function showToast(type = "", mess = "") {
  const toast = document.querySelector(".toast");
  const toastMsg = document.createElement("p");

  toastMsg.classList.add("toast__mess");
  toastMsg.textContent = mess;

  toast.replaceChildren();
  toast.classList.remove("toast--success", "toast--error", "toast--warning");
  if (type) toast.classList.add(`toast--${type}`);

  toast.appendChild(toastMsg);
  toast.classList.add("active");

  setTimeout(() => {
    toastMsg.remove();
    toast.classList.remove("active");
  }, 3000);
}

// hàm xử lý dữ liệu trước khi render table
function updateView() {
  let products = getProducts();

  // kiểm tra trạng thái hiện tại của table
  if (currentKeyword === "") {
    // không tìm kiếm
    if (currentPriceSort === "") {
      // không sắp xếp
      renderTable(products, currentPage);
    } else {
      // có sắp xếp
      let sortedProducts = sortProductsByPrice(products, currentPriceSort);
      renderTable(sortedProducts, currentPage);
    }
  } else {
    // đang tìm kiếm
    let searchedProducts = searchProducts(products, currentKeyword); // dữ liệu sau khi tìm kiếm
    if (currentPriceSort === "") {
      // không phân trang
      renderTable(searchedProducts, currentPage);
    } else {
      // có phân trang
      let sortedSearchedProducts = sortProductsByPrice(
        searchedProducts,
        currentPriceSort
      );
      renderTable(sortedSearchedProducts, currentPage);
    }
  }
}

// tìm kiếm theo tên
document.querySelector(".table__search-btn").addEventListener("click", () => {
  let keyword = document.querySelector(".table__search-input").value;
  if (keyword.trim() !== "") {
    currentKeyword = keyword;
    currentPage = 1;
    currentPriceSort = "";
    updateView();
  }
});

// bắt sự kiện click sắp xếp
document.querySelector(".table__cell--sortable").addEventListener("click", () => {
  // chuyển đổi giữa 3 trạng thái sắp xếp: "", "asc", "desc"
    switch (currentPriceSort) {
      case "":
        currentPriceSort = "asc";
        currentPage = 1;
        updateView();
        break;
      case "asc":
        currentPriceSort = "desc";
        currentPage = 1;
        updateView();
        break;
      case "desc":
        currentPriceSort = "";
        currentPage = 1;
        updateView();
        break;
    }
  });

// hàm sắp xếp dữ liệu sản phẩm.
function sortProductsByPrice(products, order = "asc") {
  return [...products].sort((a, b) => {
    if (order === "asc") return a.price - b.price;
    else return b.price - a.price;
  });
}
// bắt sự kiện nút chuyển trang tiếp,
const btnNextPage = document.querySelector(".pagination__btn--next");
btnNextPage.addEventListener("click", () => {
  currentPage++;
  updateView();
});

// bắt sự kiện nút chuyển trang trước,
const btnPrevPage = document.querySelector(".pagination__btn--prev");
btnPrevPage.addEventListener("click", () => {
  currentPage--;
  if (currentPage === 0) {
    showToast("error", "Something went wrong.");
    currentPage = 1;
    updateView();
  } else {
    updateView();
  }
});

//bắt sự kiện click trên tbody chứa các sản phẩm
const tbody = document.querySelector(".table__body");
tbody.addEventListener("click", (e) => {
  // kiểm tra nếu nhấn vào nút xóa sản phẩm
  if (e.target.classList.contains("table__action-btn--delete")) {
    // gọi đến thẻ cha(tr) của sản phẩm đó. lấy ra id sản phẩm dó (id đc gắn vào attribute khi render table)
    const idProduct = e.target.closest(".table__row").getAttribute("data-id");

    //gọi hàm xóa sản phẩm
    deleteProduct(idProduct);
  }
  if (e.target.classList.contains("table__action-btn--edit")) {
    // gọi đến thẻ cha(tr) của sản phẩm đó. lấy ra id sản phẩm dó (id đc gắn vào attribute khi render table)
    const idProduct = e.target.closest(".table__row").getAttribute("data-id");

    //gọi hàm sửa sản phẩm
    editProduct(idProduct);
  }
});

// đổi số sang tiền việt
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// hàm tìm kiếm sản phẩm theo tên.
function searchProducts(products, keyword) {
  const normalizedKeyword = removeVietnameseTones(keyword.toLowerCase());
  return products.filter((product) =>
    removeVietnameseTones(product.name.toLowerCase()).includes(
      normalizedKeyword
    )
  );
}

document.querySelector(".table__btn-reset").addEventListener("click", () => {
  currentKeyword = "";
  currentPage = 1;
  currentPriceSort = "";
  renderTable(getProducts());
});
