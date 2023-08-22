DROP TABLE IF EXISTS todoapp RESTRICT;

CREATE TABLE todoapp (
id SERIAL PRIMARY KEY,
  task VARCHAR(100) ,
  duedate text,
  status text
);

INSERT INTO todoapp(task, duedate, status) VALUES (
'badminton', '22/08/2023', 'InProgress'
)

SELECT * FROM todoapp;