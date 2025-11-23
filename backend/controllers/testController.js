// controllers/testController.js

// This function just sends a JSON response back
const getTestMessage = (req, res) => {
    res.status(200).json({
        message: "Test Controller is working!",
        status: "Success"
    });
};

// We export it so other files can use it
module.exports = { getTestMessage };