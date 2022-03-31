# Redis

Redis es un almacén de estructura de datos en memoria de código abierto (con licencia BSD) que se utiliza como base de datos, caché, intermediario de mensajes y motor de transmisión. Redis proporciona estructuras de datos como cadenas, hashes, listas, conjuntos, conjuntos ordenados con consultas de rango, mapas de bits, hiperloglogs, índices geoespaciales y flujos. Redis tiene replicación integrada, secuencias de comandos Lua, desalojo de LRU, transacciones y diferentes niveles de persistencia en el disco, y proporciona alta disponibilidad a través de Redis Sentinel y partición automática con Redis Cluster.

## Instalación de redis con docker 

Para instalar redis en docker se puede realizar de dos maneras o mas, antes de empezar con la instalación es importante saber que redis tiene una configuración, o mejor dicho, un archivo de configuración llamado ___redis.conf___ el cual sirve para ir agregando las configuraciones que se requieran, en la [documentación oficial](https://redis.io/docs/manual/config/) viene algunos ejemplos del como usar estas configuraciones.
