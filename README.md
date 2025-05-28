# Wishlist 3000 / Giftlist

A SvelteKit application for creating and sharing wishlists with friends and family.

## Features

- Create and manage wishlists
- Add items with names, links, and prices
- Share wishlists with friends and family
- Gift givers can mark items as "taken" without the recipient knowing
- Multiple people can collaborate on a gift with the "Gift With Me" feature

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- SvelteKit
- TypeScript
- Prisma
- Tailwind CSS

## Deployment

For detailed instructions on how to deploy this application to an Ubuntu web server using Docker Compose, please refer to the [Deployment Guide](DEPLOYMENT.md).

The deployment guide includes:
- Setting up Docker and Docker Compose
- Configuring the MySQL database and shadow database for Prisma
- Automating the build and deployment process
- Maintenance and troubleshooting tips

A deployment script (`deploy.sh`) is also provided for easy setup.
