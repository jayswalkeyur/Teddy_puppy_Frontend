import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createPuppyEnquiry } from './enquiriesService';

export const submitPuppyEnquiry = createAsyncThunk(
  'enquiries/submit',
  async (payload, { rejectWithValue }) => {
    try { return await createPuppyEnquiry(payload); }
    catch (error) { return rejectWithValue(error.userMessage || 'We could not send your enquiry. Please try again.'); }
  }
);

const slice = createSlice({
  name: 'enquiries',
  initialState: { submitting: false, error: null, lastSubmittedAt: null },
  reducers: { clearEnquiryError(state) { state.error = null; } },
  extraReducers(builder) {
    builder.addCase(submitPuppyEnquiry.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitPuppyEnquiry.fulfilled, (state) => { state.submitting = false; state.lastSubmittedAt = Date.now(); })
      .addCase(submitPuppyEnquiry.rejected, (state, action) => { state.submitting = false; state.error = action.payload || 'Unable to submit enquiry.'; });
  },
});
export const { clearEnquiryError } = slice.actions;
export default slice.reducer;
