const axios = require('axios')

const BookingRepository = require("../repositories/booking.repository")
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app.error');
const { StatusCodes } = require('http-status-codes');

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    // return new Promise((resolve, reject) => {
    //    const result = db.sequelize.transaction(async function bookingImplementation(transaction) {
    //         const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
    //         if(data.passengers > flight.data.data.totalAvailableSeats) {
    //             reject(new AppError("No of Seats exceeds total available Seats", StatusCodes.BAD_REQUEST))
    //         }
    //         resolve(true)
    //    });
    // })

    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.getAdapter(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        const flightData = flight.data.data
        
        if(data.passengers > flightData.totalAvailableSeats) {
            throw new AppError("No of Seats exceeds total available Seats", StatusCodes.BAD_REQUEST)
        }

        const totalBillingAmount = data.passengers * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount}
        const booking = await bookingRepository.create(bookingPayload, transaction)

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.passengers
        })

        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;        
    }
}

module.exports = {
    createBooking
}