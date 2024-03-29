
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import render, redirect
from django.forms import ValidationError

from carts.models import Cart
from orders.forms import CreateOrderForm
from orders.models import Order, OrderItem
from goods.models import Products

@login_required
def create_order(request):
    if request.method == 'POST':
        form = CreateOrderForm(data=request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    user = request.user
                    cart_items = Cart.objects.filter(user=user)
                    # Создаем заказ
                    if cart_items.exists():
                        order = Order.objects.create(
                            user=user,
                            phone_number=form.cleaned_data['phone_number'],
                            requires_delivery=form.cleaned_data['requires_delivery'],
                            delivery_address=form.cleaned_data['delivery_address'],
                            payment_on_get=form.cleaned_data['payment_on_get'],
                        )
                        # Создаем заказанные товары
                        for cart_item in cart_items:
                            product = cart_item.product
                            name = cart_item.product.name
                            price = cart_item.product.price
                            quantity = cart_item.quantity
                            if product.quantity < quantity:
                                raise ValidationError(f'Недостаточное количество товара {name} на складе\
                                                        В наличии- {product.quantity}')
                            OrderItem.objects.create(
                                order=order,
                                product=product,
                                name=name,
                                price=price,
                                quantity=quantity,
                            )
                            product.quantity -= quantity
                            product.save()
                        # Очистить корзину пользователя после создания заказа
                        cart_items.delete()
                        messages.success(request, 'Ваш заказ оформлен')
                        return redirect('user:profile')
            except ValidationError as e:
                messages.success(request, str(e))
                return redirect('cart:order')
    else:
        initial = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            }
        form = CreateOrderForm(initial=initial)
    context = {
        'title': 'Антикварный магазин - Оформление заказа',
        'form': form,
        'order': True,
    }
    return render(request, 'orders/create_order.html', context)

