import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface withdrawRequestState {
  pendingData: any[];
  totalPendingData: number;
  acceptedData: any[];
  totalAcceptedData: number;
  declinedData: any[];
  totalDeclinedData: number;
  isLoading: boolean;
}

const initialState: withdrawRequestState = {
  pendingData: [],
  totalPendingData: 0,
  acceptedData: [],
  totalAcceptedData: 0,
  declinedData: [],
  totalDeclinedData: 0,
  isLoading: false,
};

interface AllWithdrawPayload {
  start?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  meta?: any;
  type?: any;
  reasonData?: string;
  withdrawRequestId?: string;
  data?: any;
  reason?: any;
  status?: number;
  sellerId?: string;
}

export const getSellerRequest = createAsyncThunk(
  "admin/seller/fetchSellerRequest?status=1",
  async (payload: AllWithdrawPayload | undefined) => {
      
    return apiInstanceFetch.get(
      `admin/seller/fetchSellerRequest?status=${payload?.status}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const sellerRequestAcceptorDecline = createAsyncThunk(
  "admin/withdrawRequest/accept1",
  async (payload: any) => {
    return axios.patch(`admin/seller/evaluateSellerRequest?status=${payload?.status}&sellerId=${payload?.sellerId}`);
  }
);

export const sellerRequestDecline = createAsyncThunk(
  "admin/withdrawRequest/accept2",
  async (payload: any) => {
    return axios.patch(`admin/seller/evaluateSellerRequest?status=${payload?.status}&sellerId=${payload?.sellerId}&reason=${payload?.reason}`);
  }
);


const sellerRequestSlice = createSlice({
  name: "sellerRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getSellerRequest.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      getSellerRequest.fulfilled,
      (
        state,
        action: PayloadAction<any, string, { arg: AllWithdrawPayload }>
      ) => {
          
        state.isLoading = false;
        if (action.meta.arg?.status === 1) {
          
          state.pendingData = action.payload.data;
          state.totalPendingData = action.payload.total;
        } else if (action.meta.arg?.status === 2) {
          
          state.acceptedData = action.payload.data;
          state.totalAcceptedData = action.payload.total;
        } else if (action.meta.arg?.status === 3) {
          state.declinedData = action.payload.data;
          state.totalDeclinedData = action.payload.total;
        }
      }
    );

    builder.addCase(
      getSellerRequest.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );
  
   

    builder.addCase(sellerRequestAcceptorDecline.pending, (state) => {
          state.isLoading = true;
        });
    
        builder.addCase(
          sellerRequestAcceptorDecline.fulfilled,
          (
            state,
            action: PayloadAction<any, string, { arg: AllWithdrawPayload }>
          ) => {
            state.isLoading = false;
            if (action.payload.data.status === true) {
              
              state.pendingData = state.pendingData.filter(
                (request) => request?._id !== action?.meta?.arg?.sellerId
              );
              setToast("success", `Seller Request Accepted Successfully`);
            } else {
              setToast("error", action.payload.data.message);
            }
          }
        );
    
        builder.addCase(sellerRequestAcceptorDecline.rejected, (state) => {
          state.isLoading = false;
        });
   

    builder.addCase(sellerRequestDecline.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      sellerRequestDecline.fulfilled,
      (
        state,
        action: PayloadAction<any, string, { arg: AllWithdrawPayload }>
      ) => {
        state.isLoading = false;
        if (action.payload.data.status === true) {
          
          
          state.pendingData = state.pendingData.filter(
            (request) => request?._id !== action?.meta?.arg?.sellerId
          );
          setToast("success", `Seller Request Declined Successfully`);
        } else {
          setToast("error", action.payload.data.message);
        }
      }
    );

    builder.addCase(sellerRequestDecline.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default sellerRequestSlice.reducer;
