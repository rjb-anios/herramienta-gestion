PRAGMA defer_foreign_keys=TRUE;

CREATE TABLE IF NOT EXISTS "clients" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "contact" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "machines" (
  "id" TEXT NOT NULL,
  "manufacturer" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "serial_number" TEXT NOT NULL UNIQUE,
  "id_client" TEXT,
  PRIMARY KEY("id"),
  FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "technicians" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
	"initials" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "active" INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "visits" (
  "id" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "id_client" TEXT NOT NULL,
  "id_technician" TEXT NOT NULL,
  "concept" TEXT NOT NULL,
  "hours" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "future" TEXT NOT NULL,
  "sector" TEXT NOT NULL,
  PRIMARY KEY("id"),
  FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY ("id_technician") REFERENCES "technicians"("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "visits_to_technicians" (
  "id_visit" TEXT NOT NULL,
  "id_technician" TEXT NOT NULL,
  PRIMARY KEY ("id_visit", "id_technician"),
  FOREIGN KEY ("id_visit") REFERENCES "visits"("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY ("id_technician") REFERENCES "technicians"("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "visits_to_machines" (
  "id_visit" TEXT NOT NULL,
  "id_machine" TEXT NOT NULL,
  PRIMARY KEY ("id_visit", "id_machine"),
  FOREIGN KEY ("id_visit") REFERENCES "visits"("id") ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY ("id_machine") REFERENCES "machines"("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id_token" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "id_user" TEXT NOT NULL,
  "created" TEXT NOT NULL,
  "expiry" TEXT NOT NULL,
  PRIMARY KEY("id_token"),
  FOREIGN KEY ("id_user") REFERENCES "users"("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX IF NOT EXISTS "clients_index_0" ON "clients" ("name");
CREATE INDEX IF NOT EXISTS "machines_index_0" ON "machines" ("model", "serial_number");
CREATE INDEX IF NOT EXISTS "visits_index_0" ON "visits" ("id_client", "date");
CREATE INDEX IF NOT EXISTS "visits_index_1" ON "visits" ("date", "id_client");
CREATE INDEX IF NOT EXISTS "find_machine_index_0" ON "visits_to_machines" ("id_machine");
CREATE INDEX IF NOT EXISTS "find_technician_index_0" ON "visits_to_technicians" ("id_technician");
CREATE INDEX IF NOT EXISTS "refresh_tokens_index_0" ON "refresh_tokens" ("id_user");
