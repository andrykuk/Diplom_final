from django.db import models
from django.urls import reverse


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, db_index=True, verbose_name='Название')
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='URL')

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категорию'
        verbose_name_plural = 'Категории'

    # def get_absolute_url(self):
    #     return reverse('category', kwargs={'cat_slug': self.slug})

class Products(models.Model):
    # class Status(models.IntegerChoices):
    #     DRAFT = 0, 'Черновик'
    #     PUBLISHED = 1, 'Опубликовано'

    # title = models.CharField(max_length=255, verbose_name='Заголовок')
    name = models.CharField(max_length=255, unique=True, verbose_name='Название')
    # Сначала делаем первый slug чтобы создать столбец, а потом добавляем уникальность
    # slug = models.SlugField(max_length=255, blank=True, db_index=True, default='')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name='URL')
    # slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name='Slug')
    # content = models.TextField(blank=True, verbose_name='Текст описания товара')
    description = models.TextField(blank=True, null=True, verbose_name='Текст описания товара')
    # photo = models.ImageField(upload_to="photos/%Y/%m/%d/", default=None, blank=True, null=True,
    #                           verbose_name="Фото")
    image = models.ImageField(upload_to="goods_images", blank=True, null=True, verbose_name="Изображение")
    price = models.DecimalField(default=0.00, max_digits=8, decimal_places=2, verbose_name='Цена')
    discount = models.DecimalField(default=0.00, max_digits=8, decimal_places=2, verbose_name='Шаг аукционного товара')
    quantity = models.PositiveIntegerField(default=0, verbose_name='Количество')
    # time_create = models.DateTimeField(auto_now_add=True, verbose_name='Время создания')
    # time_update = models.DateTimeField(auto_now=True, verbose_name='Время изменения')
    # is_published = models.BooleanField(choices=tuple(map(lambda x: (bool(x[0]), x[1]), Status.choices)),
    #                                    default=Status.DRAFT, verbose_name='Статус')
    # cat = models.ForeignKey('Category', on_delete=models.PROTECT, null=True) # сначала надо ТАК!!
    category = models.ForeignKey('Category', on_delete=models.PROTECT, null=True, verbose_name='Категория')
    # cat = models.ForeignKey('Category', on_delete=models.PROTECT, related_name='posts',
    #                         verbose_name='Категория')  # миграция - пункт 2 выбрать
    # tags = models.ManyToManyField('TagPost', blank=True, related_name='tags', verbose_name='Тэги')
    # husband = models.OneToOneField('Husband', on_delete=models.SET_NULL,
    #                                null=True, blank=True, related_name='wuman', verbose_name='Муж')

    objects = models.Manager()
    # published = PublishedManager()

    def __str__(self):
        return f'{self.name} Количество: {self.quantity}'

    class Meta:
        verbose_name = 'Аукционный товар'
        verbose_name_plural = 'Аукционные товары'
        ordering = ('id',)

    def display_id(self):
        return f'{self.id:03}'

    def sell_price(self):
        return self.price

    def get_absolute_url(self):
        return reverse('catalog:product', kwargs={'product_slug': self.slug})
