# Caching de consultas en Redis

Redis es un almacén de estructura de datos en memoria de código abierto (con licencia BSD) que se utiliza como base de datos, caché, intermediario de mensajes y motor de transmisión. Redis proporciona estructuras de datos como cadenas, hashes, listas, conjuntos, conjuntos ordenados con consultas de rango, mapas de bits, hiperloglogs, índices geoespaciales y flujos. Redis tiene replicación integrada, secuencias de comandos Lua, desalojo de LRU, transacciones y diferentes niveles de persistencia en el disco, y proporciona alta disponibilidad a través de Redis Sentinel y partición automática con Redis Cluster.

## Instalación de redis utilizando docker 

Para instalar redis en docker se puede realizar de dos maneras o mas, antes de empezar con la instalación es importante saber que redis tiene una configuración, o mejor dicho, un archivo de configuración llamado ___redis.conf___ el cual sirve para ir agregando las configuraciones que se requieran, en la [documentación oficial](https://redis.io/docs/manual/config/) viene algunos ejemplos del como usar estas configuraciones.

#### Instalación: forma 1

En esta primer manera de instalación se hace uso del archivo **docker-compose.yaml**. Se utilizara la imagen de [redis](https://hub.docker.com/_/redis), aquí lo importante es agregar la sentencia `command` para ejecutar el comando donde se agregar el archivo **redis.conf** y tambien se agrega una contraseña para poder acceder al redis-cli y manipular la información que se va guardando en redis. Para que esto funcione se tiene que agregar dos volumenes, uno para la configuración(ya que cuando no agregaba el volumen no podia conectarme a redis desde fuera del contenedor) y el otro para guardar los datos que se guardan en redis.

~~~
version: '3.8'
services:
  redis:
    container_name: redis
    image: redis:alpine
    command: redis-server /usr/local/etc/redis/redis.conf --requirepass pass
    ports:
      - '6379:6379'
    volumes:
      - './redis.conf:/usr/local/etc/redis/redis.conf'
      - './redis_data:/data'  
~~~

Se expuso el puerto 6379 para poder acceder a redis desde fuera.

#### Forma dos

En esta forma s ecomvinara el uso de **docker-compose.yaml** con un **dockerfile**, en este cas, en el dockerfile se agregan las instrucciones que tiene que realizar docker al crear la imagen y el contenedor. También se tiene que agregar el volumen para el archivo **redis.conf**.

___docker_compose.yaml___
~~~
version: '3.8'
services:
  redis:
    container_name: redis
    build: .
    ports:
      - '6379:6379'
    volumes:
      - './redis.conf:/usr/local/etc/redis/redis.conf'
      - './redis_data:/data'  
~~~

___dockerfile___
~~~
FROM redis
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
~~~

## Configuración de Redis


Redis puede iniciarse sin un archivo de configuración utilizando una configuración predeterminada integrada; sin embargo, esta configuración solo se recomienda con fines de prueba y desarrollo.

La forma correcta de configurar Redis es proporcionar un archivo de configuración de Redis, generalmente llamado redis.conf.

El archivo redis.conf contiene una serie de directivas que tienen un formato muy simple:

~~~
keyword argument1 argument2 ... argumentN
~~~

Ejemplo
~~~
replicaof 127.0.0.1 6380
~~~

En caso de no pasar ningun archivo de configuración a redis este tomara su configuración por defecto, como se comento anteriormente, en este caso, si se necesita mover a la configiración se tiene que ejecutar el comando
`docker exec -it nombre-contenedor redis-cli`, seguido de esto se entrara a este modo en la terminal, en la cual se puede ejecutar comandos, como por ejemplo agregar o modificar la contraseña para acceder a redis-cli.

~~~
127.0.0.1:6379>
127.0.0.1:6379>config set requierepass mypassword
127.0.0.1:6379>OK
127.0.0.1:6379>config get requirepass
127.0.0.1:6379>1)requirepass
127.0.0.1:6379>2) mypassword
~~~

Esto mismo se puede realizar para las demas configuraciones.

En caso de utilizar el archivo redis.conf se puede utlizar uno de los que se da en la [documentación oficial](https://redis.io/docs/manual/config/) y modificarlo de acuerdo a los requerimiendos que se soliciten. En este caso como se utlizara para realizar caching de consultas, se agregar la siguiente configuración

~~~
maxmemory 2mb
maxmemory-policy allkeys-lru
~~~

La opción `maxmemory` es para especificar el maximo de memoria que puede utilizar redis para guardar el cache.

La opción `maxmemory-policy` es para especificar como se ira manejando el cache guardado en memoria primaria. Algunas de las opciones son las siguientes: 

`volatile-lru` -> Desaloje utilizando LRU aproximado, solo claves con un conjunto de caducidad.

`allkeys-lru` -> Desaloje cualquier clave usando LRU aproximado.

`volatile-lfu` -> Desaloje usando LFU aproximado, solo claves con un conjunto de caducidad.

`allkeys-lfu` -> Desaloje cualquier clave usando LFU aproximado.

`volatile-random` -> Eliminar una clave aleatoria que tenga un conjunto de caducidad.

`allkeys-random` -> Eliminar una clave aleatoria, cualquier clave.

`volatile-ttl` -> Retire la clave con el tiempo de caducidad más cercano (TTL menor)

`noeviction` -> No desaloje nada, solo devuelva un error en las operaciones de escritura.

~~~
NOTA
LRU significa Usado menos recientemente
LFU significa Menos Frecuentemente Usado
~~~

Redis recomienda usar la siguiente [configuración](https://redis.io/docs/manual/config/#configuring-redis-as-a-cache) cuando se utiliza para cache
~~~
maxmemory 2mb
maxmemory-policy allkeys-lru
~~~


## Implementación de Redis con Node JS

Para realizar la implementación se utliza la libreria de [redis](https://www.npmjs.com/package/redis), para realizar la conexión puede realizar de la siguiente manera: 

```
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

await client.set('key', 'value');
const value = await client.get('key');
```

Se puede observar un ejemplo mas completo en esta [API REST](https://github.com/RicardoNLuisMateos/noderedisexpress/blob/07bef1df5252ed7a32d5db365753e26bb231f583/routers/characterRouter.js) a la cual se le integro el caching utlizando redis.