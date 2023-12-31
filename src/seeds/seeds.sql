INSERT INTO "plan" ("id", "name", "ratePerMonth") VALUES ('price_1OCpuRIoREqLVWCHrmMNY0Lf', 'Free', 500);
INSERT INTO "plan" ("id", "name", "ratePerMonth") VALUES ('price_1OCpwpIoREqLVWCHxeAiU2mj', 'Pro', 1000);
INSERT INTO "plan" ("id", "name", "ratePerMonth") VALUES ('price_1OCpyHIoREqLVWCHp7PCq1vN', 'Enterprise', 10000);

INSERT INTO "user" ("id", "name", "email", "password") VALUES ('cus_P0sY70OlHhDA8s', 'John Doe', 'john.doe@mediconnect.com', '123456');
INSERT INTO "user" ("id", "name", "email", "password") VALUES ('cus_P0sYvmHEkeQD1e', 'Tom Miller', 'tom.miller@mediconnect.com', '123456');
INSERT INTO "user" ("id", "name", "email", "password") VALUES ('cus_P0sZIkprjrwuDs', 'David Smith', 'david.smith@mediconnect.com', '123456');

INSERT INTO "api_key" ("id", "ownerId", "key", "name", "createdAt", "expiresAt") VALUES (1, 'cus_P0sY70OlHhDA8s', 'Q4fjlJ5sG6rzlrKDxM2d9VAFLiyMKpWU', 'Default', '2023-10-22 00:00:00', '2031-12-31 23:59:59');
INSERT INTO "api_key" ("id", "ownerId", "key", "name", "createdAt", "expiresAt") VALUES (2, 'cus_P0sYvmHEkeQD1e', 'KgIQRjq1z99frjSVzLvQtyNQT4JlRvu9', 'Default', '2023-10-24 00:00:00', '2031-12-31 23:59:59');
INSERT INTO "api_key" ("id", "ownerId", "key", "name", "createdAt", "expiresAt") VALUES (3, 'cus_P0sZIkprjrwuDs', 'qJ5Ta22dFsFhqZl9RrmTUVBfDXU6zx1j', 'APP 1', '2023-10-25 00:00:00', '2031-12-31 23:59:59');
INSERT INTO "api_key" ("id", "ownerId", "key", "name", "createdAt", "expiresAt") VALUES (4, 'cus_P0sZIkprjrwuDs', '7FGBDeNVMgM8bY404ok3EUM6fMFlpUD9', 'APP 2', '2023-10-25 00:01:00', '2031-12-31 23:59:59');

/* update autogenerated id sequences */
SELECT setval('api_key_id_seq', (SELECT MAX(id) FROM "api_key"));