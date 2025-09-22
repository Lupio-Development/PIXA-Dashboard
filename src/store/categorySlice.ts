import { apiInstanceFetch } from '@/util/ApiInstance';
import { setToast } from '@/util/toastServices';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  category: any[];
  total : number;
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  category: [],
  total : 0,
  isLoading: false,
  isSkeleton: false,
};

interface AllUsersPayload {
  start?: number;
  limit?: number;
  search: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  meta?: any;
  id?: any;
  name?: string;
  data: any;
  categoryId: any;
  payload: any;
}

export const getCategories: any = createAsyncThunk(
  'admin/category/getCategories',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/category/getCategories?start=${payload?.start}&limit=${payload?.limit}`
    );
  }
);

export const createCategory = createAsyncThunk(
  'admin/category/createCategory',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.post(
      'admin/category/createCategory',
      payload
    );
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/category/removeCategory',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/category/removeCategory?categoryId=${payload}`
    );
  }
);

export const updateCategory: any = createAsyncThunk(
  'admin/category/modifyCategory?categoryId',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/category/modifyCategory?categoryId=${payload?.id}&name=${payload.name}`
    );
  }
);

export const activeCategory = createAsyncThunk(
  'admin/category/toggleCategoryStatus',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/category/toggleCategoryStatus?categoryId=${payload}`
    );
  }
);

const categorySlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCategories.pending,
      (state, action: PayloadAction<any>) => {
        state.isSkeleton = true;
        state.isLoading = true;
      }
    );
    builder.addCase(
      getCategories.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.category = action.payload.data;
        state.total = action.payload.total;
        state.isLoading = false;
      }
    );
    builder.addCase(
      getCategories.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      createCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.category.unshift(action?.payload?.category);

          setToast('success', "Category created succesfully");
        }
      }
    );
    builder.addCase(createCategory.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(deleteCategory.fulfilled, (state, action: any) => {
      if (action?.payload?.status) {
        state.category = state.category.filter(
          (category) => category?._id !== action?.meta?.arg
        );
        setToast('success', "Category deleted succesfully");
      }
      state.isLoading = false;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCategory.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.data.status === true) {
        const categoryIndex = state.category.findIndex(
          (category) => category?._id === action?.payload?.data?.data?._id
        );
        if (categoryIndex !== -1) {
          state.category[categoryIndex] = {
            ...state.category[categoryIndex],
            ...action.payload.data.data,
          };
        }
        setToast('success', action.payload.data.message);
      }
    });
    builder.addCase(updateCategory.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(
      activeCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      activeCategory.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action?.payload?.data?.status) {
          const updatedCategory = action.payload.data.data;
          const categoryIndex = state.category.findIndex(
            (attribute) => attribute?._id === updatedCategory?._id
          );
          if (categoryIndex !== -1) {
            state.category[categoryIndex].isActive = updatedCategory.isActive;
          }
          setToast('success', action.payload?.data?.message);
        }
        state.isLoading = false;
      }
    );
    builder.addCase(activeCategory.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default categorySlice.reducer;
