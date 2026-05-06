from rest_framework import serializers
from .models import Area, Especialidad, Candidato, Entrevista, Contratacion
import re
from django.utils.html import strip_tags


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

    def to_internal_value(self, data):
        """
        Antes de que cualquier dato llegue a los validadores,
        limpiamos todos los campos de texto de posibles tags HTML.
        """
        cleaned = super().to_internal_value(data)
        for field_name, value in cleaned.items():
            if isinstance(value, str):
                cleaned[field_name] = strip_tags(value)
        return cleaned

    def get_area_nombre(self, obj):
        primera_especialidad = obj.especialidades.first()
        if primera_especialidad:
            return primera_especialidad.area.nombre
        return None
    
    def validate_nombre_completo(self, value):
        """
        1. Elimina etiquetas HTML maliciosas (<script>, etc.)
        2. Limpia espacios extras al inicio/final
        3. Fuerza formato Título (primera letra mayúscula)
        4. Rechaza si contiene números
        """
        # Anti-XSS: eliminar cualquier <tag> HTML
        value = strip_tags(value)
        # Saneamiento: espacios y capitalización
        value = value.strip().title()
        # Validación: no puede contener números
        if re.search(r'\d', value):
            raise serializers.ValidationError(
                "El nombre no puede contener números."
            )
        # Validación: no puede estar vacío después de la limpieza
        if not value:
            raise serializers.ValidationError(
                "El nombre no puede estar vacío."
            )
        return value 
    
    def validate_cedula(self, value):
        """
        1. Elimina etiquetas HTML
        2. Elimina puntos, guiones y espacios
        3. Fuerza la letra inicial a mayúscula
        4. Valida formato V/E + números
        """
        value = strip_tags(value)
        # Eliminar caracteres que el usuario podría añadir (V-12.345.678)
        value = re.sub(r'[\s.\-]', '', value)
        # Forzar mayúscula en la primera letra
        value = value[0].upper() + value[1:] if value else value
        # Validar formato final
        if not re.match(r'^[VE]\d{6,9}$', value):
            raise serializers.ValidationError(
                "La identificación debe comenzar con V o E seguido de 6 a 9 dígitos. Ejemplo: V12345678"
            )
        candidato_actual = self.instance
        qs = Candidato.objects.filter(cedula=value)
        if candidato_actual:
            qs = qs.exclude(pk=candidato_actual.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "Ya existe un candidato registrado con esta cédula. Si ya te registraste, consulta tu estatus."
            )
        return value
    
    def validate_telefono(self, value):
        """
        1. Elimina etiquetas HTML
        2. Si falta el espacio después de +58, lo inserta
        3. Valida el formato internacional venezolano
        """
        value = strip_tags(value)
        # Insertar espacio si el usuario escribió +584121234567
        if value.startswith('+58') and len(value) > 3 and value[3] != ' ':
            value = '+58 ' + value[3:]
        # Eliminar espacios extras internos (pero preservar el de +58 X)
        partes = value.split()
        if len(partes) >= 2:
            value = partes[0] + ' ' + ''.join(partes[1:])
        # Validar formato final
        if not re.match(r'^\+58\s4\d{9}$', value):
            raise serializers.ValidationError(
                "El teléfono debe tener el formato +58 4XX XXXXXXX. Ejemplo: +58 4121234567"
            )
        return value
    
    def validate_email(self, value):
        """
        1. Limpia HTML y espacios
        2. Fuerza minúsculas
        3. Verifica que sea único en la BD
        """
        value = strip_tags(value).strip().lower()
        # Verificar unicidad (excluir el candidato actual si es update)
        candidato_actual = self.instance
        qs = Candidato.objects.filter(email=value)
        if candidato_actual:
            qs = qs.exclude(pk=candidato_actual.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "Ya existe un candidato registrado con este correo electrónico."
            )
        return value

    def validate(self, data):
        """
        Validaciones cruzadas entre campos (aspiracion y moneda)
        """
        aspiracion = data.get('aspiracion_salarial')
        moneda = data.get('moneda')
        if aspiracion and not moneda:
            raise serializers.ValidationError({
                'moneda': 'Si indica una aspiración salarial, debe seleccionar una moneda (USD/EUR).'
            })
        return data


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
                'observaciones', 'eligibilidad', 'puntuacion_tecnica', 
                'puntuacion_comunicacion', 'puntuacion_interes', 
                'justificacion_dictamen','created_at']
    def validate (self,data):
        user = self.context['request'].user
        if user.group.filter(name='Entrevistador').exists():
            if 'candidato' in data:
                raise serializers.ValidationError("Los entrevistadores no pueden cambiar al candidato.")
        return data


class ContratacionSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Contratacion.
    Regla de Negocio: Al crear una contratación, el estatus del candidato
    se actualiza automáticamente a 'Contratado'.
    """
    # Campos de solo lectura para mostrar en respuestas
    candidato_nombre = serializers.ReadOnlyField(source='candidato.nombre_completo')
    area_nombre = serializers.ReadOnlyField(source='area_definitiva.nombre')
    procesado_por_nombre = serializers.ReadOnlyField(source='procesado_por.username')

    class Meta:
        model = Contratacion
        fields = [
            'id', 'candidato', 'candidato_nombre',
            'area_definitiva', 'area_nombre',
            'fecha_ingreso', 'salario_acordado', 'moneda_salario',
            'procesado_por', 'procesado_por_nombre',
            'created_at',
        ]
        read_only_fields = ['procesado_por', 'created_at']

    def create(self, validated_data):
        """
        Al crear la contratación, automáticamente cambiamos el estatus
        del candidato asociado a 'Contratado'.
        """
        contratacion = super().create(validated_data)

        # Actualizar estatus del candidato
        candidato = contratacion.candidato
        candidato.estatus = Candidato.EstatusCandidato.CONTRATADO
        candidato.save(update_fields=['estatus'])

        return contratacion

    def validate_candidato(self, value):
        """
        Validar que el candidato esté en estatus 'Elegible' antes de contratarlo.
        """
        if value.estatus != Candidato.EstatusCandidato.ELEGIBLE:
            raise serializers.ValidationError(
                f"Solo se puede contratar a un candidato con estatus 'Elegible'. "
                f"El estatus actual de {value.nombre_completo} es '{value.estatus}'."
            )
        return value