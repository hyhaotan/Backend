// Tìm kiếm sản phẩm
document.getElementById("searchInput").addEventListener("input", async () => {
    const searchTerm = document.getElementById("searchInput").value;
    if (searchTerm.trim()) {
        try {
            const response = await fetch(`/search?q=${encodeURIComponent(searchTerm)}`);
            const products = await response.json();
            displaySearchSuggestions(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    } else {
        document.getElementById("searchSuggestions").innerHTML = '';
    }
});

function displaySearchSuggestions(products) {
    const suggestionsContainer = document.getElementById("searchSuggestions");
    suggestionsContainer.innerHTML = "";
    if (products.length === 0) {
        suggestionsContainer.innerHTML = "<p>No products found</p>";
    } else {
        products.forEach((product) => {
            const suggestionDiv = document.createElement("div");
            suggestionDiv.classList.add("suggestion-item");
            suggestionDiv.innerHTML = `
                <div class="suggestion-item-text">
                  <strong>${product.name}</strong> - ${product.description}
                </div>
              `;
            suggestionsContainer.appendChild(suggestionDiv);

            suggestionDiv.addEventListener("click", () => {
                document.getElementById("searchInput").value = product.name;
                document.getElementById("searchSuggestions").innerHTML = '';
                displayProductDetails(product);
            });
        });
    }
}

// Carousel
const carousel = document.querySelector('#carouselId');
const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: 3000,
    ride: 'carousel',
    pause: 'hover',
    wrap: true
});

carousel.addEventListener('slide.bs.carousel', (e) => {
    console.log(`Slide từ ${e.from} sang ${e.to}`);
});

// Fetch danh sách sản phẩm
async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        const products = await response.json();
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        products.forEach((product) => {
            const productHTML = `
                <div class="col-md-3 product-card" data-product-id="${product._id}">
                  <div class="card card-products">
                    <div class="card-body p-4 d-flex justify-content-center align-items-center">
                      <img class="card-img-top" src="${product.image}" alt="${product.name}" />
                    </div>
                    <div class="card-footer text-start ps-6">
                      <p>Model: ${product.name}</p>
                      <p>Automatic</p>
                    </div>
                  </div>
                  <div class="sub-description">
                    <h6 class="text-capitalize">${product.name}</h6>
                    <p class="fw-bold">$${product.price}</p>
                    <p>${product.description}</p>
                    <button 
                      class="btn btn-info w-100 mt-3 text-white buy-now-btn" 
                      style="font-size: 1.1rem" 
                      onclick="handleBuyNow('${product._id}', '${product.name}', '${product.price}', '${product.image}'); event.stopPropagation();">
                      Buy Now
                    </button>
                  </div>
                </div>
              `;
            productList.innerHTML += productHTML;
        });

        // Sau khi render các card, attach sự kiện click để hiển thị modal chi tiết sản phẩm
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.addEventListener("click", () => {
                showProductModal(products[index]);
            });
        });
    } catch (error) {
        console.error("Failed to fetch products", error);
    }
}

