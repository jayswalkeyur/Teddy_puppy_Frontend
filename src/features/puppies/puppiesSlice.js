import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeaturedPuppies, getPuppies, getPuppyBySlug } from './puppiesService';

const messageOf = (error) => error.userMessage || error.response?.data?.message || error.message || 'Unable to load puppies.';

export const fetchPuppies = createAsyncThunk(
  'puppies/fetchList',
  async (params = {}, { rejectWithValue, signal }) => {
    try { return await getPuppies(params, { signal }); }
    catch (error) { return rejectWithValue(messageOf(error)); }
  },
  { condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().puppies.listStatus) }
);

export const fetchFeaturedPuppies = createAsyncThunk(
  'puppies/fetchFeatured',
  async (_, { rejectWithValue, signal }) => {
    try { return await getFeaturedPuppies({ signal }); }
    catch (error) { return rejectWithValue(messageOf(error)); }
  },
  { condition: (_, { getState }) => getState().puppies.featuredStatus !== 'loading' }
);

export const fetchPuppyBySlug = createAsyncThunk(
  'puppies/fetchBySlug',
  async (slug, { rejectWithValue, signal }) => {
    try { return { slug, result: await getPuppyBySlug(slug, { signal }) }; }
    catch (error) { return rejectWithValue({ slug, message: messageOf(error), status: error.response?.status }); }
  },
  { condition: (slug, { getState }) => getState().puppies.detailsStatus[slug] !== 'loading' }
);

const initialState = {
  list: [], pagination: null, listStatus: 'idle', listError: null,
  featured: [], featuredStatus: 'idle', featuredError: null,
  details: {}, detailsStatus: {}, detailsError: {}, detailsHttpStatus: {},
};

const slice = createSlice({
  name: 'puppies',
  initialState,
  reducers: { clearPuppyErrors(state) { state.listError = null; state.featuredError = null; state.detailsError = {}; } },
  extraReducers(builder) {
    builder
      .addCase(fetchPuppies.pending, (state) => { state.listStatus = 'loading'; state.listError = null; })
      .addCase(fetchPuppies.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload?.data || [];
        state.pagination = action.payload?.pagination || null;
      })
      .addCase(fetchPuppies.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.listStatus = 'failed'; state.listError = action.payload || 'Unable to load puppies.';
      })
      .addCase(fetchFeaturedPuppies.pending, (state) => { state.featuredStatus = 'loading'; state.featuredError = null; })
      .addCase(fetchFeaturedPuppies.fulfilled, (state, action) => { state.featuredStatus = 'succeeded'; state.featured = action.payload?.data || []; })
      .addCase(fetchFeaturedPuppies.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.featuredStatus = 'failed'; state.featuredError = action.payload || 'Unable to load featured puppies.';
      })
      .addCase(fetchPuppyBySlug.pending, (state, action) => { state.detailsStatus[action.meta.arg] = 'loading'; delete state.detailsError[action.meta.arg]; delete state.detailsHttpStatus[action.meta.arg]; })
      .addCase(fetchPuppyBySlug.fulfilled, (state, action) => {
        const { slug, result } = action.payload;
        state.detailsStatus[slug] = 'succeeded';
        state.details[slug] = result?.data || result; state.detailsHttpStatus[slug] = 200;
      })
      .addCase(fetchPuppyBySlug.rejected, (state, action) => {
        const slug = action.meta.arg;
        if (action.meta.condition) return;
        state.detailsStatus[slug] = 'failed';
        state.detailsError[slug] = action.payload?.message || 'Unable to load this puppy.'; state.detailsHttpStatus[slug] = action.payload?.status || null;
      });
  },
});

export const { clearPuppyErrors } = slice.actions;
export default slice.reducer;
