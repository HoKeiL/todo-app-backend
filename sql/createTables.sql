DROP TABLE IF EXISTS todoapp RESTRICT;

CREATE TABLE todoapp (
id SERIAL PRIMARY KEY,
  task VARCHAR(100) ,
  duedate text,
  completed boolean
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'badminton', '22/08/2023', 'False'
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'HIIT', '23-08-2023', 'False'
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'drink 2L wate', '23-08-2023', 'False'
);

INSERT INTO todoapp(task, duedate, completed) VALUES (
'walk 10k steps', '23-08-2023', 'False'
);

SELECT * FROM todoapp;