// Hàm fetch sản phẩm liên quan theo productId
async function fetchRelatedProducts(productId) {
    try {
        const response = await fetch(`/api/products?productId=${productId}`);
        if (response.ok) {
            return await response.json();
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}

// Hàm hiển thị modal chi tiết sản phẩm với phần sản phẩm liên quan
async function showProductModal(product) {
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductPrice').textContent = '$' + product.price;
  
    const modalBuyNowBtn = document.getElementById('modalBuyNowBtn');
    modalBuyNowBtn.onclick = () => {
      handleBuyNow(product._id, product.name, product.price, product.image);
    };
  
    const relatedProducts = await fetchRelatedProducts(product._id);
    const relatedProductsContainer = document.getElementById('relatedProductsContainer');
    relatedProductsContainer.innerHTML = "";
  
    if (relatedProducts.length === 0) {
      relatedProductsContainer.innerHTML = "<p>No related products found.</p>";
    } else {
      const carousel = document.createElement("div");
      carousel.id = "relatedProductsCarousel";
      carousel.className = "carousel slide";
      carousel.setAttribute("data-bs-ride", "carousel");
      carousel.setAttribute("data-bs-interval", "3000"); 
  
      const indicators = document.createElement("div");
      indicators.className = "carousel-indicators";
      const itemsPerSlide = 4; 
      const totalSlides = Math.ceil(relatedProducts.length / itemsPerSlide);
      for (let i = 0; i < totalSlides; i++) {
        const indicatorButton = document.createElement("button");
        indicatorButton.type = "button";
        indicatorButton.setAttribute("data-bs-target", "#relatedProductsCarousel");
        indicatorButton.setAttribute("data-bs-slide-to", i);
        indicatorButton.setAttribute("aria-label", `Slide ${i + 1}`);
        if (i === 0) {
          indicatorButton.className = "active";
          indicatorButton.setAttribute("aria-current", "true");
        }
        indicators.appendChild(indicatorButton);
      }
      carousel.appendChild(indicators);
  
      const carouselInner = document.createElement("div");
      carouselInner.className = "carousel-inner";
  
      for (let i = 0; i < totalSlides; i++) {
        const carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";
        if (i === 0) carouselItem.classList.add("active");
  
        const row = document.createElement("div");
        row.className = "row";
  
        for (let j = i * itemsPerSlide; j < Math.min((i + 1) * itemsPerSlide, relatedProducts.length); j++) {
          const relatedProduct = relatedProducts[j];
          const col = document.createElement("div");
          col.className = "col-md-3 mb-3";
  
          const card = document.createElement("div");
          card.className = "card h-100";
          card.innerHTML = `
            <img src="${relatedProduct.image}" class="card-img-top" alt="${relatedProduct.name}" style="width: 100%; height: 100px; object-fit: cover;">
            <div class="card-body">
              <h6 class="card-title">${relatedProduct.name}</h6>
              <p class="card-text text-primary">$${relatedProduct.price}</p>
            </div>
          `;
          card.addEventListener("click", () => {
            showProductModal(relatedProduct);
          });
          col.appendChild(card);
          row.appendChild(col);
        }
        carouselItem.appendChild(row);
        carouselInner.appendChild(carouselItem);
      }
      carousel.appendChild(carouselInner);
  
      const prevButton = document.createElement("button");
      prevButton.className = "carousel-control-prev";
      prevButton.type = "button";
      prevButton.setAttribute("data-bs-target", "#relatedProductsCarousel");
      prevButton.setAttribute("data-bs-slide", "prev");
      prevButton.innerHTML = `
        <span class="carousel-control-prev-icon custom-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      `;
      carousel.appendChild(prevButton);
  
      const nextButton = document.createElement("button");
      nextButton.className = "carousel-control-next";
      nextButton.type = "button";
      nextButton.setAttribute("data-bs-target", "#relatedProductsCarousel");
      nextButton.setAttribute("data-bs-slide", "next");
      nextButton.innerHTML = `
        <span class="carousel-control-next-icon custom-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      `;
      carousel.appendChild(nextButton);
  
      relatedProductsContainer.appendChild(carousel);
    }
  
    const productModal = document.getElementById('productModal');
    const modalInstance = bootstrap.Modal.getInstance(productModal) || new bootstrap.Modal(productModal);
    modalInstance.show();
  }
  
  
// Hàm xử lý khi người dùng bấm mua ngay (Buy Now)
function handleBuyNow(productId, name, price, image) {
    fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, quantity: 1, price, image }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                alert(data.message);
                loadCart();
            } else {
                alert("Product added to cart!");
            }
        })
        .catch((error) => console.error("Error adding to cart:", error));
}

// Update menu khi người dùng đăng nhập
function updateMenu() {
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("registerLink").style.display = "none";

    const avatarLi = document.getElementById("avatarLi");
    avatarLi.style.display = "block";

    const userAvatar = sessionStorage.getItem("userAvatar") || "./assets/default.jpg";
    const avatar = document.getElementById("avatar");
    if (avatar) {
        avatar.style.backgroundImage = `url('${userAvatar}')`;
        avatar.style.backgroundSize = "cover";
    }

    document.getElementById("logoutBtn").addEventListener("click", function () {
        sessionStorage.clear();
        window.location.href = "/";
    });
}

// Sự kiện khi trang được tải
document.addEventListener("DOMContentLoaded", fetchProducts);

window.onload = function () {
    const userLoggedIn = sessionStorage.getItem("userLoggedIn") === "true";
    if (userLoggedIn) {
        updateMenu();
    } else {
        document.getElementById("loginLink").style.display = "block";
        document.getElementById("registerLink").style.display = "block";
        document.getElementById("avatarLi").style.display = "none";
    }
};

// Thay đổi giao diện navbar khi scroll
window.addEventListener("scroll", function () {
    var navbar = document.querySelector(".navbar");
    if (window.scrollY > 0) {
        navbar.classList.add("navbar-scrolled");
    } else {
        navbar.classList.remove("navbar-scrolled");
    }
});

fetch('/header.html')
    .then((response) => response.text())
    .then((html) => {
        document.getElementById('header').innerHTML = html;
    });

fetch('/footer.html')
    .then((response) => response.text())
    .then((html) => {
        document.getElementById('footer').innerHTML = html;
    });
