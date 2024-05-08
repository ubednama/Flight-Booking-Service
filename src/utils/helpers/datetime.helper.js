function timeToMilliseconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
}

function compareTime(timeAhead, timeBehind, upperLimit, lowerLimit) {
    let dateTimeAhead = new Date(timeAhead);
    let dateTimeBehind = new Date(timeBehind);
    
    if(dateTimeAhead.getTime() <= dateTimeBehind.getTime()) {
        return false;
    } else if (upperLimit !== undefined || lowerLimit !== undefined) {
        const diff = dateTimeAhead.getTime() - dateTimeBehind.getTime();

        if (upperLimit !== undefined && lowerLimit !== undefined) {
            return diff < timeToMilliseconds(upperLimit) && diff > timeToMilliseconds(lowerLimit);
        }

        if (upperLimit !== undefined) {
            return diff < timeToMilliseconds(upperLimit);
        }

        if (lowerLimit !== undefined) {
            return diff > timeToMilliseconds(lowerLimit);
        }
    }

    return dateTimeAhead.getTime() > dateTimeBehind.getTime()
}


module.exports = {
    compareTime
}







    // if(upperLimit && lowerLimit) {
    //     return dateTimeAhead.getTime() > dateTimeBehind.getTime() && dateTimeAhead.getTime() - dateTimeBehind.getTime() <= upperLimit && dateTimeAhead.getTime() && dateTimeBehind.getTime() >= lowerLimit
    // }

    // if(lowerLimit) {
    //     return dateTimeAhead.getTime() > dateTimeBehind.getTime() && dateTimeAhead.getTime() - dateTimeBehind.getTime() >= lowerLimit
    // }

    // if(upperLimit) {
    //     return dateTimeAhead.getTime() > 
    // }