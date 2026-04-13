from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Area(models.Model):
    id_area = models.AutoField(primary_key=True, db_column='id_area')
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'areas_trabajo'

    def __str__(self):
        return self.nombre

class Especialidad(models.Model):
    id_especialidad = models.AutoField(primary_key=True, db_column='id_especialidad')
    area = models.ForeignKey(Area, on_delete=models.CASCADE, db_column='area_id')
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'especialidades'

    def __str__(self):
        return self.nombre

class Candidato(models.Model):


    class EstatusCandidato(models.TextChoices):
        PENDIENTE = 'Pendiente', 'Pendiente'
        ELEGIBLE = 'Elegible', 'Elegible'
        EN_CARTERA = 'En Cartera', 'En Cartera'
        NO_ELEGIBLE = 'No Elegible', 'No Elegible'

    #  Enum para Disponibilidad ---
    class DisponibilidadChoices(models.TextChoices):
        INMEDIATA = 'Inmediata', 'Inmediata'
        QUINCENA = '15 días', '15 días'
        MES = '30 días', '30 días'
        REMOTO = 'Remoto', 'Remoto'
        PRESENCIAL = 'Presencial', 'Presencial'
        HIBRIDO = 'Híbrido', 'Híbrido'

    class MonedaChoices(models.TextChoices):
        USD = 'USD', 'USD'
        EUR = 'EUR', 'EUR'

    id_candidato = models.AutoField(primary_key=True, db_column='id_candidato')
    cedula = models.CharField(max_length=100, unique=True, db_column='numero_identificacion')
    fecha_nacimiento = models.DateField(null=True, blank=True)
    nombre_completo = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)
    telefono = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=100, blank=True)
    pais = models.CharField(max_length=100, blank=True)
    disponibilidad = models.CharField(max_length=100, blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    aspiracion_salarial = models.DecimalField(max_digits=12, decimal_places=2)
    url_documento_id = models.TextField(null=True, blank=True)
    url_referencias = models.TextField(null=True, blank=True)
    moneda = models.CharField(
        max_length=3,
        choices=MonedaChoices.choices,
        default=MonedaChoices.USD,
        db_column='moneda'
    )
    created_at = models.DateTimeField(auto_now_add=True)


    estatus = models.CharField(
        max_length=20,
        choices=EstatusCandidato.choices,
        default=EstatusCandidato.PENDIENTE,
        db_column='estatus' # Asegúrate de que coincida con tu Navicat
    )

    disponibilidad = models.CharField(
        max_length=50,
        choices=DisponibilidadChoices.choices,
        default=DisponibilidadChoices.INMEDIATA,
        db_column='disponibilidad'
    )
    # Relación Muchos a Muchos con Especialidades
    # 'through' le dice a Django que use exactamente tu tabla candidato_especialidad
    especialidades = models.ManyToManyField(Especialidad, db_table='candidato_especialidad')

    class Meta:
        db_table = 'candidatos'

    def __str__(self):
        return self.nombre_completo

class Entrevista(models.Model):
    id_entrevista = models.AutoField(primary_key=True, db_column='id_entrevista')
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE, db_column='candidato_id')
    entrevistador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, db_column='entrevistador_id')
    fecha_entrevista = models.DateTimeField()
    observaciones = models.TextField()
    eligibilidad = models.CharField(max_length=100) # En el diagrama dice "type", lo mapeamos como CharField
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'entrevistas'
        
