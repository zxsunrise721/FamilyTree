
const sendResponse = (res,status,data,message="No message") =>{
    return res.status(status).json({status: status, data: data, message: message});
}

const priceToNumber = (price) => {
    // price string is include whith '$', yes remove it 
    price = price.startsWith('$')? price.slice(1): price;
    return typeof price === 'number' ? price : parseFloat(price);
}

module.exports = {
    sendResponse,
    priceToNumber,
};