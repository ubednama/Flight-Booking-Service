const axios = require('axios')
const { StatusCodes } = require('http-status-codes');

const BookingRepository = require("../repositories/booking.repository")
const db = require('../models');
const { ServerConfig, QueueConfig } = require('../config');
const AppError = require('../utils/errors/app.error');
const {Enums} = require('../utils/common');
const { CONFIRMED, CANCELLED } = Enums.STATUS;

const bookingRepository = new BookingRepository();

async function createBooking(data) {

    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
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
        // console.log("from booking.service createBooking", booking)
        return booking;
    } catch (error) {
        await transaction.rollback();
        // console.log("from booking.service createBooking error",error)
        throw error;        
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try{
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction)
        if (bookingDetails.status == CANCELLED) {
            throw new AppError("The Session has expired", StatusCodes.BAD_REQUEST);
        }
        console.log(bookingDetails)

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();

        if(currentTime - bookingTime > 300000) {
            await cancelBooking(data.bookingId);
            throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST)
        }

        if(bookingDetails.totalCost != data.totalCost) {
            throw new AppError("The amount of payment doesnt match", StatusCodes.BAD_REQUEST)
        }

        if(bookingDetails.userId != data.userId) {
            throw new AppError("The user corresponding to the booking doesnt match", StatusCodes.BAD_REQUEST)
        }

        await bookingRepository.update(data.bookingId, {status: CONFIRMED}, transaction);
        await transaction.commit()

        QueueConfig.sendData({
            recepientEmail: 'cejeye7278@losvtn.com',
            subject: "Booking was Successful",
            text: `Booking was successful for Flight ${data.bookingId}`
        })

    } catch(error) {
        console.log("error in booking.service makePayment",error)
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        console.log(bookingDetails);
        if(bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.passengers,
            dec: 0
        })
        await bookingRepository.update(bookingId, {status: CANCELLED}, transaction);
        await transaction.commit()

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBooking() {
    try {
        console.log("Inside cancelOldBooking service")
        const time = new Date(Date.now() - 1000 * 300);
        const response = await bookingRepository.cancelOldBooking(time);

        return response;
    } catch (error) {
        console.log(error)        
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking
}