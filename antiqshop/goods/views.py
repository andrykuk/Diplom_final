from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.views.generic import ListView
from goods.models import Category, Products
from goods.utils import q_search


# Create your views here.

class CatalogList(ListView):
    model = Products
    template_name = 'goods/catalog.html'
    context_object_name = 'goods'
    paginate_by = 3


    def get_queryset(self, category_slug=None):
        queryset = super().get_queryset()
        category_slug = self.kwargs.get('category_slug')  # Получаем slug из
        query = self.request.GET.get('q', None)
        on_sale = self.request.GET.get('on_sale', None)
        order_by = self.request.GET.get('order_by', None)
        if category_slug == 'goods':
            queryset = Products.objects.all()
        elif query:
            queryset = q_search(query)
        else:
            queryset = get_list_or_404(Products.objects.filter(category__slug=category_slug))
        if on_sale:
            queryset = queryset.filter(discount__gt=0)

        if order_by and order_by != 'default':
            queryset = queryset.order_by(order_by)
        return queryset


    def get_context_data(self, category_slug=None, **kwargs):
        context = super().get_context_data(**kwargs)
        category_slug = self.kwargs.get('category_slug')
        paginator = Paginator(context['object_list'], self.paginate_by)
        page = self.request.GET.get('page', 1)
        query = self.request.GET.get('q', None)
        if query:
            goods = q_search(query)
        # current_page = paginator.page(int(page))
        context['title'] = 'Главная страница'
        context['goods'] = paginator.get_page(page)
        # context['goods'] = current_page
        context['slug_url'] = category_slug
        return context


def product(request, product_slug):
    # product = Products.objects.get(id=product_id)
    product = get_object_or_404(Products, slug=product_slug)
    context = {
        'product': product
    }
    return render(request, 'goods/product.html', context=context)
