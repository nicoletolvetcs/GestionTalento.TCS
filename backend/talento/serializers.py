from rest_framework import serializers
from .models import Area, Especialidad, Candidato, Entrevista


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id_area', 'nombre', 'activo']

class EspecialidadSerializer(serializers.ModelSerializer):
    area_nombre = serializers.ReadOnlyField(source='area.nombre')
    class Meta:
        model = Especialidad
        fields = ['id_especialidad', 'area', 
                'area_nombre', 
                'nombre', 'activo', 'created_at']

class CandidatoSerializer(serializers.ModelSerializer):
    area_nombre = serializers.SerializerMethodField()
    especialidades_detalle = EspecialidadSerializer(source='especialidades', many=True, read_only=True)

    def get_area_nombre(self, obj):
        primera_especialidad = obj.especialidades.first()
        if primera_especialidad:
            return primera_especialidad.area.nombre
        return None

    class Meta:
        model = Candidato
        fields = ['id_candidato', 'cedula', 
                'fecha_nacimiento', 'nombre_completo',
                 'email', 'telefono', 'ciudad', 'pais', 
                 'disponibilidad', 'direccion', 
                 'aspiracion_salarial', 'moneda', 'url_documento_id', 
                 'url_referencias', 'created_at', 
                 'especialidades_detalle','area_nombre', 'especialidades', 'estatus']

class EntrevistaSerializer(serializers.ModelSerializer):
    candidato_nombre = serializers.ReadOnlyField(source='candidato.nombre_completo')
    entrevistador_nombre = serializers.ReadOnlyField(source='entrevistador.username')

    class Meta:
        model = Entrevista
        fields = ['id_entrevista', 'candidato', 
                'candidato_nombre', 'entrevistador', 
                'entrevistador_nombre', 'fecha_entrevista', 
                'observaciones', 'eligibilidad', 'created_at']