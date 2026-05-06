from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AreaViewSet, EspecialidadViewSet, CandidatoViewSet,
    EntrevistaViewSet, ContratacionViewSet,
    RegistrarCandidatoPublico, ListarEntrevistadores,
    CustomLoginView, ConsultarEstatusCandidato,
    ConfiguracionAreas,
)


router = DefaultRouter()
router.register(r'areas', AreaViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'candidatos', CandidatoViewSet)
router.register(r'entrevistas', EntrevistaViewSet)
router.register(r'contrataciones', ContratacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/login/', CustomLoginView.as_view(), name='login'),
    path('registro-publico/', RegistrarCandidatoPublico.as_view(), name='registro-publico'),
    path('entrevistadores/', ListarEntrevistadores.as_view(), name='listar-entrevistadores'),
    path('consulta/<str:cedula>/', ConsultarEstatusCandidato.as_view(), name='consultar-estatus'),
    path('configuracion-areas/', ConfiguracionAreas.as_view(), name='configuracion-areas'),
]
