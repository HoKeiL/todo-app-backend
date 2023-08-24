DROP TABLE IF EXISTS todoapp RESTRICT;

CREATE TABLE todoapp (
id SERIAL PRIMARY KEY,
  task VARCHAR(100) ,
  duedate date,
  completed boolean
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'badminton', '2023-08-23', 'False'
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'HIIT', '2023-08-23', 'False'
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'drink 2L water', '2023-08-23', 'False'
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'walk 10k steps', '2023-08-23', 'False'
);

SELECT * FROM todoapp;