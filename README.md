<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Wikusama Cafe

Wikusama Cafe is a web application built with Laravel and React. This project aims to manage cafe operations, including transactions, user roles, and more.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- PHP >= 8.0
- Composer
- Node.js
- npm or yarn

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/RadjaShiqnals/Wikusama-Cafe.git
    cd Wikusama-Cafe
    ```

2. Install PHP dependencies:

    ```sh
    composer install
    ```

3. Install JavaScript dependencies:

    ```sh
    npm install
    # or
    yarn install
    ```

4. Copy the `.env.example` file to `.env` and configure your environment variables:

    ```sh
    cp .env.example .env
    ```

5. Generate an application key:

    ```sh
    php artisan key:generate
    ```

6. Set up the database:

    - Option 1: Run migrations

        ```sh
        php artisan migrate
        ```

    - Option 2: Import the SQL dump file manually

        Import the `database/wikusama_cafe.sql` file into your database using a tool like phpMyAdmin or the MySQL command line.

7. Start the development server:

    ```sh
    php artisan serve
    ```

8. Compile the front-end assets:

    ```sh
    npm run dev
    # or
    yarn dev
    ```

### API Documentation

The API documentation is available on Postman: [Wikusama Cafe API Documentation](https://documenter.getpostman.com/view/28791552/2sAXqwXyro)

## Contributing

Thank you for considering contributing to the Wikusama Cafe project! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Wikusama Cafe community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Wikusama Cafe, please send an e-mail to Radja Shiqnals via [radja@example.com](mailto:radja@example.com). All security vulnerabilities will be promptly addressed.

## License

The Wikusama Cafe project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).