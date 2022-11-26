# Creación de tablas / relaciones MYSQL

Las tablas son los elementos más importante dentro de una base de datos ya que se utilizan para almacenar los datos de nuestra aplicación. -- Test Linux

## Creación de tablas
Para crear una tabla en Mysql se tiene que tomar en cuenta los siguientes puntos:

- **Nombre de la tabla:** este tiene que hacer referencia a la información que se va a guardar en esta. Por ejemplo si se va a guardar informacion de una persona que trabaja en una empresa, el nombre de la tabla podría ser __employees__.

- **Nombre de los campos:** Al igual que el nombre de la tabla, el nombre tiene que hacer referencia a lo que se va a guardar, un ejemplo si se va a guardar el nombre de una empleado, el nombre del campo podría ser __name__ , los nombres de preferencia tienen que ser en ingles. ]

- **Tipo de datos:** A cada campo se le tiene que especificar el tipo de dato y a su vez especificar la longitud.  [Tipos de datos](https://www.w3schools.com/mysql/mysql_datatypes.asp#:~:text=In%20MySQL%20there%20are%20three,numeric%2C%20and%20date%20and%20time.)

- **Primary key:** Una clave primaria es un campo cuyos valores identifican de forma única cada registro dentro de la tabla. Este campo tiene la cláusula `PRIMARY KEY`.

- **Foreign key:** La clave foránea, por su parte, es un campo dentro de la tabla cuyos valores hacen referencia a «claves primarias» en otra tabla. Este campo viene acompañado de la cláusula `FOREIGN KEY`. 

Ejemplo de código para crear una tabla, en donde la clave primaria es el id, este es auto incremental(AUTO_INCREMENT).

```
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED,
    dni VARCHAR(20) UNIQUE,
    name VARCHAR(150),
    email VARCHAR(100),
    birth_date DATE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL  
);
```

## Relaciones en MYSQL

Las bases de datos relacionales tienen diversos tipos de relaciones que podemos utilizar para vincular nuestras tablas. Este vínculo va a depender de la cantidad de ocurrencias que tiene un registro de una tabla dentro de otra tabla (esto se conoce como cardinalidad).

#### Relaciones uno a uno (1:1)
Se presentan cuando *un registro* de una tabla sólo está relacionado con *un registro* de otra tabla, y viceversa. Ejemplo:

Se quiere guardar la información de contacto de un empleado, entonces la relación quedaría de la siguiente manera:

Un *empleado* tiene una sola *información de contacto* y *Una información de contacto pertenece a un solo empleado*.

#### Relaciones uno a muchos (1:N)

Una relación de uno a muchos se presentan cuando *un registro* de la **tabla A** está relacionado con *ninguno o muchos registros* de la **tabla B**, pero este registro en la **tabla B**  solo está relacionado con *un registro* de la **tabla A**. Ejemplo:

Supongamos que tenemos sucursales en las cuales trabajan nuestros empleados, pero cada empleado solo puede pertenecer a una sucursal. Para este caso, pudiésemos leer la relación de esta manera:

*Una sucursal tiene muchos (o ningún) empleados* y *Un empleado trabaja en una sola sucursal*


#### Relaciones muchos a muchos (N:M)

Se presentan cuando *muchos registros* de una tabla se relacionan con *muchos registros* de otra tabla. Ejemplo

Supongamos que nuestros empleados trabajan en muchos turnos (horarios laborales). Por ejemplo, Juan trabaja en el turno de la mañana y de la noche, pero en el turno de la mañana trabajan Juan, Pedro y María.

En este caso, pudiésemos leer la relación de esta manera:

*Un empleado trabaja en muchos turnos* y *Un turno tiene muchos empleados*

Para este tipo de relación se crea una tabla intermedia conocida como tabla asociativa. Por convención, el nombre de esta tabla debe estar formado por el nombre de las tablas participantes (en singular y en orden alfabético) separados por un guion bajo (_). Además, debe contener una clave foránea por cada una de sus tablas participantes.

#### Código para crear relaciones entre tablas

Para poder crear relaciones entre tablas se tiene que especificar la clave foranea y hacer referencia a la tabla con la que se va a relacionar seguido la de clave primaría

Ejemplo: 

```
 CREATE TABLE employee_shift (
    id BIGINT UNSIGNED AUTO_INCREMENT,
    employee_id BIGINT UNSIGNED NOT NULL,
    shift_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (employee_id) REFERENCES employees (id),
    FOREIGN KEY (shift_id) REFERENCES shifts (id)
);
```

En caso de que ya este creadas la tablas y se necesite agregar una relación se puede realizar de la siguiente manera

```
ALTER TABLE employees ADD FOREIGN KEY (branch_id) REFERENCES branches (id);
```
