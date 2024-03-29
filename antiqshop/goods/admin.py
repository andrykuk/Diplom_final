from django.contrib import admin
from goods.models import Category, Products

# admin.site.register(Category)
# admin.site.register(Products)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ['name','slug']


@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ['name', 'quantity', 'price', 'discount']
    list_editable = ['discount',]
    search_fields = ['name', 'description']
    list_filter = ['discount', 'quantity', 'category']
    fields = [
        'name',
        'category',
        'slug',
        'description',
        'image',
        'price',
        'discount',
        'quantity',
    ]