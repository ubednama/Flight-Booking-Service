const { StatusCodes } = require("http-status-codes");
const { Logger } = require("../config");
const AppError = require("../utils/errors/app.error");

class CrudRepository {
    constructor(model) {
        this.model = model
    }

    async create(data) {
        // console.log(data)
        // console.log("crud repo", this.model)
        try {
            const response = await this.model.create(data);
            // console.log(response)
            return response;
        } catch(error) {
            console.log(error)
            Logger.error("Something went wrong in CRUD Repo: create");
            throw error;
        }
    }

    async destroy(data) {
        const response = await this.model.destroy({
            where: {
                id:data
            }
        })
        if(!response) { 
            console.log("here ",response)
            throw new AppError('No record deleted as Data doesnt exists', StatusCodes.NOT_FOUND) }
        return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data)
        if(!response) {
            throw new AppError("Data doesnt exists", StatusCodes.NOT_FOUND)
        }
        return response;
    }

    async getAll(data) {
        try {
            const response = await this.model.findAll()
            return response;
        } catch (error) {
            Logger.error("Something went wrong in CRUD Repo: getAll")
        }
    }

// update can be optimized more
    async update(id, data) {        //data => {col: value, ....}
        const response = await this.model.update(data ,{
            where: {
                id: id
            }})
            if(response[0] === 0) { 
                throw new AppError('No record updated as Data doesnt exists', StatusCodes.NOT_FOUND) }
        return response
    }
}

module.exports = CrudRepository;