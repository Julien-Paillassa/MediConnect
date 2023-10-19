INSERT INTO "subscription" ("id", "name", "price", "ratePerMonth", "overageFeePerRequest") VALUES (1, 'Basic', 0, 500, 0.01);
INSERT INTO "subscription" ("id", "name", "price", "ratePerMonth", "overageFeePerRequest") VALUES (2, 'Pro', 10.90, 1000, 0.01);
INSERT INTO "subscription" ("id", "name", "price", "ratePerMonth", "overageFeePerRequest") VALUES (3, 'Enterprise', 49.90, 10000, 0.005);

INSERT INTO "user" ("id", "name", "email", "password", "subscriptionId") VALUES (1, 'John Doe', 'john.doe@mediconnect.com', '123456', 1);
INSERT INTO "user" ("id", "name", "email", "password", "subscriptionId") VALUES (2, 'Tom Miller', 'tom.miller@mediconnect.com', '123456', 2);
INSERT INTO "user" ("id", "name", "email", "password", "subscriptionId") VALUES (3, 'David Smith', 'david.smith@mediconnect.com', '123456', 3);

INSERT INTO "api_key" ("id", "ownerId", "key", "name") VALUES (1, 1, 'Q4fjlJ5sG6rzlrKDxM2d9VAFLiyMKpWU', 'Default');
INSERT INTO "api_key" ("id", "ownerId", "key", "name") VALUES (2, 2, 'KgIQRjq1z99frjSVzLvQtyNQT4JlRvu9', 'Default');
INSERT INTO "api_key" ("id", "ownerId", "key", "name") VALUES (3, 3, 'qJ5Ta22dFsFhqZl9RrmTUVBfDXU6zx1j', 'APP 1');
INSERT INTO "api_key" ("id", "ownerId", "key", "name") VALUES (4, 3, '7FGBDeNVMgM8bY404ok3EUM6fMFlpUD9', 'APP 2');