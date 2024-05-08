function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero if single digit
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero if single digit
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Add leading zero if single digit
    return ` ${hours}:${minutes}:${seconds}`;
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero if single digit
    const day = String(now.getDate()).padStart(2, '0'); // Add leading zero if single digit
    return `${year}-${month}-${day}`;
}

module.exports = {
    getCurrentTime,
    getCurrentDate
}