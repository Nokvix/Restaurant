document.addEventListener("DOMContentLoaded", () => {
    // Получаем необходимые элементы из документа
    const menuContainer = document.querySelector(".menu");
    const cartContainer = document.querySelector(".cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalAmountSpan = document.querySelector(".total-amount");
    const viewCartBtn = document.querySelector(".view-cart-btn");
    const checkoutBtn = document.querySelector(".checkout-btn");

    // Массив объектов с предложениями в меню
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

    // Массив для хранения выбранных элементов корзины
    let cartItems = [];

    // Функция для отображения меню на веб-странице
    function displayMenu() {
        // Очищаем контейнер меню
        menuContainer.innerHTML = "";
        // Создаем элементы для каждого блюда в меню
        menuItems.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.className = "menu-item";
            // Выводим информацию о блюде и кнопку "Добавить в корзину"
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
            // Добавляем элемент меню в контейнер
            menuContainer.appendChild(menuItem);
        });

        // Добавляем слушатель событий для кнопок "Добавить в корзину"
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

        // Добавляем слушатели событий для кнопок управления количеством
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
                quantityElement.dataset.quantity = quantity; // Обновляем атрибут data-quantity
            });
        });
    }

    // Функция для добавления выбранного элемента в корзину
    function addToCart(itemId, quantity = 1) {
        const selectedItem = menuItems.find(item => item.id === itemId);

        // Проверяем, есть ли уже такой элемент в корзине
        const existingItem = cartItems.find(item => item.id === itemId);

        if (existingItem) {
            // Если элемент уже есть в корзине, увеличиваем его количество
            existingItem.quantity += quantity;
        } else {
            // Если элемента еще нет в корзине, добавляем его с указанным количеством
            selectedItem.quantity = quantity;
            cartItems.push(selectedItem);
        }

        updateCart();
    }

    // Функция для обновления содержимого корзины и отображения на странице
    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalAmount = 0;

        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.className = "cart-item";
            // Выводим информацию о элементе корзины
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
            // Добавляем элемент корзины в контейнер
            cartItemsContainer.appendChild(cartItem);
            totalAmount += item.price * item.quantity;
        });

        // Обновляем общую сумму и отображаем корзину
        totalAmountSpan.textContent = totalAmount;
        cartContainer.style.display = "block";
        cartContainer.style.width = "20%";
        menuContainer.style.width = "80%";
        const headerHeight = document.querySelector('header').offsetHeight;
        cartContainer.style.top = headerHeight + "px";


        // Добавляем слушатели событий для кнопок управления количеством и удаления из корзины
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

    // Слушатель события для кнопки "Смотреть корзину"
    viewCartBtn.addEventListener("click", function () {
        updateCart();
    });

    // Слушатель события для кнопки "Checkout"
    checkoutBtn.addEventListener("click", function () {
        alert("Оформление заказа пока не реализовано");
    });

    const cartHeader = document.querySelector('.cart');
    const closeCartBtn = document.createElement('button');
    closeCartBtn.className = 'close-cart-btn';
    closeCartBtn.innerHTML = '&times;';
    cartHeader.appendChild(closeCartBtn);

    // Слушатель события для кнопки закрытия корзины
    closeCartBtn.addEventListener('click', function () {
        cartContainer.style.display = "none";
        menuContainer.style.width = "100%";
    });

    // Вызываем функцию отображения меню при загрузке страницы
    displayMenu();
});