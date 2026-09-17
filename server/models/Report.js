import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReportSchema = new Schema({
  // Driver Information (from Report1.jsx)
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  rcode: {
    type: String,
    unique: true,
    index: true,
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },

  // Accident Information (from Report2.jsx)
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required']
  },
  vehicleName: {
    type: String,
    required: [true, 'Vehicle name is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: Date,
    required: [true, 'Time is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },

  // Images (from Report3.jsx)
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String, // For cloud storage reference (like Cloudinary)
    originalName: String
  }],
  image_after_update: {
    url: {
      type: String,
      required: false
    },
    publicId: String,
    originalName: String
  },
  // Additional metadata
  status: {
    type: String,
    default: 'pending'
  },
  reportNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Generate a unique report number before saving
ReportSchema.pre('save', async function (next) {
  if (!this.reportNumber) {
    // Generate a unique report number with current year and sequential counter
    const currentYear = new Date().getFullYear();
    const count = await this.constructor.countDocuments({});
    this.reportNumber = `RPT-${currentYear}-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

// Create the model
const Report = mongoose.model('Report', ReportSchema);

// Export as default
export default Report;