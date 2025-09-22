
import { apiInstanceFetch } from '@/util/ApiInstance';
import { setToast } from '@/util/toastServices';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  promocode: any[];
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  promocode: [],
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

export const getPromocodes: any = createAsyncThunk(
  'admin/promoCode/getAllPromoCodes',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/promoCode/getAllPromoCodes`
    );
  }
);

export const createPromocode = createAsyncThunk(
  'admin/promoCode/createPromoCode',
  async (payload: AllUsersPayload | undefined) => {
    return axios.post(
      'admin/promoCode/createPromoCode',
      payload
    );
  }
);

export const deletePromocode = createAsyncThunk(
  'admin/promoCode/deletePromoCode?promoCodeId',
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/promoCode/deletePromoCode?promoCodeId=${payload}`
    );
  }
);

export const updatePromoCode: any = createAsyncThunk(
  'admin/promoCode/updatePromoCode',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/promoCode/updatePromoCode?promoCodeId=${payload?.id}`,
      payload
    );
  }
);

const promocodeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getPromocodes.pending,
      (state, action: PayloadAction<any>) => {
        state.isSkeleton = true;
        state.isLoading = true;
      }
    );
    builder.addCase(
      getPromocodes.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.promocode = action.payload.promoCodes;
        state.isLoading = false;
      }
    );
    builder.addCase(
      getPromocodes.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      createPromocode.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      createPromocode.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.promocode.unshift(action?.payload?.data?.newPromoCode);
          setToast('success', "Promocode Created Succesfully");
        }
      }
    );
    builder.addCase(createPromocode.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      deletePromocode.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(deletePromocode.fulfilled, (state, action: any) => {
      if (action?.payload?.status) {
        state.promocode = state.promocode.filter(
          (category) => category?._id !== action?.meta?.arg
        );
        setToast('success', "Promocode Deleted Succesfully");
      }
      state.isLoading = false;
    });
    builder.addCase(deletePromocode.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updatePromoCode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updatePromoCode.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.data.status === true) {
        const categoryIndex = state.promocode.findIndex(
          (category) => category?._id === action?.payload?.data?.promoCode?._id
        );
        if (categoryIndex !== -1) {
          state.promocode[categoryIndex] = {
            ...state.promocode[categoryIndex],
            ...action.payload.data.promoCode,
          };
        }
        setToast('success', "Promocode Updated Succesfully");
      }
    });
    builder.addCase(updatePromoCode.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default promocodeSlice.reducer;
