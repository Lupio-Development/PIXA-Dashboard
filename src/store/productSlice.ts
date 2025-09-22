import { apiInstanceFetch } from '@/util/ApiInstance';
import { setToast } from '@/util/toastServices';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  realOrFakeProduct: any[];
  sellerWiseProduct: any[];
  sellerWiseOrder: any[];
  sellerWiseTransaction: any[];
  totalRealProduct : any[];
  categoryOrSubCategoryData : any[];
  fakeProduct: any[];
  total: any;
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  realOrFakeProduct: [],
  categoryOrSubCategoryData : [],
  fakeProduct: [],
  sellerWiseProduct: [],
  sellerWiseOrder: [],
  totalRealProduct : [],
  sellerWiseTransaction: [],
  total: 0,
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


export const getProduct: any = createAsyncThunk(
  'admin/product/getProductCatalog',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/product/getProductCatalog?productType=${payload?.type}&start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getFakeProduct: any = createAsyncThunk(
  'admin/product/getProductCatalog1',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/product/getProductCatalog?productType=${payload?.type}&start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getSellerWiseProduct : any = createAsyncThunk(
  'admin/product/retrieveSellerProductCatalog',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/product/retrieveSellerProductCatalog?sellerId=${payload?.sellerId}&start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getSellerWiseOrder = createAsyncThunk(
  'admin/order/getSellerOrderHistory',
  async (payload: any) => {

    return apiInstanceFetch.get(
      `admin/order/getSellerOrderHistory?sellerId=${payload?.sellerId}&start=${payload?.start}&limit=${payload?.limit}&status=${payload?.status}`
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

export const isJustLaunched : any = createAsyncThunk(
  "admin/product/toggleJustLaunchedStatus?productId",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/product/toggleJustLaunchedStatus?productId=${payload}`);
  }
);

export const isLiveProduct = createAsyncThunk(
  "admin/seller/modifyBlockState?sellerId",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/seller/chooseProductsAndLiveSeller?sellerId=${payload}`);
  }
);


export const deleteFakeProduct: any = createAsyncThunk(
  'admin/product/deleteCatalogProduct?productId',
  async (payload: AllUsersPayload | undefined) => {
    return axios.delete(
      `admin/product/deleteCatalogProduct?productId=${payload}`
    );
  }
);

export const updateFakeProduct: any = createAsyncThunk(
  'admin/product/updateProductRecord',
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/product/updateProductRecord`,
      payload?.data
    );
  }
);

export const createFakeProduct = createAsyncThunk(
  "admin/product/uploadNewCatalogProduct",
  async (payload: AllUsersPayload | undefined) => {
    return axios.post("admin/product/uploadNewCatalogProduct", payload?.data);
  }
);

export const getCategoryOrSubCategory : any = createAsyncThunk(
  "admin/product/getCategoryWiseData",
  async (payload: AllUsersPayload | undefined) => {
    return axios.get("admin/product/getCategoryWiseData", payload?.data);
  }
);


const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getProduct.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getProduct.fulfilled, (state, action) => {
      
      state.isLoading = false;
      state.realOrFakeProduct = action.payload.data;
      state.totalRealProduct = action.payload.total

    });


    builder.addCase(
      getProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      getCategoryOrSubCategory.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getCategoryOrSubCategory.fulfilled, (state, action) => {
      
      state.isLoading = false;
      state.categoryOrSubCategoryData = action.payload.data.data

    });


    builder.addCase(
      getCategoryOrSubCategory.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );


    builder.addCase(
      getFakeProduct.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(getFakeProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.fakeProduct = action.payload.data;
      state.total = action.payload.total
    });


    builder.addCase(
      getFakeProduct.rejected,
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
      state.total = action.payload.total
      state.sellerWiseProduct = action.payload.data

    });


    builder.addCase(
      getSellerWiseProduct.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );



    builder.addCase(createFakeProduct.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      createFakeProduct.fulfilled,
      
      (state, action: PayloadAction<any>) => {
        
        if (action.payload.data.status === true) {
          
          state.fakeProduct?.unshift(action?.payload?.data?.product);
          setToast(
            "success",
            `New Fake Product Created`
          );
        } else {
           setToast("error", action.payload?.data?.message);
        }
        state.isLoading = false;
      }
    );

    builder.addCase(createFakeProduct.rejected, (state) => {
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
      isJustLaunched.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      isJustLaunched.fulfilled,
      (state, action: any) => {
        
        if (action?.payload?.data?.status) {
          
          const updatedSellerData = action.payload.data.isJustLaunched;
          const index : any = state.fakeProduct.findIndex(
            (data) => data?._id === action?.meta?.arg
          );

          if (index !== -1) {
            
            state.fakeProduct[index].isJustLaunched = updatedSellerData;
          }

          // ✅ Fix: Use separate if statements
          if (updatedSellerData === true) {
            setToast("success", "Product Launched Successfully");
          } else {

            setToast("success", "Product UnLaunched Successfully");
          }
        }
        state.isLoading = false;
      }
    );


    builder.addCase(isJustLaunched.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteFakeProduct.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(deleteFakeProduct.fulfilled, (state, action: any) => {
      if (action?.payload?.data?.status) {
        state.fakeProduct = state.fakeProduct.filter(
          (fakeProduct) => fakeProduct?._id !== action?.meta?.arg
        );
        setToast('success', "Fake Product Deleted Succesfully");

        state.realOrFakeProduct = state.realOrFakeProduct.filter(
          (realOrFakeProduct) => realOrFakeProduct?._id !== action?.meta?.arg
        );
        setToast('success', "Real Product Deleted Succesfully");
      }
      state.isLoading = false;
    });
    builder.addCase(deleteFakeProduct.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateFakeProduct.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateFakeProduct.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (action.payload.data.status === true) {
        

        const fakeProductIndex = state.fakeProduct.findIndex(
          (category) => category?._id === action?.payload?.data?.product?._id
        );
        
        if (fakeProductIndex !== -1) {
          state.fakeProduct[fakeProductIndex] = {
            ...state.fakeProduct[fakeProductIndex],
            ...action.payload.data.product,
          };
        }
        setToast('success', "Fake Product Updated Succesfully");

        const realOrFakeProductIndex = state.realOrFakeProduct.findIndex(
          (category) => category?._id === action?.payload?.data?.product?._id
        );
        
        if (realOrFakeProductIndex !== -1) {
          state.realOrFakeProduct[realOrFakeProductIndex] = {
            ...state.realOrFakeProduct[realOrFakeProductIndex],
            ...action.payload.data.product,
          };
        }
        setToast('success', "Real Product Updated Succesfully");
      } else {
        
        setToast('error', action.payload.data.message)
      }
    });
    builder.addCase(updateFakeProduct.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default productSlice.reducer;
