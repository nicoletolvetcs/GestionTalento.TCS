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
        salario = self.request.query_params.get('salario')
        moneda = self.request.query_params.get('moneda')

        if area:
            queryset = queryset.filter(especialidades__area_id=area).distinct()
        if especialidad:
            queryset = queryset.filter(especialidades__id_especialidad=especialidad)
        if nombre:
            queryset = queryset.filter(nombre_completo__icontains=nombre)
        if salario:
            # Si hay salario, filtramos asumiendo la moneda que viene del selector
            if moneda:
                queryset = queryset.filter(aspiracion_salarial__lte=salario, moneda=moneda)
            else:
                queryset = queryset.filter(aspiracion_salarial__lte=salario)
        elif moneda:
            # Si no hay salario pero por alguna razón cambian la moneda
            queryset = queryset.filter(moneda=moneda)
            
        return queryset

class EntrevistaViewSet(viewsets.ModelViewSet):
    queryset = Entrevista.objects.all()
    serializer_class = EntrevistaSerializer