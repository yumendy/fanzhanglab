from django.shortcuts import render
from django.views.generic import TemplateView


class TestView(TemplateView):
    template_name = 'website/test_page.html'


class IndexView(TemplateView):
    template_name = 'website/index.html'
