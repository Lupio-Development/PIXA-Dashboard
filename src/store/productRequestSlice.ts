import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface withdrawRequestState {
  productAddItemData: any[];
  totalPendingData: number;
  productUpdateItemData: any[];
  totalAcceptedData: number;
  declinedData: any[];
  totalDeclinedData: number;
  isLoading: boolean;
}

const initialState: withdrawRequestState = {
    productAddItemData: [],
  totalPendingData: 0,
  productUpdateItemData: [],
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
  productId?: string;
  requestType?: string;
}

export const getProductRequest = createAsyncThunk(
  "admin/product/fetchProductRequest?status=1&start=1&limit=20&requestType=create&requestType=update",
  async (payload: AllWithdrawPayload | undefined) => {
      
    return apiInstanceFetch.get(
      `admin/product/fetchProductRequest?status=${payload?.status}&start=${payload?.start}&limit=${payload?.limit}&requestType=${payload.requestType}`
    );
  }
);

export const productRequestAcceptorDecline = createAsyncThunk(
  "admin/product/handleProductApproval?productId=123&requestType=create&status=2",
  async (payload: any) => {
    return axios.patch(`admin/product/handleProductApproval?productId=${payload?.productId}&requestType=${payload?.requestType}&status=${payload?.status}`);
  }
);

export const productRequestDecline = createAsyncThunk(
  "admin/product/handleProductApproval?productId=123&requestType=create&status=3",
  async (payload: any) => {
    return axios.patch(`admin/product/handleProductApproval?status=${payload?.status}&productId=${payload?.productId}&requestType=${payload?.requestType}&reason=${payload?.reason}`);
  } 
);


const productRequestSlice = createSlice({
  name: "productRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getProductRequest.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      getProductRequest.fulfilled,
      (
        state,
        action: PayloadAction<any, string, { arg: AllWithdrawPayload }>
      ) => {
        
          
        state.isLoading = false;
        if (action.meta.arg?.requestType == "create") {
            
          state.productAddItemData = action.payload.data;
          state.totalPendingData = action.payload.total;
        } else if (action.meta.arg?.requestType === "update") {
          
          state.productUpdateItemData = action.payload.data;
          state.totalAcceptedData = action.payload.total;
        }
      }
    );

    builder.addCase(
      getProductRequest.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );
  
   

    builder.addCase(productRequestAcceptorDecline.pending, (state) => {
          state.isLoading = true;
        });
    
        builder.addCase(
            productRequestAcceptorDecline.fulfilled,
            (state, action: PayloadAction<any, string, { arg: AllWithdrawPayload }>) => {
              state.isLoading = false;
              const { requestType, productId } = action.meta.arg;
              
              if (action.payload.data.status === true) {
                
                if (requestType === "create") {
                  state.productAddItemData = state.productAddItemData.filter(
                    (request) => request?._id !== productId
                  );
                  setToast("success", `Product Request Accepted Successfully`);
                } else if (requestType === "update") {
                  state.productUpdateItemData = state.productUpdateItemData.filter(
                    (request) => request?._id !== productId
                  );
                  setToast("success", `Product Request Accepted Successfully`);
                }
              } else {
                setToast("error", action.payload.data.message);
              }
            }
          );
          
    
        builder.addCase(productRequestAcceptorDecline.rejected, (state) => {
          state.isLoading = false;
        });
   

    builder.addCase(productRequestDecline.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
        productRequestDecline.fulfilled,
        (state, action: PayloadAction<any, string, { arg: AllWithdrawPayload }>) => {
          state.isLoading = false;
          const { requestType, productId } = action.meta.arg;
          
      
          if (action.payload.data.status === true) {
            
            if (requestType === "create") {
              state.productAddItemData = state.productAddItemData.filter(
                (request) => request?._id !== productId
              );
              setToast("success", `Product Request Declined Successfully`);
            }else if (requestType === "update") {
                state.productUpdateItemData = state.productUpdateItemData.filter(
                  (request) => request?._id !== productId
                );
                setToast("success", `Product Request Declined Successfully`);
              }
          } else {
            setToast("error", action.payload.data.message);
          }
        }
      );
      

    builder.addCase(productRequestDecline.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default productRequestSlice.reducer;
