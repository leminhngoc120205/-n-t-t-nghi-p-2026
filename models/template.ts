import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  title: string;
  description: string;
  category: 'news' | 'magazine' | 'longform' | 'interactive';
  thumbnail: string;
  layout: string;
  fields: Array<{
    id: string;
    name: string;
    type: 'text' | 'textarea' | 'image' | 'video' | 'richtext';
    placeholder?: string;
    required?: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a template title'],
      unique: true,
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a template description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    category: {
      type: String,
      enum: ['news', 'magazine', 'longform', 'interactive'],
      default: 'news',
    },
    thumbnail: {
      type: String,
      required: true,
    },
    layout: {
      type: String,
      required: true,
    },
    fields: [
      {
        id: String,
        name: String,
        type: {
          type: String,
          enum: ['text', 'textarea', 'image', 'video', 'richtext'],
        },
        placeholder: String,
        required: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);
