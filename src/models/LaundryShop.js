import mongoose from 'mongoose';

const laundryShopSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: String,
  location: {
    address: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: false }
    }
  },
  menu: [
    {
      name: String,
      description: String,
      clothType: String,
      price: Number,
      category: { type: String, enum: ['Washing', 'Ironing', 'Dry Cleaning'] }
    }
  ],
  ratings: [Number],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      title: { type: String, required: true, maxlength: 100 },
      comment: { type: String, required: true, maxlength: 500 },
      serviceType: { type: String, enum: ['Washing', 'Ironing', 'Dry Cleaning', 'Multiple Services'] },
      images: [String],
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      isVerified: { type: Boolean, default: false },
      isOwnerResponded: { type: Boolean, default: false },
      ownerResponse: {
        comment: String,
        respondedAt: Date
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      isDeleted: { type: Boolean, default: false }
    }
  ],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Index for geospatial queries
laundryShopSchema.index({ 'location.coordinates': '2dsphere' });

// Index for review searches
laundryShopSchema.index({ 'reviews.rating': 1 });
laundryShopSchema.index({ 'reviews.userId': 1 });
laundryShopSchema.index({ 'reviews.createdAt': -1 });

export default mongoose.models.LaundryShop || mongoose.model('LaundryShop', laundryShopSchema);