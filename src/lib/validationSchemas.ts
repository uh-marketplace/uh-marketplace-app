import * as Yup from 'yup';

export const AddItemSchema = Yup.object({
  name: Yup.string().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  price: Yup.number().positive().required(),
  location: Yup.string().required(),
  owner: Yup.string().required(),
  imageUrl: Yup.string().url().required(),
  description: Yup.string().required(),
});

export const EditItemSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  price: Yup.number().positive().required(),
  location: Yup.string().required(),
  owner: Yup.string().required(),
  imageUrl: Yup.string().url().required(),
  description: Yup.string().required(),
});
