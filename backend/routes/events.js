const express = require('express');
const {
  createEvent,
  getUserEvents,
  getEventByShareToken,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createEvent);
router.get('/', getUserEvents);
router.get('/shared/:shareToken', getEventByShareToken);
router.put('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent);

module.exports = router;