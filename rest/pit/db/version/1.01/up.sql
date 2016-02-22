alter table user add column phone varchar(11) after email;
alter table project add column isPublic bool after datastore_id;