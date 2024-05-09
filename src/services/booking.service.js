const axios = require('axios')

const BookingRepository = require("../repositories/booking.repository")
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app.error');
const { StatusCodes } = require('http-status-codes');

async function createBooking(data) {
    return new Promise((resolve, reject) => {
       const result = db.sequelize.transaction(async function bookingImplementation(transaction) {
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            if(data.passengers > flight.data.data.totalAvailableSeats) {
                reject(new AppError("No of Seats exceeds total available Seats", StatusCodes.BAD_REQUEST))
            }
            resolve(true)
       });
    })
}

module.exports = {
    createBooking
}