require("dotenv").config();
const { PrismaClient } = require('@prisma/client');//tools truy van
const { PrismaPg } = require('@prisma/adapter-pg');//cau noi voi pool
const { Pool } = require('pg');//ho chua chuoi kn, node-postgre

const globalForPrisma = globalThis;//tao cau noi duy nhat trong qua trinh kn
//ho chua chuoi ket noi db
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//gan pool vao prisma adapter, cong cu ket noi prisma va pg de doc va thao tac voi csdl bang db
const adapter = new PrismaPg(pool);
//ket noi truy van
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
//khi la moi truong phat trien, ket noi thang db de lm vc lun vi no 
//khong hot-reload nhu tren development nen yen tam su dung
//khi ptr chi dung 1 tranh th la reload bd lt lam sap db
if (process.env.NODE_ENV!=='production') {
    globalForPrisma.prisma = prisma;//this cmd will resave prisma, not create new
};
//resue
module.exports = prisma;


