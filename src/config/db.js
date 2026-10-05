require ("dotenv").config();

const {Prismapg, Prismapg, PrismaPg } = require("@prisma/adapter-pg")
const { PrismaClient } = require("@prisma/client");

const adaptador = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({adaptador})

module.exports = prisma;