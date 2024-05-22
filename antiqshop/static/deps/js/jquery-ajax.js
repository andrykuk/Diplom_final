"use strict";
document.addEventListener('DOMContentLoaded', function() {
    // Получаем  элемент для оповещений
    // let successMessage = document.getElementById('jq-notification');
    var successMessage = $("#jq-notification");
    // let successMessage = 'НОРМАЛЬНО';
    // console.log(successMessage);

    // let abh = document.querySelector("a.btn.add-to-cart");
    // console.log(document.querySelector("a.btn.add-to-cart"));
    // console.log(abh.href);
    // console.log(abh.getAttribute('href'));
    // console.log(abh.className);
    // console.log(abh.innerText, 'dhfls');
    // console.log(abh.getAttribute('data-product-id'));
    // console.log(abh.img);
    let butall = document.querySelectorAll("a.btn.add-to-cart");
    butall.forEach(elem=>elem.addEventListener('click', f1));
    function f1(evt){
        evt.preventDefault();
        let c = this.className
        // if (c == "btn add-to-cart") console.log('true');
        if (c == "btn add-to-cart") {
            let goodsInCartCount = document.getElementById('goods-in-cart-count');
            // console.log(document.getElementById('goods-in-cart-count'));
            // console.log(goodsInCartCount);
            let cartCount = parseInt(goodsInCartCount.textContent || '0');
            // console.log(cartCount);
            // Получаем id товара из атрибута data-product-id
        // let product_id = this.getAttribute('data-product-id');
            let product_id = this.getAttribute('data-product-id');
            // console.log(product_id, 'asdg');
            // Получаем ссылку на действие добавления в корзину
            let add_to_cart_url = this.href;
            // console.log(add_to_cart_url);
            // Токен CSRF для безопасной отправки формы
            let csrfmiddlewaretoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
            // console.log(csrfmiddlewaretoken);
            // let b = 40;
            // let data1 = {
            //     product_id: product_id,
            //     csrfmiddlewaretoken: csrfmiddlewaretoken
            // };
            // console.log(data1);
            //   делаем post запрос через ajax не перезагружая страницу
            $.ajax({
                type: "POST",
                url: add_to_cart_url,
                data: {
                    product_id: product_id,
                    csrfmiddlewaretoken: csrfmiddlewaretoken,
                },
                success: function (data) {
                 // Сообщение
                    successMessage.html(data.message);
                    successMessage.fadeIn(400);
                 // Через 7сек убираем сообщение
                    setTimeout(function () {
                        successMessage.fadeOut(400);
                    }, 7000);
                    if (data.no_cart == 1) {
                        // Получаем элемент контейнера, в котором находятся товары в корзине
                        let cartItemsContainer = document.getElementById("cart-items-container");
                        // Устанавливаем HTML-содержимое этого элемента
                        cartItemsContainer.innerHTML = data.cart_items_html;
                    } else {
                        // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                        cartCount++;
                        // console.log("cartCount", cartCount);
                        goodsInCartCount.textContent = cartCount;
                        // Получаем элемент контейнера, в котором находятся товары в корзине
                        let cartItemsContainer = document.getElementById("cart-items-container");

                        // Устанавливаем HTML-содержимое этого элемента
                        cartItemsContainer.innerHTML = data.cart_items_html;
                    }

                //  // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                //     cartCount++;
                //     // console.log("cartCount", cartCount);
                //     goodsInCartCount.textContent = cartCount;
                //     // goodsInCartCount.text(cartCount);
                //     // let goodsInCartCount = document.getElementById('goods-in-cart-count');
                //     // console.log('новое значение', goodsInCartCount);
                //     // console.log(cart_items_html);


                //  // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                //     // let cartItemsContainer = $("#cart-items-container");
                //     // cartItemsContainer.html(data.cart_items_html);
                //     // Получаем элемент контейнера, в котором находятся товары в корзине
                //     let cartItemsContainer = document.getElementById("cart-items-container");

                //     // Устанавливаем HTML-содержимое этого элемента
                //     cartItemsContainer.innerHTML = data.cart_items_html;

                },

                error: function (data) {
                    console.log("Ошибка при добавлении товара в корзину");
                },
            });
//             fetch(add_to_cart_url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json;charset=utf-8',
//                 },
// //                body: 'product_id=' + product_id + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken,
//                 body: JSON.stringify(data),
//             })
//             // console.log(JSON.stringify(data));
//             .then(response => response.json())
//             .then(r =>  r.json().then(data => ({status: r.status, body: data})))
//             .then(obj => console.log(obj));
            // .then(data => {
            //     console.log(response);
                // successMessage.innerHTML = data.message;
                // successMessage.style.display = 'block';
                // setTimeout(function () {
                //     successMessage.style.display = 'none';
                //     }, 7000);

                // cartCount++;
                // goodsInCartCount.textContent = cartCount;

                // let cartItemsContainer = document.getElementById('cart-items-container');
                // cartItemsContainer.innerHTML = data.cart_items_html;
            // })
            // .catch(error => {
            //     console.error('Ошибка при добавлении товара в корзину', error);
            // });
        };
    };
         // Ловим собыитие клика по кнопке удалить товар из корзины
     $(document).on("click", ".remove-from-cart", function (e) {
         
         e.preventDefault();

         // Берем элемент счетчика в значке корзины и берем оттуда значение
         var goodsInCartCount = $("#goods-in-cart-count");
         var cartCount = parseInt(goodsInCartCount.text() || 0);

         // Получаем id корзины из атрибута data-cart-id
         var cart_id = $(this).data("cart-id");
         // Из атрибута href берем ссылку на контроллер django
         var remove_from_cart = $(this).attr("href");

         // делаем post запрос через ajax не перезагружая страницу
         $.ajax({

             type: "POST",
             url: remove_from_cart,
             data: {
                 cart_id: cart_id,
                 csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
             },
             success: function (data) {
                 // Сообщение
                 successMessage.html(data.message);
                 successMessage.fadeIn(400);
                 // Через 7сек убираем сообщение
                 setTimeout(function () {
                     successMessage.fadeOut(400);
                 }, 7000);

                 // Уменьшаем количество товаров в корзине (отрисовка)
                 cartCount -= data.quantity_deleted;
                 goodsInCartCount.text(cartCount);

                 // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                 var cartItemsContainer = $("#cart-items-container");
                 cartItemsContainer.html(data.cart_items_html);

             },

             error: function (data) {
                 console.log("Ошибка при добавлении товара в корзину");
             },
         });
     });




    
    
    
    // let butremove = document.querySelectorAll("a.remove-from-cart");
    // butremove.forEach(elem=>elem.addEventListener('click', f2));
    // function f2(evt){
    //     evt.preventDefault();
    //     let goodsInCartCount = document.getElementById('goods-in-cart-count');
    //     console.log(document.getElementById('goods-in-cart-count'));
    //     console.log(goodsInCartCount);
    //     let cartCount = parseInt(goodsInCartCount.textContent || '0');
    //     console.log(cartCount);
    //     let cart_id = this.getAttribute('data-cart-id');
    //     console.log(cart_id, 'gfdh');
    //     let remove_from_cart = this.href;
    //     console.log(remove_from_cart);
    //     // Токен CSRF для безопасной отправки формы
    //     let csrfmiddlewaretoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    //     console.log(csrfmiddlewaretoken);
    //     let g1 = 50;

    //     $.ajax({
    //         type: "POST",
    //         url: remove_from_cart,
    //         data: {
    //             cart_id: cart_id,
    //             csrfmiddlewaretoken: csrfmiddlewaretoken,
    //         },
    //         success: function (data) {
    //              // Сообщение
    //             successMessage.html(data.message);
    //             successMessage.fadeIn(400);
    //              // Через 7сек убираем сообщение
    //             setTimeout(function () {
    //                 successMessage.fadeOut(400);
    //             }, 7000);

    //              // Уменьшаем количество товаров в корзине (отрисовка)
    //             cartCount -= data.quantity_deleted;
    //             goodsInCartCount.textContent = cartCount;

    //              // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
    //             //  let cartItemsContainer = $("#cart-items-container");
    //             //  cartItemsContainer.html(data.cart_items_html);
    //              // Получаем элемент контейнера, в котором находятся товары в корзине
    //              let cartItemsContainer = document.getElementById("cart-items-container");

    //              // Устанавливаем HTML-содержимое этого элемента
    //              cartItemsContainer.innerHTML = data.cart_items_html;

    //         },

    //         error: function (data) {
    //             console.log("Ошибка при добавлении товара в корзину");
    //         },
    //     });
    // };
    // Берем из разметки элемент по id - оповещения от django
    var notification = $('#notification');
    // И через 7 сек. убираем
    if (notification.length > 0) {
        setTimeout(function () {
            notification.alert('close');
        }, 7000);
    }
    document.getElementById('modalButton').addEventListener('click', function () {
        $('#exampleModal').appendTo('body');
        $('#exampleModal').modal('show');
    //     // не работает
    //     // let exampleModal = document.getElementById('exampleModal');
    //     // // document.body.appendChild(exampleModal);
    //     // let modal = new bootstrap.Modal(exampleModal);
    //     // modal.show();
    });
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll("input[name='requires_delivery']").forEach(input => {
          input.addEventListener('change', function() {
            const deliveryAddressField = document.getElementById('deliveryAddressField');
            if (this.value === "1") {
              deliveryAddressField.classList.remove('d-none');
            } else {
              deliveryAddressField.classList.add('d-none');
            }
          });
        });
      });
    

   
});

           