import { apiInstanceFetch } from '@/util/ApiInstance';
import { setToast } from '@/util/toastServices';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  banks: any[];
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  banks: [],
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

export const getBanks: any = createAsyncThunk(
  'admin/bank/listBanks',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/bank/listBanks`
    );
  }
);

export const createBank = createAsyncThunk(
  'admin/bank/createBank',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.post(
      'admin/bank/createBank',
      payload
    );
  }
);

export const deleteBank = createAsyncThunk(
  'admin/bank/deleteBank?bankId',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/bank/deleteBank?bankId=${payload}`
    );
  }
);

export const updateBank: any = createAsyncThunk(
  'admin/bank/updateBank',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.patch(
      `admin/bank/updateBank`,
      payload
    );
  }
);

export const activeBank = createAsyncThunk(
  'admin/bank/toggleBankStatus?bankId',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/bank/toggleBankStatus?bankId=${payload}`
    );
  }
);

const bankSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getBanks.pending,
      (state, action: PayloadAction<any>) => {
        state.isSkeleton = true;
        state.isLoading = true;
      }
    );
    builder.addCase(
      getBanks.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.banks = action.payload.bank;
        state.isLoading = false;
      }
    );
    builder.addCase(
      getBanks.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      createBank.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      createBank.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.banks.unshift(action?.payload?.bank);

          setToast('success', "Bank Created Succesfully");
        }
      }
    );
    builder.addCase(createBank.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteBank.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(deleteBank.fulfilled, (state, action: any) => {
      if (action?.payload?.status) {
        state.banks = state.banks.filter(
          (bank) => bank?._id !== action?.meta?.arg
        );
        setToast('success', "Bank Deleted Succesfully");
      }
      state.isLoading = false;
    });
    builder.addCase(deleteBank.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateBank.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateBank.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.status === true) {
        const bankIndex = state.banks.findIndex(
          (banks) => banks?._id === action?.payload?.bank?._id
        );
        if (bankIndex !== -1) {
          state.banks[bankIndex] = {
            ...state.banks[bankIndex],
            ...action.payload.bank,
          };
        }
        setToast('success', "Bank Updated Succesfully");
      }
    });
    builder.addCase(updateBank.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(
      activeBank.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      activeBank.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action?.payload?.data?.status) {
          const updatedCategory = action.payload.data.data;
          const categoryIndex = state.banks.findIndex(
            (attribute) => attribute?._id === updatedCategory?._id
          );
          if (categoryIndex !== -1) {
            state.banks[categoryIndex].isActive = updatedCategory.isActive;
          }
          setToast('success', action.payload?.data?.message);
        }
        state.isLoading = false;
      }
    );
    builder.addCase(activeBank.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default bankSlice.reducer;
