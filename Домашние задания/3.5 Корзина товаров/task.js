document.addEventListener('DOMContentLoaded', () => {
    const cart = document.querySelector('.cart');
    const cartProductsContainer = document.querySelector('.cart__products');

    loadCart();

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('product__quantity-control_dec')) {
            const valueEl = event.target.closest('.product__quantity-controls').querySelector('.product__quantity-value');
            let value = parseInt(valueEl.textContent);
            if (value > 1) {
                valueEl.textContent = value - 1;
            }
        }

        if (event.target.classList.contains('product__quantity-control_inc')) {
            const valueEl = event.target.closest('.product__quantity-controls').querySelector('.product__quantity-value');
            let value = parseInt(valueEl.textContent);
            valueEl.textContent = value + 1;
        }

        if (event.target.classList.contains('product__add')) {
            const product = event.target.closest('.product');
            addToCart(product);
        }

        if (event.target.classList.contains('cart__product-remove')) {
            const cartProduct = event.target.closest('.cart__product');
            cartProduct.remove();
            checkCartVisibility();
            saveCart();
        }
    });

    function addToCart(product) {
        const productId = product.dataset.id;
        const productImg = product.querySelector('.product__image');
        const quantityToAdd = parseInt(product.querySelector('.product__quantity-value').textContent);

        let cartItem = cartProductsContainer.querySelector(`.cart__product[data-id="${productId}"]`);

        if (cartItem) {
            const cartCountEl = cartItem.querySelector('.cart__product-count');
            cartCountEl.textContent = parseInt(cartCountEl.textContent) + quantityToAdd;
        } else {
            const imgSrc = productImg.src;
            const cartItemHTML = `
                <div class="cart__product" data-id="${productId}">
                    <img class="cart__product-image" src="${imgSrc}">
                    <div class="cart__product-count">${quantityToAdd}</div>
                    <div class="cart__product-remove">Удалить</div>
                </div>
            `;
            cartProductsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            cartItem = cartProductsContainer.querySelector(`.cart__product[data-id="${productId}"]`);
        }

        checkCartVisibility();

        animateAddToCart(productImg, cartItem);

        saveCart();
    }

    function animateAddToCart(sourceImg, targetCartItem) {
        const sourceRect = sourceImg.getBoundingClientRect();
        const targetRect = targetCartItem.getBoundingClientRect();

        const clone = sourceImg.cloneNode(true);
        clone.classList.add('flying-image');

        clone.style.left = `${sourceRect.left}px`;
        clone.style.top = `${sourceRect.top}px`;
        clone.style.width = `${sourceRect.width}px`;
        clone.style.height = `${sourceRect.height}px`;
        clone.style.position = 'fixed';
        clone.style.zIndex = '1000';
        clone.style.transition = 'all 0.8s ease-in-out';

        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.left = `${targetRect.left}px`;
            clone.style.top = `${targetRect.top}px`;
            clone.style.width = '20px';
            clone.style.height = '20px';
            clone.style.opacity = '0.3';
        });

        clone.addEventListener('transitionend', () => {
            clone.remove();
        });
    }

    function checkCartVisibility() {
        if (cartProductsContainer.children.length > 0) {
            cart.classList.add('cart_active');
        } else {
            cart.classList.remove('cart_active');
        }
    }

    function saveCart() {
        const cartItems = Array.from(cartProductsContainer.querySelectorAll('.cart__product')).map(item => ({
            id: item.dataset.id,
            src: item.querySelector('.cart__product-image').src,
            count: item.querySelector('.cart__product-count').textContent
        }));
        localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
        console.log('Корзина сохранена!');
    }

    function loadCart() {
        const data = localStorage.getItem('shoppingCart');
        if (!data) return;

        const cartItems = JSON.parse(data);
        cartItems.forEach(item => {
            const html = `
                <div class="cart__product" data-id="${item.id}">
                    <img class="cart__product-image" src="${item.src}">
                    <div class="cart__product-count">${item.count}</div>
                    <div class="cart__product-remove">Удалить</div>
                </div>
            `;
            cartProductsContainer.insertAdjacentHTML('beforeend', html);
        });
        checkCartVisibility();
    }
});