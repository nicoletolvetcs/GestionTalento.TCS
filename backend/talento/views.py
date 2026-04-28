from rest_framework import viewsets, permissions
from .models import Area, Especialidad, Candidato, Entrevista
from .serializers import AreaSerializer, EspecialidadSerializer, CandidatoSerializer, EntrevistaSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .models import Candidato


class ConsultarEstatusCandidato(APIView):
    permission_classes = [permissions.AllowAny]

    MESES_ES = {
        'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
        'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
        'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
        'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre',
    }

    def get(self, request, cedula):
        candidato = get_object_or_404(Candidato, cedula=cedula)

        # Extraer las áreas únicas a través de las especialidades del candidato
        areas = list(
            candidato.especialidades.values_list('area__nombre', flat=True).distinct()
        )

        # Formatear fecha en español
        fecha_es = None
        if candidato.created_at:
            fecha_raw = candidato.created_at.strftime("%d de %B de %Y")
            for en, es in self.MESES_ES.items():
                fecha_raw = fecha_raw.replace(en, es)
            fecha_es = fecha_raw

        return Response({
            "nombre_completo": candidato.nombre_completo,
            "estatus": candidato.estatus,
            "areas": areas,
            "fecha_aplicacion": fecha_es,
        }, status=status.HTTP_200_OK)



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Extraemos información de self.user
        data['nombre_completo'] = f"{self.user.first_name} {self.user.last_name}"
        data['username'] = self.user.username
        
        # Determinamos el rol basado en el grupo 
        # Asegurase de que en el admin se llamen RRHH y Entrevistador CHEQUEARRR
        grupo = self.user.groups.first()
        data['rol'] = grupo.name if grupo else 'Sin Rol'
        
        return data


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        grupo = user.group.first()

        # Si el usuario es parte del grupo entrevistadores, solo puede ver los candidatos asignados a el. 
        if grupo and grupo.name == 'RRHH':
           return Entrevista.objects.all().order_by('-created_at')
        elif grupo and grupo.name == 'Entrevistador':
            return Entrevista.objects.filter(entrevistador=user).order_by('-created_at')
        else:
            return Entrevista.objects.none()
        
        # Filtro por candidato
        candidato_id = self.request.query_params.get('candidato')
        if candidato_id is not None:
            queryset = queryset.filter(candidato_id=candidato_id)
        return queryset
   
    def perform_create(self, serializer):
        grupo = self.request.user.group.first()
        if not grupo and grupo.name != "RRHH":
            raise PermissionDenied("Acceso Denegado: Solo el personal de RR.HH. puede agendar y crear entrevistas.")
        serializer.save()