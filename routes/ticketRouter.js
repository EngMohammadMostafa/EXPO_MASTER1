const express = require('express');
const ticketRouter = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyVisitor } = require('../middleware/authMiddleware');
const { buyTicket, checkTicket, getSectionsByDepartment, getProductsBySection } = require('../controllers/visitorController');

// فقط الزائر يمكنه شراء تذكرة ودخول القسم
ticketRouter.use(verifyToken, verifyVisitor);

ticketRouter.post('/buy-ticket', buyTicket);
ticketRouter.get('/check-ticket/:departmentId', checkTicket);
ticketRouter.get('/sections/:departmentId', getSectionsByDepartment);
ticketRouter.get('/products/:sectionId', getProductsBySection);

module.exports = ticketRouter;