from django.db import models


class SiteInf1(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    # slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    about = models.TextField(blank=True, verbose_name='Информация о магазине')
    delivery = models.TextField(blank=True, verbose_name='Информация о доставке и оплате')
    contact = models.TextField(blank=True, verbose_name='Контактная информация')

    objects = models.Manager()

    class Meta:
        verbose_name = 'Информация о магазине'
        verbose_name_plural = 'Информация о магазине'

    def __str__(self):
        return self.name

