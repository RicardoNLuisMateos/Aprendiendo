for N in 1 2 3
do docker run -d -p 330$N:3306 --name=node$N --net=groupnet --hostname=node$N \
  -v $PWD/d$N:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=mypass \
  mysql/mysql-server:8.0 \
  --server_id=$N \
  --log_bin='mysql-bin-1.log' \
  --enforce_gtid_consistency='ON' \
  --log_slave_updates='ON' \
  --gtid_mode='ON' \
  --transaction_write_set_extraction='XXHASH64' \
  --binlog_checksum='NONE' \
  --master_info_repository='TABLE' \
  --relay_log_info_repository='TABLE' \
  --plugin_load='group_replication.so' \
  --relay_log_recovery='ON' \
  --group_replication_start_on_boot='OFF' \
  --group_replication-group_name='aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' \
  --group_replication_local_address="node$N:33061" \
  --group_replication_group_seeds='node1:33061,node2:33061,node3:33061' \
  --loose_group_replication_single_primary-mode='OFF' \
  --loose_group_replication_enforce_update_everywhere_checks='ON'
done