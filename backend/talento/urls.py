from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AreaViewSet, EspecialidadViewSet, CandidatoViewSet, EntrevistaViewSet
from django.urls import path
from .views import CustomLoginView



router = DefaultRouter()
router.register(r'areas', AreaViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'candidatos', CandidatoViewSet)
router.register(r'entrevistas', EntrevistaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/login/', CustomLoginView.as_view(), name='login'),
]
