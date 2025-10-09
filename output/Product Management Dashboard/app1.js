const rowPerPage = 5;
let currentPage = 1;
let currentKeyword = "";
let currentPriceSort = "";
let searching = false;
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

  // xử lý trang 
  if (currentPage > totalPage) currentPage = totalPage;
  if (currentPage === 0) currentPage = 1;

  // xử lý dữ liệu để render
  const renderData = data.slice(
    (currentPage - 1) * rowPerPage,
    currentPage * rowPerPage
  );

  // kiểm tra dữ liệu
  if (renderData.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan=6 class="table__cell table__cell--blank">Không có sản phẩm nào!</td>`;
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
                        <span class="status-badge ${
                          product.status === "active" ? "active" : "inactive"
                        }">${
        product.status === "active" ? "Đang hoạt động" : "Không hoạt động"
      }</span>
                    </td>
                    <td class="table__cell table__cell--actions">
                        <div  class="table__action-btn table__action-btn--edit">
                            Sửa
                        </div>
                        <div  class="table__action-btn table__action-btn--delete">
                            Xóa
                        </div>
                    </td>`;

      tbody.appendChild(tr);
    });
  }

  // hiển thị dữ liệu của phần pagination
  document.getElementById("total-row").textContent = totalRow;
  document.getElementById("current-page").textContent =
    currentPage === 0 ? 1 : currentPage;
  document.getElementById("total-page").textContent = totalPage;

  // hiển thị keyword nếu đang tìm kiếm
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

function deleteProduct(id) {
  // mở popup comfirm, set nội dung cho popup
  const popupComfirm = document.querySelector(".popup-comfirm");
  const popupTitle = document.querySelector(".popup-comfirm__title");
  const popupMess = document.querySelector(".popup-comfirm__mess");
  const popupBtnAgree = document.querySelector(".popup-comfirm__btn--agree");
  const popupBtnCancel = document.querySelector(".popup-comfirm__btn--cancel");

  popupTitle.textContent = "Xác Nhận Xóa sản phẩm";
  popupMess.textContent = "Bạn chắc chắn muốn xóa sản phẩm này?";
  popupBtnAgree.textContent = "Xóa sản phẩm";
  popupBtnCancel.textContent = "Hủy";

  popupComfirm.classList.add("active");

  // gắn listener
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
    showToast("success", "Đã xóa sản phẩm"); // hien thị thông báo
  }

  // hàm đóng popup và clear EventListener
  function closePopup() {
    popupComfirm.classList.remove("active");
    popupBtnAgree.removeEventListener("click", handleAgree);
    popupBtnCancel.removeEventListener("click", handleCancel);
  }
}

function addProduct() {
  // mở modal,form + set nội dung
  const modal = document.querySelector(".modal");
  const modalTitle = document.querySelector(".modal__title");
  const submitBtn = document.querySelector(".modal__btn--submit");
  const cancelBtn = document.querySelector(".modal__btn--cancel");

  modalTitle.textContent = "Thêm sản phẩm";
  submitBtn.textContent = "Thêm";
  cancelBtn.textContent = "Hủy";
  modal.classList.add("active");

  // gẵn sự kiên click
  submitBtn.addEventListener("click", handleAgree);
  cancelBtn.addEventListener("click", handleCancel);

  // hàm xủa lý khi thêm product
  function handleAgree() {
    let valid = true;
    // lấy dữ liệu từ input form
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const productStatus = document.getElementById("productStatus");
    const productDescription = document.getElementById("productDesc");

    clearError();

    if (productName.value.trim() === "") {
      document.querySelector(".modal__error--name").textContent =
        "Vui lòng nhập tên sản phẩm";
      valid = false;
    }

    if (productPrice.value === "") {
      document.querySelector(".modal__error--price").textContent =
        "Vui lòng nhập giá sản phẩm";
      valid = false;
    } else if (isNaN(productPrice.value) || productPrice.value <= 0) {
      document.querySelector(".modal__error--price").textContent =
        "Giá sản phẩm phải là số lớn hơn 0";
      valid = false;
    }
    if (valid) {
      // tạo product mới từ dữ liệu.
      let newProduct = {
        name: productName.value,
        price: productPrice.value,
        status: productStatus.value,
        description: productDescription.value,
        id: genID(), // tạo id ngẫu nhiên
      };
      let products = getProducts(); // lấy dữ liệu tù localstorage
      products.push(newProduct); // thêm product mới
      saveProducts(products); // lưu dũ liệu vào localstorage

      // reset lọc, tìm kiếm, chuyển trang + render table
      currentPage = 1;
      currentKeyword = "";
      currentPriceSort = "";
      renderTable(products, currentPage);
      showToast("success", "Đã thêm sản phẩm"); // hiển thị thông báo
      closeModal(); // đóng modal, clear EventListener
      clearError(); // xóa error

      // xóa dữ liệu input
      productName.value = "";
      productPrice.value = "";
      productDescription.value = "";
    }
  }

  function handleCancel() {
    closeModal(); // đóng modal, clear EventListener
    clearError(); // xóa error
  }

  function closeModal() {
    modal.classList.remove("active");
    submitBtn.removeEventListener("click", handleAgree);
    cancelBtn.removeEventListener("click", handleCancel);
  }

  function clearError() {
    document.querySelectorAll(".modal__error").forEach((e) => {
      e.textContent = "";
    });
  }
}

