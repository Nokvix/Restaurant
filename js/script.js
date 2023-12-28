document.addEventListener("DOMContentLoaded", () => {

    const menuContainer = document.querySelector(".menu");
    const cartContainer = document.querySelector(".cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalAmountSpan = document.querySelector(".total-amount");
    const viewCartBtn = document.querySelector(".view-cart-btn");
    const checkoutBtn = document.querySelector(".checkout-btn");
    let previousCategory = "Всё";
    const keyLocalStorage = "cartItems";

    let menuItems = [
        { "id": 1, "name": "Куриный суп", "category": "Супы", "price": 350, "src": "img\\chicken-soup.jpeg", "weight": 400 },
        { "id": 2, "name": "Фланк стейк", "category": "Мясо", "price": 950, "src": "img\\flank-steak.jpg", "weight": 330 },
        { "id": 3, "name": "Салат Цезарь", "category": "Салаты", "price": 570, "src": "img\\caesar-salad.jpg", "weight": 220 },
        { "id": 4, "name": "Морс клюквенный 1л", "category": "Напитки", "price": 520, "src": "img\\cranberry-morsels.jpg", "weight": 1000 },
        { "id": 5, "name": "Филе миньон", "category": "Мясо", "price": 1150, "src": "img\\filet-mignon.jpg", "weight": 310 },
        { "id": 6, "name": "Морс клюквенный 250мл", "category": "Напитки", "price": 130, "src": "img\\cranberry-morsels-0.25.jpg", "weight": 250 },
        { "id": 7, "name": "Морс облепиховый 250мл", "category": "Напитки", "price": 130, "src": "img\\sea-buckthorn-morsel-250.jpg", "weight": 250 },
        { "id": 8, "name": "Морс облепиховый 1л", "category": "Напитки", "price": 520, "src": "img\\sea-buckthorn-morsel.jpg", "weight": 1000 },
        { "id": 9, "name": "Салат Старопражский", "category": "Салаты", "price": 490, "src": "img\\staroprazhsky-salad.jpg", "weight": 230 },
        { "id": 10, "name": "Гороховый суп на копченом ребре", "category": "Супы", "price": 390, "src": "img\\pea-soup.jpg", "weight": 435 },
        { "id": 11, "name": "Борщ из телятины", "category": "Супы", "price": 390, "src": "img\\veal-borscht.jpg", "weight": 340 },
        { "id": 12, "name": "Сахарные свиные рёбрышки", "category": "Мясо", "price": 830, "src": "img\\sugar-pork-ribs.jpg", "weight": 665 },
    ];

    const categories = ["Всё", "Супы", "Мясо", "Салаты", "Напитки", "Гарниры"]

    let cartItems = [];

    function displayMenu(menuItems) {
        menuContainer.innerHTML = "";
        menuItems.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.className = "menu-item";

            menuItem.innerHTML = `
                <img class="item-img" src=${item.src}
                <h3 class="item-name">${item.name}</h3>
                <p class="item-category">${item.category}</p>
                <div class="price-weight">
                    <p class="price">${item.price} ₽</p>
                    <div class="quantity-control">
                        <button class="quantity-btn" data-action="decrease">
                            <i class='fa fa-minus'></i>
                        </button>
                        <span class="quantity" data-quantity="1">1</span>
                        <button class="quantity-btn" data-action="increase">
                            <i class='fa fa-plus'></i>
                        </button>
                    </div>
                    <p class="weight">${item.weight}г</p>
                </div>
                <button class="add-to-cart-btn" data-item-id="${item.id}">
                    <i class='fa fa-cart-plus'></i>
                </button>
            `;
            menuContainer.appendChild(menuItem);
        });

        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(btn.dataset.itemId);
                const quantityElement = btn.parentElement.querySelector('.quantity');
                const quantity = parseInt(quantityElement.dataset.quantity);

                addToCart(itemId, quantity);
                quantityElement.textContent = 1;
                quantityElement.dataset.quantity = 1;
            });
        });

        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const action = btn.dataset.action;
                const quantityElement = btn.parentElement.querySelector('.quantity');
                const dataQuantity = quantityElement.dataset.quantity;
                let quantity = parseInt(dataQuantity);

                if (action === 'increase') {
                    quantity++;
                } else if (action === 'decrease' && quantity > 1) {
                    quantity--;
                }

                quantityElement.textContent = quantity;
                quantityElement.dataset.quantity = quantity;
            });
        });
    }

    function addToCart(itemId, quantity = 1) {
        const selectedItem = menuItems.find(item => item.id === itemId);

        const existingItem = cartItems.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            selectedItem.quantity = quantity;
            cartItems.push(selectedItem);
        }

        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalAmount = 0;
        if (cartItems.length > 0) {
            checkoutBtn.disabled = false;
        } else {
            checkoutBtn.disabled = true;
        }
        localStorage.setItem(keyLocalStorage, JSON.stringify(cartItems));

        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.className = "cart-item";

            cartItem.innerHTML = `
            <div class="name-remove-button">
                <span>${item.name}</span>
                <button class="remove-from-cart-btn" data-item-id="${item.id}">&times;</button>
            </div>
            <div class="cart-item-actions">
                <span class="amount-cart-item">${item.price * item.quantity} ₽</span>
                <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}">
                    <i class='fa fa-minus'></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-item-id="${item.id}">
                    <i class='fa fa-plus'></i>
                </button>
            </div>
            `;

            cartItemsContainer.appendChild(cartItem);
            totalAmount += item.price * item.quantity;
        });

        totalAmountSpan.textContent = totalAmount;
        cartContainer.style.display = "block";
        cartContainer.style.width = "20%";
        menuContainer.style.width = "80%";
        const headerHeight = document.querySelector('header').offsetHeight;
        cartContainer.style.top = headerHeight + "px";


        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const action = btn.dataset.action;
                const itemId = parseInt(btn.dataset.itemId);
                updateQuantityInCart(itemId, action);
            });
        });

        const removeFromCartBtns = document.querySelectorAll('.remove-from-cart-btn');
        removeFromCartBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(btn.dataset.itemId);
                removeFromCart(itemId);
            });
        });
    }

    function updateQuantityInCart(itemId, action) {
        const selectedItem = cartItems.find(item => item.id === itemId);

        if (selectedItem) {
            if (action === 'increase') {
                selectedItem.quantity++;
            } else if (action === 'decrease' && selectedItem.quantity > 1) {
                selectedItem.quantity--;
            }

            updateCart();
        }
    }

    function removeFromCart(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        updateCart();
    }

    function loadFromLocalStorage() {
        let data = localStorage.getItem(keyLocalStorage);
        
        cartItems = data ? JSON.parse(data) : [];
    }

    viewCartBtn.addEventListener("click", () => {
        loadFromLocalStorage();
        updateCart();
    });

    checkoutBtn.addEventListener("click", () => {
        // alert("Оформление заказа пока не реализовано");
        if (!document.querySelector(".checkout-box-container")) {
            const checkoutBoxContainer = document.createElement('div');
            checkoutBoxContainer.classList.add("checkout-box-container");
            checkoutBoxContainer.innerHTML = `
            <div class="checkout-box">
                <div class="checkout-box-content">
                    <div class="checkout-box-header">
                        <h2>Оформление заказа</h2>
                        <button class="close-checkout-box">&times;</button>
                    </div>
                    <p>Введите номер телефона, чтобы оператор доставки смог с вами связаться</p>
                    <div class="phone-order">
                        <input class="phone-number" type="tel" name="phoneNumber" placeholder="Введите номер телефона +7(999) 999-99-99" required>
                        <button class="place-order">ОФОРМИТЬ</button>
                    </div>
                </div>
            </div>
            `
            document.body.appendChild(checkoutBoxContainer);
            checkoutBoxContainer.style.display = "block";
            const closeCheckoutBoxBtn = document.querySelector(".close-checkout-box");
            closeCheckoutBoxBtn.addEventListener('click', () => {
                checkoutBoxContainer.style.display = "none";
            });
        } else {
            const checkoutBoxContainer = document.querySelector(".checkout-box-container");
            checkoutBoxContainer.style.display = "block";
            const closeCheckoutBoxBtn = document.querySelector(".close-checkout-box");
            closeCheckoutBoxBtn.addEventListener('click', () => {
                checkoutBoxContainer.style.display = "none";
            });
        }
    });

    const cartHeader = document.querySelector('.cart');
    const closeCartBtn = document.createElement('button');
    closeCartBtn.className = 'close-cart-btn';
    closeCartBtn.innerHTML = '&times;';
    cartHeader.appendChild(closeCartBtn);

    closeCartBtn.addEventListener('click', () => {
        cartContainer.style.display = "none";
        menuContainer.style.width = "100%";
    });

    const barsBtn = document.querySelector(".bars-btn");
    const filterMenuContainer = document.createElement("div");
    filterMenuContainer.classList.add("filter-menu");
    document.body.appendChild(filterMenuContainer);

    barsBtn.addEventListener("click", () => {
        displayFilterMenu();
        filterMenuContainer.classList.toggle("show");
    });

    function displayFilterMenu() {
        filterMenuContainer.innerHTML = "";

        categories.forEach(category => {
            const filterItem = document.createElement("div");
            filterItem.classList.add("filter-item");
            filterItem.textContent = category;
            if (category === previousCategory) {
                filterItem.classList.add("active");
            }

            filterItem.addEventListener("click", () => {
                filterMenu(category)
                filterMenuContainer.classList.toggle("show");
                previousCategory = category;
            });

            filterMenuContainer.appendChild(filterItem);
        });
    }

    function filterMenu(category) {
        if (category === "Всё") {
            displayMenu(menuItems);
        } else {
            const filteredMenu = menuItems.filter(item => item.category === category);
            menuContainer.innerHTML = "";
            displayMenu(filteredMenu);
        }

    }

    const upButton = document.querySelector(".arrow-up-btn");
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            upButton.classList.add("show-arrow-up-btn");
        } else {
            upButton.classList.remove("show-arrow-up-btn");
        }
    });

    upButton.addEventListener('click', () => {
        window.scrollTo(0, 0);
    });

    displayMenu(menuItems);
});