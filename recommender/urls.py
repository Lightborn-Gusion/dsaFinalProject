# recommender/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('recommend/<int:movie_id>/', views.recommend, name='recommend'),
    path('movie-list/', views.movie_list, name='movie_list'),
    path('upcoming/', views.upcoming, name='upcoming'),
    path('all-movies/', views.all_movies, name='all_movies'),
]