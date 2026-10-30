import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createContactMessage } from './contactService';

export const submitContactMessage = createAsyncThunk(
  'contact/submit',
  async (payload, { rejectWithValue }) => {
    try { return await createContactMessage(payload); }
    catch (error) { return rejectWithValue(error.userMessage || 'We could not send your message. Please try again.'); }
  }
);

const slice = createSlice({
  name: 'contact',
  initialState: { submitting: false, error: null, lastSubmittedAt: null },
  reducers: { clearContactError(state) { state.error = null; } },
  extraReducers(builder) {
    builder.addCase(submitContactMessage.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitContactMessage.fulfilled, (state) => { state.submitting = false; state.lastSubmittedAt = Date.now(); })
      .addCase(submitContactMessage.rejected, (state, action) => { state.submitting = false; state.error = action.payload || 'Unable to submit message.'; });
  },
});
export const { clearContactError } = slice.actions;
export default slice.reducer;
