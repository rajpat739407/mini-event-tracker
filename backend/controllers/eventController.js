const Event = require('../models/Event');

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, dateTime, location } = req.body;

    // Validation
    if (!title || !dateTime || !location) {
      const error = new Error('Title, date/time, and location are required');
      error.statusCode = 400;
      throw error;
    }

    if (new Date(dateTime) < new Date()) {
      const error = new Error('Event date/time must be in the future');
      error.statusCode = 400;
      throw error;
    }

    const event = new Event({
      title,
      description,
      dateTime,
      location,
      creator: req.user._id
    });

    await event.save();
    await event.populate('creator', 'email');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserEvents = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const currentDate = new Date();
    
    let query = { creator: req.user._id };
    
    if (filter === 'upcoming') {
      query.dateTime = { $gte: currentDate };
    } else if (filter === 'past') {
      query.dateTime = { $lt: currentDate };
    }
    
    const events = await Event.find(query)
      .sort({ dateTime: 1 })
      .populate('creator', 'email');
    
    res.json({ events });
  } catch (error) {
    next(error);
  }
};

exports.getEventByShareToken = async (req, res, next) => {
  try {
    const { shareToken } = req.params;
    
    const event = await Event.findOne({ shareToken }).populate('creator', 'email');
    
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.json({ event });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { title, description, dateTime, location } = req.body;
    
    const event = await Event.findOne({ _id: eventId, creator: req.user._id });
    
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (dateTime) event.dateTime = dateTime;
    if (location) event.location = location;
    
    await event.save();
    await event.populate('creator', 'email');
    
    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findOne({ _id: eventId, creator: req.user._id });
    
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }
    
    await Event.findByIdAndDelete(eventId);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};