// lấy dữ liệu đã lưu từ localsorage
function getProducts() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  return products;
}

// lưu dữ liệu vào localsorage
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// tạo ra chuỗingẫu nhiên dùng làm id
function genID() {
  let id = crypto.randomUUID();
  return id;
}

// vô hiệu hóa sự kiện mặc định của form
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
});

// đổi số sang tiền (vnd)
function formatVietnameseCurrency(number) {
  if (isNaN(number)) return "0 ₫";
  return number
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace("₫", "₫");
}

// hiernr thị toast
function showToast(type = "", mess = "") {
  const toast = document.querySelector(".toast");
  const toastMsg = document.createElement('p')

  toastMsg.classList.add('toast__mess')
  toastMsg.textContent = mess;

  toast.replaceChildren();
  toast.classList.remove("toast--success", "toast--error", "toast--warning");
  if (type) toast.classList.add(`toast--${type}`);

  toast.appendChild(toastMsg);
  toast.classList.add('active')
 
  setTimeout(() => {
    toastMsg.remove();
    toast.classList.remove("active");
  }, 3000);
}

// xử lý dữ liệu trước khi render table
function updateView() {
  let products = getProducts();
  // kiểm tra có đang tìm kiếm
  if (currentKeyword === "") {
    // không tìm kiếm và không sắp xếp
    if (currentPriceSort === "") {
      renderTable(products, currentPage);
    }
    // không tìm kiếm nhưng có sắp xếp
    else {
      let sortedProducts = sortProductsByPrice(products, currentPriceSort);
      renderTable(sortedProducts, currentPage);
    }
  }
  // nếu đang tìm kiếm
  else {
    // dữ liệu sau khi tìm kiếm
    let searchedProducts = searchProducts(products, currentKeyword);

    // có tìm kiếm nhưng không sắp xếp
    if (currentPriceSort === "") {
      renderTable(searchedProducts, currentPage);
    }

    // có tìm kiếm và có sắp xếp
    else {
      // dữ liệu sau khi tìm kiếm và sắp xếp
      let sortedSearchedProducts = sortProductsByPrice(
        searchedProducts,
        currentPriceSort
      );
      renderTable(sortedSearchedProducts, currentPage);
    }
  }
}

// search
const btnSearch = document.querySelector(".table__search-btn");
btnSearch.addEventListener("click", () => {
  const searchInput = document.querySelector(".table__search-input");
  const searchForm = document.querySelector(".table__search");
  if (searchInput.value.trim() === "") {
    searchForm.style.border = "2px solid red";
  } else {
    currentKeyword = searchInput.value.trim();
    currentPage = 1;
    currentPriceSort = ''
    updateView()
    
  }
});

// bắt sự kiện click sắp xếp
document
  .querySelector(".table__cell--sortable")
  .addEventListener("click", () => {
    togglePriceSort();
  });

// sắp xếp theo giá
function togglePriceSort() {
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
}

// hàm sắp xếp dữ liệu.
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
    showToast("error", "Lỗi không xác định");
    currentPage = 1;
    updateView();
  } else {
    updateView();
  }
});

// lắng nghe sự kiện click trên tbody chứa các sản phẩm
const tbody = document.querySelector(".table__body");
tbody.addEventListener("click", (e) => {
  // kiểm tra nếu nhấn vào nút xóa, lấy ra id của sản phẩm vừa đc nhấn
  if (e.target.classList.contains("table__action-btn--delete")) {
    const idProduct = e.target.closest(".table__row").getAttribute("data-id");
    //gọi hàm xóa sản phẩm
    deleteProduct(idProduct);
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

// hàm tìm kiếm theo tên products.
function searchProducts(products, keyword) {
  const normalizedKeyword = removeVietnameseTones(keyword.toLowerCase());
  return products.filter((product) =>
    removeVietnameseTones(product.name.toLowerCase()).includes(
      normalizedKeyword
    )
  );
}
