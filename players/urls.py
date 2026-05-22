from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.task_list),
    path('tasks/<int:pk>/delete/', views.delete_task),
    path('tasks/<int:pk>/toggle/', views.toggle_task),
]