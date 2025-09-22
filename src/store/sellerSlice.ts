import { apiInstanceFetch } from '@/util/ApiInstance';
import { setToast } from '@/util/toastServices';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {

  realOrFakeSeller: any[];
  sellerWiseProduct: any[];
  allSeller: any[];
  allRealSeller: any[];
  allProduct: any[];
  liveSeller: any[];
  totalLiveSeller : any;
  liveProduct: any[];
  sellerWiseOrder: any[];
  statusWiseOrder: any[];
  sellerWiseTransaction: any[];
  orderInfo: any[];
  fakeSeller: any[];
  total: any;
  totalFakeSeller: any;
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  realOrFakeSeller: [],
  fakeSeller: [],
  allProduct: [],
  sellerWiseProduct: [],
  allSeller: [],
  allRealSeller: [],
  liveSeller: [],
  sellerWiseOrder: [],
  statusWiseOrder: [],
  orderInfo: [],
  liveProduct: [],
  sellerWiseTransaction: [],
  total: 0,
  totalLiveSeller : 0,
  totalFakeSeller: 0,
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





export const sendNotificationToSeller: any = createAsyncThunk(
  'admin/notification/pushNotificationToSeller',
  async (payload: AllUsersPayload | undefined) => {
    return axios.post(
      'admin/notification/pushNotificationToSeller',
      payload
    );
  }
);

export const getAllSeller: any = createAsyncThunk(
  'admin/seller/fetchVerifiedSellers',
  async (payload: AllUsersPayload | undefined) => {
    return axios.get(
      'admin/seller/fetchSellerList',
      payload
    );
  }
);

export const getAllRealSeller: any = createAsyncThunk(
  'admin/seller/fetchVerifiedSellers1',
  async (payload: AllUsersPayload | undefined) => {
    return axios.get(
      'admin/seller/fetchVerifiedSellers',
      payload
    );
  }
);

export const getLiveSeller: any = createAsyncThunk(
  'admin/liveVideo/fetchSellerLiveStreams',
  async (payload: AllUsersPayload | undefined) => {
    return axios.get(
      `admin/liveVideo/fetchSellerLiveStreams?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}
      &endDate=${payload?.endDate}`
    );
  }
);


export const getSeller: any = createAsyncThunk(
  'admin/seller/getSellersByType',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/seller/getSellersByType?sellerType=${payload?.type}&start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getFakeSeller: any = createAsyncThunk(
  'admin/seller/getSellersByType1',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/seller/getSellersByType?sellerType=${payload?.type}&start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getSellerWiseProduct: any = createAsyncThunk(
  'admin/product/retrieveSellerProductCatalog',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/product/retrieveSellerProductCatalog?sellerId=${payload?.sellerId}&start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getVendorProduct: any = createAsyncThunk(
  'admin/product/fetchVendorProducts',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/product/fetchVendorProducts?sellerId=${payload?.sellerId}`
    );
  }
);

export const getSellerWiseOrder = createAsyncThunk(
  'admin/order/getSellerOrderHistory',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/order/getSellerOrderHistory?sellerId=${payload?.sellerId}&start=${payload?.start}&limit=${payload?.limit}&status=${payload?.status}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getStatusWiseOrder = createAsyncThunk(
  'admin/order/getSellerOrderHistory1',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/order/fetchOrders?start=${payload?.start}&limit=${payload?.limit}&status=${payload?.status}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getOrderDetails = createAsyncThunk(
  'admin/order/getSellerOrderHistory1',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/order/fetchOrders?start=${payload?.start}&limit=${payload?.limit}&status=${payload?.status}`
    );
  }
);

export const getOrderInfo: any = createAsyncThunk(
  'admin/order/getOrderInfo',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/order/getOrderInfo?orderId=${payload}`
    );
  }
);

export const getSellerWiseTransaction = createAsyncThunk(
  'admin/seller/walletTransactionsOfSeller',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/seller/walletTransactionsOfSeller?sellerId=${payload?.sellerId}&start=${payload?.start}&limit=${payload?.limit}&status=${payload?.status}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const blockUnblock = createAsyncThunk(
  "admin/seller/modifyBlockState?sellerId",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/seller/modifyBlockState?sellerId=${payload}`);
  }
);

export const orderUpdate: any = createAsyncThunk(
  "admin/order/processOrderUpdate",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/order/processOrderUpdate`, payload);
  }
);



export const isLiveProduct: any = createAsyncThunk(
  "admin/livevideo/isLive?videoId=${payload}",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/livevideo/isLive?videoId=${payload}`);
  }
);


export const deleteFakeSeller: any = createAsyncThunk(
  'admin/seller/deactivateSeller?sellerId',
  async (payload: AllUsersPayload | undefined) => {

    return apiInstanceFetch.delete(
      `admin/seller/deactivateSeller?sellerId=${payload}`
    );
  }
);

