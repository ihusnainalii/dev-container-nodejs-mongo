const UserModel = require('../model/user')
const { emailRegex } = require('../utils/validators');

// Create and Save a new user
exports.create = async (req, res) => {
    try {

        // Validate request body
        const { email, firstName, lastName, phone } = req.body;

        // Validate email body
        if (!email) {
            return res.status(400).send({ message: "Email is required." });
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email format." });
        }

        // Validate first name, last name and phone
        if (!firstName || !lastName || !phone) {
            return res.status(400).send({ message: "First name, last name, and phone are required." });
        }

        // Check if user with the same email already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).send({ message: `Email ${email} already exists.` });
        }

        // Create a new user
        const user = new UserModel({
            email,
            firstName,
            lastName,
            phone
        });

        // Save user to the database
        const savedUser = await user.save();

        // Return success response
        return res.status(201).send({
            message: "User created successfully!",
            user: savedUser
        });
    } catch (error) {
        // Catch and return error
        console.log(error)
        if (error.name === "ValidationError") {
            return res.status(400).send({ message: "Invalid data format." });
        }

        // General error handling
        return res.status(500).send({
            message: error.message || "Some error occurred while creating the user."
        });
    }
};

// Retrieve all users from the database.
exports.findAll = async (req, res) => {
    try {
        // Get the 'page' and 'limit' query parameters, and set defaults
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 

        // Calculate how many users to skip for the current page
        const skip = (page - 1) * limit;

        // Find the total number of users for metadata
        const totalUsers = await UserModel.countDocuments();

        // Retrieve users with pagination
        const users = await UserModel.find()
            .skip(skip)
            .limit(limit)

        // Return paginated list of users and metadata
        return res.status(200).send({
            message: "List of users!",
            users: users,
            totalUsers: totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            limit: limit
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
    await UserModel.findById(req.params.id).then(user => {
        if (!user) {
            // Check if the user exists
            return res.status(404).json({ 
                message: `User with ID ${req.params.id} not found.` 
            });
        } else {
            return res.status(200).send({
                message: `Successfully retieved user with id ${req.params.id}!`,
                user: user
            });
        }
    }).catch(err => {
        res.status(404).send({
            message: err.message
        });
    });
};

// Update a user by the id in the request
exports.update = async (req, res) => {
    
    if (!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const { email } = req.body;
    const id = req.params.id;

    // Check if user with the same email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(409).send({ message: `User update failed: Email ${email} already exists.` });
    }

    await UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `User with id ${id} not found.`
            });
        } else {
            return res.status(200).send({
                message: "User updated successfully.",
                user: data
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// Delete a user with the specified id in the request
exports.destroy = async (req, res) => {

    const id = req.params.id;
    console.log(id)

    await UserModel.findByIdAndDelete(id).then(data => {
        if (!data) {
            res.status(404).send({
                message: `User with id ${id} not found.`
            });
        } else {
            res.send({
                message: "User deleted successfully!"
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};