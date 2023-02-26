# Implement Sentry With Codeigniter


## Preparando Entorno de desarrollo
1-. Se tiene que tener instaldo docker y docker compose.

2-. Crear DockerFile con una imagen de PHP y Composer instalado para poder instalar Sentry




## Instalación de Sentry en Codeigniter

### Dockerfile 

Para instalar la librería de Sentry en Codeigniter se hace uso de composer,
```docker
FROM php:7.3-apache

#Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN a2enmod rewrite
# Install unzip utility and libs needed by zip PHP extension 
RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev \
    unzip
RUN docker-php-ext-install zip
```

### Docker Compose

En el docker compose se define los volumenes, la ruta de este mismo, los puerto con el cual podremos acceder a la app y la ruta del dockerfile, en este caso se tiene la siguiente estrutura de carpetas: 

**NOTA:** Dentro de la carpeta "app" se tiene el proyecto de Codeigniter

![Folder Structure](/Sentry/Images/Sentry1.png)

Quedado el docker compose de la siguiente manera
```yml
version: '3.7'
services:
  webapp:
    container_name: sentry_php
    build: .
    volumes:
      - ./www:/var/www/html
    ports:
      - '80:80'
```

Dando clic derecho sobre el docker-compose.yaml se puede levantar los contenedores, esto desde VSC y teniendo instalada la extención de docker
![Folder Structure](/Sentry/Images/Sentry2.png)

### Configuración de Sentry para PHP

1-. Lo primero que se tiene que realizar es una cuenta de Sentry para poder acceder al Dashboard, para esto vamos a su [página oficial](https://sentry.io/signup/). Para crear la cuenta se tiene dos opciones, ya sea iniciando sessión con google, gitHub, Azur o se puede crear de la forma tradicional con un email y un password.
![Folder Structure](/Sentry/Images/Sentry3.png)

2-. Una vez creada la cuenta de Sentry se tiene que crear un proyecto, para esto se da clic en el botón "Create Project" que se encuentra en la parte superior derecha.

![Folder Structure](/Sentry/Images/Sentry4.png)

3-. Se seleciona el lenguaje que usa el proyecto en que se va implementar Sentry, en este caso PHP. En "Set your alert frequency" se dejo configurado que cada que ocurra un error este se registre.Por ultimo y se le da un nombre al proyecto.

![Folder Structure](/Sentry/Images/Sentry6.png)

4-. Ahora no muestra una pantalla donde nos da el "DSN" del proyecto, este es el que se utiliza para poder ir registrando los errores en el proyecto, en la instancia de Sentry en el proyecto se tiene que pasar como argumento este DSN.

### Instalación de Sentry en Codeigniter

1-. Para poder empezar a capturar los errores del proyecto en sentry se tiene que instalar la librería en el proyecto, en este caso como esta hecho desde docker, se tiene que acceder al contenedor, para esto tenemos distintas formas de hacerlo:

- **Comando:** Ejecutando el comantado `docker exec -it nombre-contenedor`

- **VSC:** Si se tiene la extensión de docker en VSC, dando clic en el icono docker en la barra lateral izquierza se abre el siguiente panel, en el cual si se da clic derecho sobre el contener y en "Ättach Shell" se abre una terminal en la cual se entra al contenedor 

![Folder Structure](/Sentry/Images/Sentry8.png)

- **Interfaz de docker:** Abriendo la app de docker, dando clic en el contenedor y en terminal.

![Folder Structure](/Sentry/Images/Sentry9.png)

2-. Una vez dentro del contenedor se tiene que ejecutar el siguiente comando para instalar la librería:  `composer require sentry/sdk`. Esto también se puedo agregar en el dockerfile haciendo uso del volumen. Si se entra al proyecto de Codeigniter ya se ha creado la carpeta vendor, con esto ya se puede empezar a trabajar.
**NOTA:** El comando se tiene que ejecutar en la razíz del proyecto.

3-. Ahora se tiene que crear un archivo de configuarión en la carpeta "application/config", la cual contendra la configuración de Sentry, para esto se crear un archivo llamado "sentry.php".

```php
<?php defined('BASEPATH') OR exit('No direct script access allowed');

$config['sentry_dsn'] = 'https://your-dsn-key-from-sentry.io';
$config['sentry_environment'] = 'production'; // cambia a 'development' en desarrollo
$config['sentry_error_types'] = E_ALL & ~E_DEPRECATED & ~E_NOTICE; // registra todos los errores, excepto los deprecados y los avisos
$config['sentry_send_default_pii'] = true; // envía información personal identificable (PII, por sus siglas en inglés) por defecto
```

4-. Ahora se crear una librería llamada "Sentry.php" en la carpeta "application/libraries" con el siguiente contenido.
En esta se inicializa Sentry y se crean dos funciones, una para mandar MSG personalizado a Sentry y otra para usarla con las excepciones, en los 'error_types' se configuran los errores que se quieren registrar, en este caso todos.


```php
<?php
require_once 'vendor/autoload.php'; // carga la biblioteca de Sentry

class Sentry {

    private $ci;
    private $sentry;

    public function __construct() {
        $this->ci =& get_instance();
        $this->ci->load->config('sentry');
        \Sentry\init(array(
            'dsn' => $this->ci->config->item('sentry_dsn'),
            'environment' => $this->ci->config->item('sentry_environment'),
            'error_types' => $this->ci->config->item('sentry_error_types'),
            'send_default_pii' => $this->ci->config->item('sentry_send_default_pii'),
        ));
        $this->sentry = \Sentry\SentrySdk::getCurrentHub()->getClient();
    }

    public function captureException($exception) {
        $this->sentry->captureException($exception);
    }

    public function captureMessage($message) {
        $this->sentry->captureMessage($message);
    }

}
```