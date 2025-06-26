import knex from 'knex'

const db = knex({
    client: 'pg',
    connection: {
        host: 'postgres',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'test_db',
    },
});


export { db }