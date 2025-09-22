import { apiInstanceFetch } from '@/util/ApiInstance';
import { setToast } from '@/util/toastServices';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  subcategory: any[];
  total : number;
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  subcategory: [],
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

export const getSubCategories: any = createAsyncThunk(
  'admin/subCategory/getSubCategories',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/subCategory/getSubCategories?start=${payload?.start}&limit=${payload?.limit}`
    );
  }
);

export const createSubCategory = createAsyncThunk(
  'admin/subCategory/addSubCategory',
  async (payload: AllUsersPayload | undefined) => {
    return axios.post(
      'admin/subCategory/addSubCategory',
      payload
    );
  }
);

export const deleteSubCategory = createAsyncThunk(
  'admin/subCategory/removeSubCategory',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/subCategory/removeSubCategory?subCategoryId=${payload}`
    );
  }
);

export const updateSubCategory: any = createAsyncThunk(
  'admin/subCategory/modifySubCategory',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.patch(
      `admin/subCategory/modifySubCategory`,
      payload
    );
  }
);

export const activeSubCategory = createAsyncThunk(
  'admin/subCategory/toggleSubCategoryStatus?subCategoryId',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/subCategory/toggleSubCategoryStatus?subCategoryId=${payload}`
    );
  }
);

const subCategorySlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getSubCategories.pending,
      (state, action: PayloadAction<any>) => {
        state.isSkeleton = true;
        state.isLoading = true;
      }
    );
    builder.addCase(
      getSubCategories.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.subcategory = action.payload.data;
        state.total = action.payload.total;
        state.isLoading = false;
      }
    );
    builder.addCase(
      getSubCategories.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      createSubCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      createSubCategory.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.subcategory.unshift(action?.payload?.data?.subCategory);
          setToast('success', "SubCategory Created Succesfully");
        }
      }
    );
    builder.addCase(createSubCategory.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteSubCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(deleteSubCategory.fulfilled, (state, action: any) => {
      if (action?.payload?.status) {
        state.subcategory = state.subcategory.filter(
          (category) => category?._id !== action?.meta?.arg
        );
        setToast('success', action?.payload?.message);
      }
      state.isLoading = false;
    });
    builder.addCase(deleteSubCategory.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateSubCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateSubCategory.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.status === true) {
        const categoryIndex = state.subcategory.findIndex(
          (category) => category?._id === action?.payload?.data?._id
        );
        if (categoryIndex !== -1) {
          state.subcategory[categoryIndex] = {
            ...state.subcategory[categoryIndex],
            ...action.payload.data,
          };
        }
        setToast('success', action.payload.message);
      }
    });
    builder.addCase(updateSubCategory.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(
      activeSubCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      activeSubCategory.fulfilled,
      (state, action: PayloadAction<any>) => {
        
        if (action?.payload?.data?.status) {
          const updatedCategory = action.payload.data.data;
          const categoryIndex = state.subcategory.findIndex(
            (attribute) => attribute?._id === updatedCategory?._id
          );
          if (categoryIndex !== -1) {
            state.subcategory[categoryIndex].isActive = updatedCategory.isActive;
          }
          setToast('success', action.payload?.data?.message);
        }
        state.isLoading = false;
      }
    );
    builder.addCase(activeSubCategory.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default subCategorySlice.reducer;
