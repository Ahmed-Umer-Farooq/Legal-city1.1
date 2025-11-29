const db = require('../db');

const getAllEvents = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, event_type, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db('events')
      .select('events.*', 'cases.title as case_title', 'users.name as client_name')
      .leftJoin('cases', 'events.case_id', 'cases.id')
      .leftJoin('users', 'events.client_id', 'users.id')
      .where('events.lawyer_id', lawyerId);

    if (event_type) query = query.where('events.event_type', event_type);
    if (status) query = query.where('events.status', status);

    const events = await query.orderBy('events.start_date_time', 'desc').limit(limit).offset(offset);
    const total = await db('events').where({ lawyer_id: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: events,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { title, description, event_type, start_date_time, end_date_time, location, case_id, client_id, attendees } = req.body;

    // Validate case_id exists if provided
    if (case_id) {
      const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
      if (!caseExists) {
        return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
      }
    }

    // Validate client_id exists if provided
    if (client_id) {
      const clientExists = await db('users').where({ id: client_id }).first();
      if (!clientExists) {
        return res.status(400).json({ success: false, error: 'Selected client not found' });
      }
    }

    const [eventId] = await db('events').insert({
      title,
      description,
      event_type,
      start_date_time,
      end_date_time,
      location,
      case_id,
      client_id,
      lawyer_id: lawyerId,
      attendees: JSON.stringify(attendees || [])
    });

    const newEvent = await db('events').where({ id: eventId }).first();
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    if (updateData.attendees) {
      updateData.attendees = JSON.stringify(updateData.attendees);
    }

    const updated = await db('events')
      .where({ id, lawyer_id: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const updatedEvent = await db('events').where({ id }).first();
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('events').where({ id, lawyer_id: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.json({ success: true, data: { message: 'Event deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { days = 7 } = req.query;
    
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + parseInt(days));

    const events = await db('events')
      .select('events.*', 'cases.title as case_title')
      .leftJoin('cases', 'events.case_id', 'cases.id')
      .where('events.lawyer_id', lawyerId)
      .where('events.status', 'scheduled')
      .whereBetween('events.start_date_time', [new Date(), upcomingDate])
      .orderBy('events.start_date_time');

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCalendarEvents = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { start, end } = req.query;

    let query = db('events')
      .select('events.*', 'cases.title as case_title')
      .leftJoin('cases', 'events.case_id', 'cases.id')
      .where('events.lawyer_id', lawyerId);

    if (start && end) {
      query = query.whereBetween('events.start_date_time', [start, end]);
    }

    const events = await query.orderBy('events.start_date_time');
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent, getUpcomingEvents, getCalendarEvents };