export const updateFakeSeller: any = createAsyncThunk(
  'admin/seller/adminModifySellerInfo',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/seller/adminModifySellerInfo`,
      payload?.data
    );
  }
);

export const updateLiveSeller: any = createAsyncThunk(
  'admin/liveVideo/updateSellerLiveProducts',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/liveVideo/updateSellerLiveProducts`,
      payload
    );
  }
);

export const createFakeSeller = createAsyncThunk(
  "admin/seller/adminRegisterSeller",
  async (payload: AllUsersPayload | undefined) => {

    return axios.post("admin/seller/adminRegisterSeller", payload?.data);
  }
);

export const createLiveVideo: any = createAsyncThunk(
  "admin/liveVideo/chooseProductsAndLiveSeller",
  async (payload: AllUsersPayload | undefined) => {

    return axios.post("admin/liveVideo/chooseProductsAndLiveSeller", payload);
  }
);

export const deleteLiveSeller = createAsyncThunk(
  "admin/liveVideo/deleteVideo?videoId",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/liveVideo/deleteVideo?videoId=${payload}`
    );
  }
);


const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getSeller.fulfilled, (state, action) => {

      state.isLoading = false;
      state.realOrFakeSeller = action.payload.data

    });


    builder.addCase(
      getSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getAllSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getAllSeller.fulfilled, (state, action) => {

      state.isLoading = false;
      state.allSeller = action.payload.data.data
    });


    builder.addCase(
      getAllSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getAllRealSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getAllRealSeller.fulfilled, (state, action) => {

      state.isLoading = false;
      state.allRealSeller = action.payload.data.data
    });


    builder.addCase(
      getAllRealSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getLiveSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getLiveSeller.fulfilled, (state, action) => {
        
      state.isLoading = false;
      state.liveSeller = action.payload.data.data;
      state.totalLiveSeller = action.payload.data.total
    });


    builder.addCase(
      getLiveSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getFakeSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getFakeSeller.fulfilled, (state, action) => {
      state.isLoading = false;
      state.totalFakeSeller = action.payload.total
      state.fakeSeller = action.payload.data
    });


    builder.addCase(
      getFakeSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getSellerWiseProduct.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getSellerWiseProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sellerWiseProduct = action.payload.data
    });


    builder.addCase(
      getSellerWiseProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getVendorProduct.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getVendorProduct.fulfilled, (state, action) => {

      state.isLoading = false;
      state.allProduct = action.payload.data

    });


    builder.addCase(
      getVendorProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      isLiveProduct.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      isLiveProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action?.payload?.data?.status) {
          const updateLiveVideo = action.payload.data.data;
          const liveVideoDataIndex = state.liveSeller.findIndex(
            (liveSeller) => liveSeller?._id === updateLiveVideo?._id
          );

          if (liveVideoDataIndex !== -1) {

            state.liveSeller[liveVideoDataIndex].isLive =
              updateLiveVideo?.isLive;
          }
          setToast("success", "Seller Live With Product Successfully");
        }
        state.isLoading = false;
      }
    );

    builder.addCase(isLiveProduct.rejected, (state, action) => {
      state.isLoading = false;
    });



    builder.addCase(createFakeSeller.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      createFakeSeller.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action.payload.data.status === true) {
          state.fakeSeller?.unshift(action?.payload?.data?.seller);
          setToast(
            "success",
            `New Fake Seller Created`
          );
        } else {
          setToast("error", action.payload.message);
        }
        state.isLoading = false;
      }
    );

    builder.addCase(createFakeSeller.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(createLiveVideo.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      createLiveVideo.fulfilled,
      (state, action: PayloadAction<any>) => {

        if (action.payload.data.status === true) {
          window?.location.reload();
          state.liveSeller?.unshift(action?.payload?.data?.data);
          setToast(
            "success",
            `New Live Seller Created`
          );
        } else {
          setToast("error", action.payload.data.message);

        }
        state.isLoading = false;
      }
    );

    builder.addCase(createLiveVideo.rejected, (state) => {
      state.isLoading = false;
    });


    builder.addCase(
      sendNotificationToSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(sendNotificationToSeller.fulfilled, (state, action) => {

      state.isLoading = false;
      if (action?.payload?.data?.status == true) {
        setToast(
          "success",
          `Notification Send Succefully`
        );
      } else {
        setToast(
          "error",
          action.payload.data.message
        );
      }
    });


    builder.addCase(
      sendNotificationToSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );



    builder.addCase(
      getSellerWiseOrder.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getSellerWiseOrder.fulfilled, (state, action) => {

      state.isLoading = false;
      state.total = action.payload.total
      state.sellerWiseOrder = action.payload.orders

    });


    builder.addCase(
      getSellerWiseOrder.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getStatusWiseOrder.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getStatusWiseOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.total = action.payload.totalOrders
      state.statusWiseOrder = action.payload.orders

    });


    builder.addCase(
      getStatusWiseOrder.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getOrderInfo.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getOrderInfo.fulfilled, (state, action) => {

      state.isLoading = false;
      state.total = action.payload.totalOrders
      state.orderInfo = action.payload.orderInfo

    });


    builder.addCase(
      getOrderInfo.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getSellerWiseTransaction.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getSellerWiseTransaction.fulfilled, (state, action) => {

      state.isLoading = false;
      state.total = action.payload.total
      state.sellerWiseTransaction = action.payload.data

    });


    builder.addCase(
      getSellerWiseTransaction.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      blockUnblock.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      blockUnblock.fulfilled,
      (state, action: PayloadAction<any>) => {
        ;
        if (action?.payload?.data?.status) {
          const updatedSellerData = action.payload.data.data;
          const index = state.realOrFakeSeller.findIndex(
            (data) => data?._id === updatedSellerData?._id
          );

          if (index !== -1) {
            state.realOrFakeSeller[index].isBlock = updatedSellerData.isBlock;
          }

          // ✅ Fix: Use separate if statements
          if (updatedSellerData.isBlock === true) {
            setToast("success", "Seller Blocked Successfully");
          } else {

            setToast("success", "Seller Unblocked Successfully");
          }
        }
        state.isLoading = false;
      }
    );


    builder.addCase(blockUnblock.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(
      orderUpdate.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );



    builder.addCase(orderUpdate.fulfilled, (state, action: any) => {
      const type = localStorage.getItem("type");

      if (action?.payload?.data?.status) {
        const updatedItem = action.payload.data.data;
        const itemId = action.meta.arg.itemId;

        state.statusWiseOrder = state.statusWiseOrder.map((order) => ({
          ...order,
          items: order.items
            .map((item) => {
              if (item._id === itemId) {
                const newStatus =
                  updatedItem?.items?.find((data) => data._id === itemId)?.status || item.status;
                return { ...item, status: newStatus };
              }
              return item;
            })
            .filter((item) => {
              if (type === "All") return true;
              return (item._id !== itemId);
            }),
        }));

        setToast("success", "Order Status Updated Successfully");
      }
      state.isLoading = false;
    });

    builder.addCase(orderUpdate.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteFakeSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(deleteFakeSeller.fulfilled, (state, action: any) => {
      if (action?.payload?.success) {
        state.fakeSeller = state.fakeSeller.filter(
          (fakeSeller) => fakeSeller?._id !== action?.meta?.arg
        );
        setToast('success', "Fake Seller Deleted Succesfully");
      }
      state.isLoading = false;
    });
    builder.addCase(deleteFakeSeller.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteLiveSeller.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      deleteLiveSeller.fulfilled,
      (state, action: PayloadAction<any, string, { arg: any }>) => {

        state.isLoading = false;

        if (action?.payload?.status === true) {

          const deletedUserIds = action.meta.arg;
          state.liveSeller = state.liveSeller.filter(
            (video: any) => video?._id !== deletedUserIds
          );
          setToast("success", "Live Seller Delete Successfully");
        } else {
          setToast("error", action?.payload?.message);
        }
      }
    );

    builder.addCase(
      deleteLiveSeller.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(updateFakeSeller.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateFakeSeller.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.data.status === true) {
        const fakeSellerIndex = state.fakeSeller.findIndex(
          (category) => category?._id === action?.payload?.data?.seller?._id
        );
        if (fakeSellerIndex !== -1) {
          state.fakeSeller[fakeSellerIndex] = {
            ...state.fakeSeller[fakeSellerIndex],
            ...action.payload.data.seller,
          };
        }
        setToast('success', "Fake Seller Updated Succesfully");
      } else {

        setToast('error', action.payload.data.message)
      }
    });
    builder.addCase(updateFakeSeller.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateLiveSeller.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateLiveSeller.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.data.status === true) {

        const liveSellerIndex = state.liveSeller.findIndex(
          (category) => category?._id === action?.payload?.data?.data?._id
        );
        if (liveSellerIndex !== -1) {

          state.liveSeller[liveSellerIndex] = {
            ...state.liveSeller[liveSellerIndex],
            ...action.payload.data.data,
          };
        }
        setToast('success', "Fake Seller Updated Succesfully");
      } else {

        setToast('error', action.payload.data.message)
      }
    });
    builder.addCase(updateLiveSeller.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default sellerSlice.reducer;
