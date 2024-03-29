from django.http import HttpResponse
from django.shortcuts import render
from goods.models import Category
from main.models import SiteInf1


# Create your views here.
def index(request):
    # category = Category.objects.all() # Перемещаем в пользовательский тэг
    context = {
        'title': 'Главная страница',
        'content': 'Магазин антиквариата',
        # 'category': category
    }
    return render(request, 'main/index.html', context)


def about(request):
    inform = SiteInf1.objects.all()
    a = inform[0]
    context = {
        'title': 'О магазине',
        'content': 'Краткая информация о магазине',
        'inform': a.about,
    }
    return render(request, 'main/about.html', context)


def delivery(request):
    inform = SiteInf1.objects.all()
    a = inform[0]
    context = {
        'title': 'Доставка и оплата',
        'content': 'Информация о доставке и оплате',
        'inform': a.delivery,
    }
    return render(request,'main/delivery.html', context)

def inform_contact_shop (request):
    inform = SiteInf1.objects.all()
    a = inform[0]
    context = {
        'title': 'Контактная информация',
        'content': 'Контактная информация',
        'inform': a.contact,
    }
    return render(request,'main/inform_contact_shop.html', context)



