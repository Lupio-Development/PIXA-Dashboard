import { apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  dashCount: Object;
  chartAnalyticOfUsers: any;
  chartAnalyticOfPosts: any;
  chartAnalyticOfVideos: any;
  totalCommission : any;
  activeInactiveSeller : any;
  activeInactiveUser : any;
  totalEarningWithCommission : any;
  totalEarningWithoutCommission : any;
  recentOrder : any;
  topSellingProduct : any;
  topRatingProduct : any;
  topBuyer : any;
  topSeller : any;
  isLoading: boolean;
}

const initialState: UserState = {
  dashCount: {},
  chartAnalyticOfUsers: [],
  chartAnalyticOfPosts: [],
  chartAnalyticOfVideos: [],
  activeInactiveSeller : [],
  activeInactiveUser : [],
  totalCommission : [],
  totalEarningWithCommission : [],
  totalEarningWithoutCommission : [],
  recentOrder : [],
  topBuyer : [],
  topSeller : [],
  topSellingProduct : [],
  topRatingProduct : [],
  isLoading: false,
};

interface AllUsersPayload {
  start?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
}

export const dashboardCount = createAsyncThunk(
  "admin/dashboard/dashboardCount",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/dashboardCount?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);
export const getChartUser = createAsyncThunk(
  "admin/dashboard/chartAnalytic/user",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/chartAnalytic?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=User`
    );
  }
);

export const getChartRevenueAnalytics = createAsyncThunk(
  "admin/dashboard/chartRevenueAnalytics/user",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/chartRevenueAnalytics?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);
export const getChartPost = createAsyncThunk(
  "admin/dashboard/chartAnalytic/post",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/chartAnalytic?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=Post`
    );
  }
);
export const getChartVideo = createAsyncThunk(
  "admin/dashboard/chartAnalytic/video",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/chartAnalytic?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=Video`
    );
  }
);

export const getActiveInactiveSeller = createAsyncThunk(
  "admin/dashboard/chartAnalyticOfSeller/activeSeller",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/chartAnalyticOfSeller?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=activeSeller`
    );
  }
);

export const getActiveInactiveUser = createAsyncThunk(
  "admin/dashboard/chartAnalyticOfUser/inactiveUser",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/chartAnalyticOfUser?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=inactiveUser`
    );
  }
);


export const getRecentOrder : any = createAsyncThunk(
  "admin/dashboard/getRecentOrders",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/getRecentOrders?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getTopSellingProduct : any = createAsyncThunk(
  "admin/dashboard/fetchTopProducts",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/fetchTopProducts?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getTopRatingProduct : any = createAsyncThunk(
  "admin/dashboard/getTopRatedProducts",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/getTopRatedProducts?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getTopBuyer : any = createAsyncThunk(
  "admin/dashboard/fetchTopBuyers",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/fetchTopBuyers?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);

export const getTopSeller : any = createAsyncThunk(
  "admin/dashboard/listTopSellers",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/dashboard/listTopSellers?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
    );
  }
);



const dashSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      dashboardCount.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      dashboardCount.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.dashCount = action.payload.data;
      }
    );
    builder.addCase(
      dashboardCount.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getChartPost.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getChartPost.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.chartAnalyticOfPosts = action?.payload?.chartPost;
      }
    );
    builder.addCase(
      getChartPost.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getActiveInactiveSeller.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getActiveInactiveSeller.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.activeInactiveSeller = action?.payload?.data;
      }
    );
    builder.addCase(
      getActiveInactiveSeller.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.data);
      }
    );

    builder.addCase(
      getActiveInactiveUser.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getActiveInactiveUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        
        state.isLoading = false;
        state.activeInactiveUser = action?.payload?.data;
      }
    );
    builder.addCase(
      getActiveInactiveUser.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.data);
      }
    );

    builder.addCase(
      getChartRevenueAnalytics.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getChartRevenueAnalytics.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.totalCommission = action?.payload?.totalCommission;
        state.totalEarningWithCommission = action?.payload?.totalEarningWithCommission;
        state.totalEarningWithoutCommission = action?.payload.totalEarningWithoutCommission
      }
    );
    builder.addCase(
      getChartRevenueAnalytics.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getChartUser.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getChartUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.chartAnalyticOfUsers = action?.payload?.chartUser;
      }
    );
    builder.addCase(
      getChartUser.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );
    builder.addCase(
      getChartVideo.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getChartVideo.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.chartAnalyticOfVideos = action?.payload?.chartVideo;
      }
    );
    builder.addCase(
      getChartVideo.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getRecentOrder.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getRecentOrder.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.recentOrder = action?.payload?.orders;
      }
    );
    builder.addCase(
      getRecentOrder.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );



    builder.addCase(
      getTopSellingProduct.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getTopSellingProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
        
        state.isLoading = false;
        state.topSellingProduct = action?.payload?.products;
      }
    );
    builder.addCase(
      getTopSellingProduct.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getTopRatingProduct.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getTopRatingProduct.fulfilled,
      (state, action: PayloadAction<any>) => {
          
        state.isLoading = false;
        state.topRatingProduct = action?.payload?.popularProducts;
      }
    );
    builder.addCase(
      getTopRatingProduct.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getTopBuyer.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getTopBuyer.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.topBuyer = action?.payload?.topCustomers;
      }
    );
    builder.addCase(
      getTopBuyer.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      getTopSeller.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      getTopSeller.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.topSeller = action?.payload?.topSellers;
      }
    );
    builder.addCase(
      getTopSeller.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );
  },
});

export default dashSlice.reducer;
