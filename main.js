let categorySize = 0;
let activeCategorySize = 0;
let availableProducts = [];
let selectedProducts = [];
let selectedProductsFromAssigned = [];
let assignedProducts = [];

function checkboxOnChange(productId) {
  if ($("#" + productId).is(":checked")) {
    selectedProducts.push(productId);
  } else {
    for (let i = 0; i < selectedProducts.length; i++) {
      if (selectedProducts[i] === productId) {
        selectedProducts.splice(i, 1);
      }
    }
  }

  if (selectedProducts.length > 0) {
    $(".me-2").text(`Add ${selectedProducts.length} Products`);
    $(".me-2").addClass("selected");
  } else {
    $(".me-2").text(`Add Product`);
    $(".me-2").removeClass("selected");
  }
}

const addElement = (index, text) =>
        `<li id="li${index}"><input type='checkbox' id='${index}' onchange="checkboxOnChange(${index})"/><label class='ms-2' for='${index}'>${
                text === undefined ? "" : text
        } ${index}</label></li>`;

for (let i = 1; i <= 10; i++) {
  $("#available").append(addElement(i, "Product"));
  availableProducts.push(i);
}

$(() => {
  $(".catButton").trigger("click");
  $("#availableProducts").text(availableProducts.length);
  $("p.mb-3 > span").text(categorySize);
});

function onRemoveCheckBoxOnChange(categoryNo, productId) {
  if ($("#" + productId).is(":checked")) {
    selectedProductsFromAssigned.push(productId);
  } else {
    for (let i = 0; i < selectedProductsFromAssigned.length; i++) {
      if (selectedProductsFromAssigned[i] === productId) {
        selectedProductsFromAssigned.splice(i, 1);
      }
    }
  }

  if (selectedProductsFromAssigned.length > 0) {
    $("#delete" + categoryNo).addClass("selected");
  } else {
    $("#delete" + categoryNo).removeClass("selected");
  }
}

function addProduct(categoryNo) {
  if (selectedProducts.length === 0) {
    alert("Ürün seçmeniz gerekmektedir!");
  } else {
    selectedProducts.sort(function(a, b){ return a-b });

    for (let i = 0; i < selectedProducts.length; i++ ) {
      $("#ul" + categoryNo).append(`<li id="categoryLi${selectedProducts[i]}"><input type="checkbox" id="${selectedProducts[i]}" onchange="onRemoveCheckBoxOnChange(${categoryNo}, ${selectedProducts[i]})" />
              <label class='ms-2' for='${selectedProducts[i]}'> Product ${selectedProducts[i]} </label>
          </li>`);
      $("#li" + selectedProducts[i]).remove();

      for (let j = 0; j < availableProducts.length; j++) {
        if (availableProducts[j] === selectedProducts[i]) {
          availableProducts.splice(j, 1);
        }
      }
    }

    $("#availableProducts").text(availableProducts.length);
    assignedProducts[categoryNo] = assignedProducts[categoryNo].concat(selectedProducts);
    selectedProducts = [];
    $("#svg" + categoryNo).addClass("none");
    $("#p" + categoryNo).addClass("none");
    $(".me-2").text(`Add Product`);
    $(".me-2").removeClass("selected");
    updateCategoriesStatus();
  }
}

function updateAvailableProducts() {
  availableProducts.sort(function(a, b){ return a-b });
  $("#available").empty();

  for (let i = 0; i < availableProducts.length; i++) {
    $("#available").append(addElement(availableProducts[i], "Product"));
  }

  $("#availableProducts").text(availableProducts.length);
}

function categoryStatus(categoryNo, productCount) {
  return `<p class="will-delete">
            Category ${categoryNo}:
            <span>${productCount} Products</span>
          </p>`;
}

function updateCategoriesStatus() {
  $(".will-delete").remove();

  assignedProducts.forEach((value, key) => {
    $("#review-list").children(":last-child").append(categoryStatus(key, value.length));
  })
}

function deleteProduct(categoryNo) {
  if (selectedProductsFromAssigned.length <= 0) {
    alert("Silinecek ürün bulunamadı!");
  } else {
    selectedProductsFromAssigned.sort(function(a, b){ return a-b });

    for (let i = 0; i < selectedProductsFromAssigned.length; i++) {
      $("#categoryLi" + selectedProductsFromAssigned[i]).remove();

      for (let j = 0; j < assignedProducts[categoryNo].length; j++) {
        if (assignedProducts[categoryNo][j] === selectedProductsFromAssigned[i]) {
          assignedProducts[categoryNo].splice(j, 1);
        }
      }
    }

    availableProducts = availableProducts.concat(selectedProductsFromAssigned);
    $("#availableProducts").text(availableProducts.length);
    selectedProductsFromAssigned = [];
    $("#delete" + categoryNo).removeClass("selected");
    updateAvailableProducts();
    updateCategoriesStatus();
  }
}

function deleteCategory(categoryNo) {
  $("#category" + categoryNo).remove();
  availableProducts = availableProducts.concat(assignedProducts[categoryNo]);
  delete assignedProducts[categoryNo];
  updateAvailableProducts();
  updateCategoriesStatus();
  activeCategorySize--;
  $("p.mb-3 > span").text(activeCategorySize);
}

$('.catButton').click(function(){
  categorySize++;
  activeCategorySize++;
  assignedProducts[categorySize] = [];
  let category = `<div id="category${categorySize}" class="section">
       <div class="title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class="bi bi-boxes"
          viewBox="0 0 16 16"
        >
          <path
            d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z"
          />
        </svg>
        <span class="ms-2">Category ${categorySize} </span>
      </div>
      <div class="content">
        <svg id="svg${categorySize}"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-suit-heart"
          viewBox="0 0 16 16"
        >
          <path
            d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"
          />
        </svg>
        <p id="p${categorySize}">Select products add here</p>
        <div class="products mt-3">
          <ul id="ul${categorySize}"></ul>
        </div>
      </div>
      <div class="bottom">
        <button class="me-2" onclick="addProduct(${categorySize})">Add Product</button>
        <button id="delete${categorySize}" onclick="deleteProduct(${categorySize})">Remove Product</button>
        <button onclick="deleteCategory(${categorySize})">Remove Category</button>
      </div>
    </div>`;
  $('.addCategory').append(category);
  $("p.mb-3 > span").text(activeCategorySize);
  updateCategoriesStatus();
});


