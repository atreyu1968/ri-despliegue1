# Despliegue de Innovation Network Manager

Este repositorio contiene la configuración necesaria para desplegar la aplicación Innovation Network Manager usando Docker.

## Requisitos Previos

- Servidor Debian 11 o superior
- Mínimo 4GB RAM
- 20GB espacio en disco
- Acceso root al servidor

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/innovation-network-manager.git
cd innovation-network-manager
```

2. Ejecutar el script de despliegue:
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

El script realizará automáticamente:
- Instalación de Docker y Docker Compose
- Configuración de directorios y permisos
- Generación de contraseñas seguras
- Despliegue de contenedores

## Configuración Post-instalación

1. Verificar que los servicios están funcionando:
```bash
docker compose ps
```

2. Revisar los logs:
```bash
docker compose logs
```

3. Acceder a la aplicación:
- URL: http://tu-servidor:3000
- Credenciales por defecto:
  - Email: admin@redinnovacionfp.es
  - Contraseña: admin123

## Mantenimiento

### Backup de la Base de Datos

```bash
# Crear backup
docker exec innovation-db mysqldump -u root -p$(cat secrets/db_root_password.txt) innovation_network > backup.sql

# Restaurar backup
cat backup.sql | docker exec -i innovation-db mysql -u root -p$(cat secrets/db_root_password.txt) innovation_network
```

### Actualización de la Aplicación

```bash
# Actualizar código
git pull

# Reconstruir y reiniciar contenedores
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Monitoreo

- Revisar logs: `docker compose logs -f`
- Estado de contenedores: `docker compose ps`
- Uso de recursos: `docker stats`

## Solución de Problemas

### La base de datos no inicia

1. Verificar logs:
```bash
docker compose logs db
```

2. Verificar permisos:
```bash
ls -l secrets/
```

3. Reiniciar contenedor:
```bash
docker compose restart db
```

### La aplicación no responde

1. Verificar estado:
```bash
docker compose ps
```

2. Revisar logs:
```bash
docker compose logs app
```

3. Reiniciar aplicación:
```bash
docker compose restart app
```

### Problemas de conexión

1. Verificar red:
```bash
docker network ls
docker network inspect innovation_net
```

2. Verificar puertos:
```bash
netstat -tulpn | grep LISTEN
```

## Soporte

Para reportar problemas o solicitar ayuda:
1. Abrir un issue en el repositorio
2. Incluir logs relevantes y detalles del error
3. Describir los pasos para reproducir el problema

## Seguridad

- Las contraseñas se almacenan en `/secrets/`
- Los archivos de configuración son de solo lectura
- Las conexiones entre contenedores están aisladas
- Se implementan healthchecks para todos los servicios