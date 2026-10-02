from django.urls import path
from . import views
urlpatterns=[
    path("funds/",views.fund_list,name="fund_list"),
    path("funds/<str:fund_code>/",views.fund_detail,name="fund_detail")
]