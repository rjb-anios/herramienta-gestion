import { CONCEPT_VALUES } from '@core/entities/Visit'
import { relations } from 'drizzle-orm'
import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'

export const clientsTable = sqliteTable(
	'clients',
	{
		contact: text().notNull(),
		email: text().notNull(),
		id: text().notNull().primaryKey(),
		name: text().notNull(),
		phone: text().notNull()
	},
	table => [index('clients_index_0').on(table.name)]
)

export const machinesTable = sqliteTable(
	'machines',
	{
		id: text().notNull().primaryKey(),
		id_client: text().references(() => clientsTable.id),
		manufacturer: text().notNull(),
		model: text().notNull(),
		serial_number: text().notNull().unique()
	},
	table => [index('machines_index_0').on(table.model, table.serial_number)]
)

export const techniciansTable = sqliteTable('technicians', {
	active: integer().notNull().default(1),
	email: text().notNull(),
	id: text().notNull().primaryKey(),
	initials: text().notNull().unique(),
	name: text().notNull(),
	phone: text().notNull()
})

export const visitsTable = sqliteTable(
	'visits',
	{
		concept: text({
			enum: CONCEPT_VALUES
		}).notNull(),
		date: text().notNull(),
		description: text().notNull(),
		future: text().notNull(),
		hours: integer().notNull(),
		id: text().notNull().primaryKey(),
		id_client: text()
			.notNull()
			.references(() => clientsTable.id),
		id_technician: text()
			.notNull()
			.references(() => techniciansTable.id)
	},
	table => [
		index('visits_index_0').on(table.id_client, table.date),
		index('visits_index_1').on(table.date, table.id_client)
	]
)

export const visitsToTechniciansTable = sqliteTable(
	'visits_to_technicians',
	{
		id_technician: text()
			.notNull()
			.references(() => techniciansTable.id),
		id_visit: text()
			.notNull()
			.references(() => visitsTable.id, { onDelete: 'cascade' })
	},
	table => [
		primaryKey({ columns: [table.id_visit, table.id_technician] }),
		index('find_technician_index_0').on(table.id_technician)
	]
)

export const visitsToMachinesTable = sqliteTable(
	'visits_to_machines',
	{
		id_machine: text()
			.notNull()
			.references(() => machinesTable.id),
		id_visit: text()
			.notNull()
			.references(() => visitsTable.id, { onDelete: 'cascade' })
	},
	table => [
		primaryKey({ columns: [table.id_visit, table.id_machine] }),
		index('find_machine_index_0').on(table.id_machine)
	]
)

export const usersTable = sqliteTable('users', {
	id: text().notNull().primaryKey(),
	name: text().notNull(),
	password: text().notNull(),
	role: text({ enum: ['A', 't', 'u'] }).notNull(),
	username: text().notNull().unique()
})

export const refreshTokensTable = sqliteTable(
	'refresh_tokens',
	{
		created: text().notNull(),
		expiry: text().notNull(),
		id_token: text().notNull().primaryKey(),
		id_user: text()
			.notNull()
			.references(() => usersTable.id),
		token: text().notNull()
	},
	table => [index('refresh_tokens_index_0').on(table.id_user)]
)

export const visitsRelations = relations(visitsTable, ({ one, many }) => ({
	client: one(clientsTable, {
		fields: [visitsTable.id_client],
		references: [clientsTable.id]
	}),
	machines: many(visitsToMachinesTable),
	technicians: many(visitsToTechniciansTable)
}))

export const visitsToTechniciansRelations = relations(
	visitsToTechniciansTable,
	({ one }) => ({
		technician: one(techniciansTable, {
			fields: [visitsToTechniciansTable.id_technician],
			references: [techniciansTable.id]
		}),
		visit: one(visitsTable, {
			fields: [visitsToTechniciansTable.id_visit],
			references: [visitsTable.id]
		})
	})
)

export const visitsToMachinesRelations = relations(
	visitsToMachinesTable,
	({ one }) => ({
		machine: one(machinesTable, {
			fields: [visitsToMachinesTable.id_machine],
			references: [machinesTable.id]
		}),
		visit: one(visitsTable, {
			fields: [visitsToMachinesTable.id_visit],
			references: [visitsTable.id]
		})
	})
)

export const clientsRelations = relations(clientsTable, ({ many }) => ({
	visits: many(visitsTable)
}))
