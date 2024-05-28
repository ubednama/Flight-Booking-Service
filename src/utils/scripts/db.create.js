async function createDatabaseIfNotExists(sequelize) {
    try {
        // Check if the database exists
        const databaseName = sequelize.config.database;
        const [databaseExists] = await sequelize.query(`SHOW DATABASES LIKE '${databaseName}'`);

        // If the database doesn't exist, create it
        if (databaseExists.length === 0) {
            await sequelize.query(`CREATE DATABASE ${databaseName}`);
            console.log(`Database '${databaseName}' created successfully.`);
        } else {
            console.log(`Database '${databaseName}' already exists.`);
        }
    } catch (error) {
        console.error('Error occurred while creating database:', error);
    }
}

module.exports = createDatabaseIfNotExists;
