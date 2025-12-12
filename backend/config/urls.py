from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    # api endpoints for user detail and list view
    path('api/v1/users/',views.UserListView.as_view(), name='user-list'),
    path('api/v1/users/<path:dn>/',views.UserDetailView.as_view(),name='user-detail'),

    # api endpoints for computer detail and list view
    path('api/v1/computers/', views.ComputerListView.as_view(), name='computer-list'),
    path('api/v1/computers/<path:dn>/', views.ComputerDetailView.as_view(), name='computer-detail'),

    # api endpoints for group detail and list view
    path('api/v1/groups/', views.GroupListView.as_view(), name='group-list'),
    path('api/v1/groups/<path:dn>/', views.GroupDetailView.as_view(), name='group-detail'),

    # api endpoint for dashboard stats
    path('api/v1/dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
]
