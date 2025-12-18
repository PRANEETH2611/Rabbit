import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
    },

    sizes: {
      type: [String],
      required: true,
    },

    colors: {
      type: [String],
      required: true,
    },

    collection: {
      type: String,
      required: true,
    },

    material: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: {
          type: String,
        },
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    metaKeywords: {
      type: String,
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    weight: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
