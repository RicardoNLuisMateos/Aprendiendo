bind-address: dirección ip del servidor actual
server-id: identificador del servidor

## Primary database - Master

#### Create replication user

Conectarse al contener de docker

```sql
docker exec -it 727b5b1808d2 /bin/bash
```

Conectarse al MySQL

```bash
mysql -h 127.0.0.1 -uroot -pKeepPasswordStrongForRoot
```

Verificar si la configuración del MySQL(maestro) 

```sql
SHOW MASTER STATUS\G;
```

En la db primaria se tiene que crear un usuario para la replicación

```sql
CREATE USER 'replication'@'%' IDENTIFIED WITH mysql_native_password BY 'ForSlaveRepPw';
```

#### Grant permissions to user

```sql
GRANT REPLICATION SLAVE ON *.* TO 'replication'@'%';
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<passw>';
```

```
959cf631-538c-415d-8164-ca00181be227
```
