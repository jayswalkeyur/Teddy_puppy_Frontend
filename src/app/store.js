import { configureStore } from '@reduxjs/toolkit';
import puppiesReducer from '../features/puppies/puppiesSlice';
import enquiriesReducer from '../features/enquiries/enquiriesSlice';
import contactReducer from '../features/contact/contactSlice';

export const store = configureStore({
  reducer: { puppies: puppiesReducer, enquiries: enquiriesReducer, contact: contactReducer },
  devTools: import.meta.env.DEV,
});
