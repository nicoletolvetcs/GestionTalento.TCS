from django.contrib import admin
from .models import Area, Especialidad, Candidato, Entrevista

#Para que las tablas aparezcan en el tablero de admin
admin.site.register(Area)
admin.site.register(Especialidad)
admin.site.register(Candidato)
admin.site.register(Entrevista)