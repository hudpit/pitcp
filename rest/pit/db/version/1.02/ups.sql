create table api_key (`key` char(35) primary key, user_id int(11), secret char(10),title varchar(64));
create table assessment(assessment_id int(11) primary key, title varchar(255), url varchar(255));
create table project_assessment (project_assessment_id int(11) primary key auto_increment, project_id int(11), assessment_id int(11));
