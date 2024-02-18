# Expense Tracker Application

## Description

The Expense Tracker Application is a web-based tool designed to help users track their expenses efficiently. It provides features such as user authentication, expense recording, premium features management, password reset, and more.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Code Structure](#code-structure)

## Features

- User authentication and authorization (sign up, log in)
- Recording and categorization of expenses
- Tracking expenses over time
- Integration with payment gateways(Razor Pay) for premium features
- Password reset functionality(Brevo)
- Middleware for authentication and authorization(JWT)

## Prerequisites

To run this application locally, you need to have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB or any other compatible NoSQL database management system

## Installation

### Clone this repository to your local machine:
git clone https://github.com/clementrozario/Expense-Tracker_NoSql.git

### Navigate to the project directory:
cd expense-tracker

### Install dependencies:
npm install

### Set up your database:
1. Install and set up MongoDB on your machine or use a cloud-based MongoDB service.
2. Configure the database connection by creating a `.env` file in the root directory of the project.
3. In the `.env` file, add the following variables with your database connection string:

MONGODB_URI=your_mongodb_connection_string

### Start the server:
npm start

## Usage
- Once the server is running, access the application through a web browser.
- Users can sign up or log in to the application.
- After authentication, users can record their expenses, categorize them, and view their expense history.

## Code Structure
- `controllers/`: Directory containing controller files for handling user requests.
- `middleware/`: Directory containing authentication middleware.
- `models/`: Directory containing Mongoose models for database collections.
- `routes/`: Directory containing Express routes for handling API requests.
- `services/`: Directory containing services such as S3services for file uploads.
- `utils/`: Directory containing utility functions and database configuration.
- `view/`: Directory containing HTML, CSS, and JavaScript files for the frontend.
- `app.js`: Entry point of the application.



