from rest_framework import viewsets
from .models import Area, Especialidad, Candidato, Entrevista
from .serializers import AreaSerializer, EspecialidadSerializer, CandidatoSerializer, EntrevistaSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer

class CandidatoViewSet(viewsets.ModelViewSet):
    queryset = Candidato.objects.all()
    serializer_class = CandidatoSerializer

    # Lógica del Buscador
    def get_queryset(self):
        queryset = Candidato.objects.all()
        area = self.request.query_params.get('area')
        especialidad = self.request.query_params.get('especialidad')
        nombre = self.request.query_params.get('nombre')

        if area:
            queryset = queryset.filter(especialidades__area_id=area).distinct()
        if especialidad:
            queryset = queryset.filter(especialidades__id_especialidad=especialidad)
        if nombre:
            queryset = queryset.filter(nombre_completo__icontains=nombre)
            
        return queryset

class EntrevistaViewSet(viewsets.ModelViewSet):
    queryset = Entrevista.objects.all()
    serializer_class = EntrevistaSerializer