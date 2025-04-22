CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    g INTEGER NOT NULL
);

INSERT INTO grades (g)
SELECT floor(random() * 101)::int
FROM generate_series(1, 1000000);
