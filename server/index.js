import connectToDatabase from './db/db.js';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './routes/auth.js';
import errorHandler from './midddlewares/errorMiddleware.js';
import Report from './models/Report.js';
import multer from 'multer';
import path from 'path';
import { EventEmitter } from 'events';
import passwordReset from './routes/passwordReset.js';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

connectToDatabase();
const app = express();

EventEmitter.defaultMaxListeners = 15;

app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/password', passwordReset);
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(errorHandler);

// Create report with file uploads
app.post('/api/reports', upload.array('images'), async (req, res) => {
  try {
    const reportData = req.body;

    // Process uploaded files to match the schema
    if (req.files && req.files.length > 0) {
      reportData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        originalName: file.originalname
        // publicId can be added if using cloud storage
      }));
    }

    // Convert date and time strings to Date objects
    if (reportData.date) {
      reportData.date = new Date(reportData.date);
    }
    if (reportData.time) {
      reportData.time = new Date(reportData.time);
    }

    // Create new report
    const newReport = new Report(reportData);
    await newReport.save();

    newReport.rcode = newReport._id.toString().slice(-6).toUpperCase();
    await newReport.save();

    res.status(201).json({
      success: true,
      data: newReport
    });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message
    });
  }
});

// Get a single report by ID
app.get('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid report ID format'
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Format image URLs to include full path
    const formattedReport = report.toObject();
    if (formattedReport.images && formattedReport.images.length > 0) {
      formattedReport.images = formattedReport.images.map(image => ({
        ...image,
        url: `http://report-std.scit.co:${process.env.PORT || 5000}${image.url}`
      }));
    }

    res.status(200).json({
      success: true,
      data: formattedReport
    });
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get a report by report number
app.get('/api/reports/number/:reportNumber', async (req, res) => {
  try {
    const { reportNumber } = req.params;

    if (!reportNumber) {
      return res.status(400).json({
        success: false,
        error: 'Report number is required'
      });
    }
    let report = await Report.findOne({ rcode: (reportNumber + "") });


    if (!report) {
      report = await Report.findById(reportNumber);
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Format image URLs to include full path
    const formattedReport = report.toObject();
    if (formattedReport.images && formattedReport.images.length > 0) {
      formattedReport.images = formattedReport.images.map(image => ({
        ...image,
        url: `http://report-std.scit.co:${process.env.PORT || 5000}${image.url}`
      }));
    }

    res.status(200).json({
      success: true,
      data: formattedReport
    });
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});


// Update report with after image
app.post('/api/reports/:id/after-image', upload.single('image_after_update'), async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Update the report with the new image
    report.image_after_update = {
      url: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname
      // publicId can be added if using cloud storage
    };

    await report.save();

    // Format image URL to include full path for response
    const formattedReport = report.toObject();
    if (formattedReport.image_after_update) {
      formattedReport.image_after_update.url =
        `http://report-std.scit.co:${process.env.PORT || 5000}${formattedReport.image_after_update.url}`;
    }

    res.status(200).json({
      success: true,
      data: formattedReport
    });
  } catch (err) {
    console.error('Error updating report with after image:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message
    });
  }
});

// Get all reports with pagination
app.get('/api/all-reports', async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filter parameters
    const filter = {};

    // Add filters if provided in query params
    if (req.query.status) filter.status = req.query.status;
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.reportedBy) filter.reportedBy = req.query.reportedBy;

    // Execute query with pagination
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await Report.countDocuments(filter);

    // Format image URLs to include full path
    const formattedReports = reports.map(report => {
      const reportObj = report.toObject();

      // Format main images
      if (reportObj.images && reportObj.images.length > 0) {
        reportObj.images = reportObj.images.map(image => ({
          ...image,
          url: `http://report-std.scit.co:${process.env.PORT || 5000}${image.url}`
        }));
      }

      // Format after_update image if exists
      if (reportObj.image_after_update) {
        reportObj.image_after_update.url =
          `http://report-std.scit.co:${process.env.PORT || 5000}${reportObj.image_after_update.url}`;
      }

      return reportObj;
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: formattedReports
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));