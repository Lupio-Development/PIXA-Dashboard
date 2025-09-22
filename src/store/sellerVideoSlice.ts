import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface VideoState {
    realSellerVideo: any[];
    fakeSellerVideo: any[];
    totalRealVideo: number;
    fakeVideoData: any[];
    liveVideoData: any[];
    videoData: Object;
    totalLiveVideo: number;
    totalFakeVideo: number;
    countryData: any[];
    isLoading: boolean;
}

const initialState: VideoState = {
    realSellerVideo: [],
    fakeSellerVideo: [],

    totalRealVideo: 0,
    fakeVideoData: [],
    liveVideoData: [],
    videoData: {},
    totalFakeVideo: 0,
    totalLiveVideo: 0,
    countryData: [],
    isLoading: false,
};

interface AllVideoPayload {
    start?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
    meta: any;
    videoId: string;
    fakeUserId: String;
    id?: string;
    data: any;
}

export const allVideoOfSeller = createAsyncThunk(
    "admin/video/fetchSellerVideoCatalog",
    async (payload: AllVideoPayload | undefined) => {
        return apiInstanceFetch.get(
            `admin/video/fetchSellerVideoCatalog?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.type}`
        );
    }
);

export const getLiveVideo: any = createAsyncThunk(
    "admin/livevideo/getVideos",
    async (payload: AllVideoPayload | undefined) => {
        return apiInstanceFetch.get(
            `admin/livevideo/getVideos?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.type}`
        );
    }
);

export const getVideoDetails: any = createAsyncThunk(
    "admin/user/getDetailOfVideo?videoId",
    async (payload: PayloadAction | undefined) => {
        return apiInstanceFetch.get(
            `admin/video/getDetailOfVideo?videoId=${payload}
`
        );
    }
);

export const deleteVideoOfSeller = createAsyncThunk(
    "admin/liveVideo/deleteVideo?videoId",
    async (payload: AllVideoPayload | undefined) => {
        return apiInstanceFetch.delete(
            `admin/video/deleteVideo?videoId=${payload}`
        );
    }
);

export const deleteVideoOfFakeSeller = createAsyncThunk(
    "admin/liveVideo/deleteVideo1?videoId",
    async (payload: AllVideoPayload | undefined) => {
        return apiInstanceFetch.delete(
            `admin/video/deleteVideo?videoId=${payload}`
        );
    }
);

export const addVideoOfSeller = createAsyncThunk(
    "admin/video/sellerUploadVideo",
    async (payload: AllVideoPayload | undefined) => {
        return apiInstanceFetch.post(`admin/video/sellerUploadVideo`, payload?.data);
    }
);

export const updateFakeVideo = createAsyncThunk(
    "admin/video/updateSellerVideo",
    async (payload: AllVideoPayload | undefined) => {
        return apiInstanceFetch.patch(`admin/video/updateSellerVideo`, payload?.data);
    }
);

export const activeVideo = createAsyncThunk(
    "admin/livevideo/isLive",
    async (payload: AllVideoPayload | undefined) => {
        return axios.patch(`admin/livevideo/isLive?videoId=${payload}`);
    }
);

const sellerVideoReducer = createSlice({
    name: "video",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(allVideoOfSeller.pending, (state, action: PayloadAction<any>) => {
            state.isLoading = true;
        });

        builder.addCase(
            allVideoOfSeller.fulfilled,
            (state, action: PayloadAction<any, string, { arg: AllVideoPayload }>) => {

                if (action.meta.arg.type === "realVideo") {
                    state.realSellerVideo = action.payload.videos;
                    state.totalRealVideo = action?.payload?.totalVideos;
                } else if (action.meta.arg.type === "fakeVideo") {
                    state.fakeSellerVideo = action.payload.videos;
                    state.totalFakeVideo = action?.payload?.totalVideos;
                }
                state.isLoading = false;
            }
        );

        builder.addCase(allVideoOfSeller.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
        });

        builder.addCase(
            getLiveVideo.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder.addCase(
            getLiveVideo.fulfilled,
            (state, action: PayloadAction<any, string, { arg: PayloadAction }>) => {
                state.liveVideoData = action.payload?.data;
                state.totalLiveVideo = action?.payload?.total;
                state.isLoading = false;
            }
        );

        builder.addCase(
            getLiveVideo.rejected,
            (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            }
        );

        builder.addCase(
            getVideoDetails.rejected,
            (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            }
        );

        builder.addCase(
            getVideoDetails.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder.addCase(
            getVideoDetails.fulfilled,
            (state, action: PayloadAction<any, string, { arg: PayloadAction }>) => {
                state.videoData = action.payload?.data;
                state.isLoading = false;
            }
        );

        builder.addCase(
            activeVideo.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder.addCase(
            activeVideo.fulfilled,
            (state, action: PayloadAction<any>) => {
                if (action?.payload?.data?.status) {
                    const updateLiveVideo = action.payload.data.data;
                    const liveVideoDataIndex = state.liveVideoData.findIndex(
                        (liveVideoData) => liveVideoData?._id === updateLiveVideo?._id
                    );

                    if (liveVideoDataIndex !== -1) {
                        state.liveVideoData[liveVideoDataIndex].isLive =
                            updateLiveVideo?.isLive;
                    }
                    setToast("success", "Live Video Added Successfully");
                }
                state.isLoading = false;
            }
        );

        builder.addCase(activeVideo.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(
            deleteVideoOfSeller.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder.addCase(
            deleteVideoOfSeller.fulfilled,
            (state, action: PayloadAction<any, string, { arg: AllVideoPayload }>) => {
                state.isLoading = false;

                if (action?.payload?.status === true) {

                    const deletedUserIds = action.meta.arg;
                    state.realSellerVideo = state.realSellerVideo.filter(
                        (video: any) => video?._id !== deletedUserIds
                    );
                    setToast("success", " Video Delete Successfully");
                } else {
                    setToast("error", action?.payload?.message);
                }
            }
        );

        builder.addCase(
            deleteVideoOfSeller.rejected,
            (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            }
        );

        builder.addCase(
            deleteVideoOfFakeSeller.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder.addCase(
            deleteVideoOfFakeSeller.fulfilled,
            (state, action) => {
                state.isLoading = false;
        
                if (action?.payload?.status === true) {
                    const deletedVideoId = action.meta.arg;
        
                    state.fakeSellerVideo = state.fakeSellerVideo.filter((video: any) => {
                        const videoId = video?.video?._id || video?._id;
                        return videoId !== deletedVideoId;
                    });
        
                    setToast("success", "Video Deleted Successfully");
                } else {
                    setToast("error", action?.payload?.message);
                }
            }
        );
        

        builder.addCase(
            deleteVideoOfFakeSeller.rejected,
            (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            }
        );

        builder.addCase(addVideoOfSeller.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            addVideoOfSeller.fulfilled,
            (state, action: PayloadAction<any>) => {

                state.isLoading = false;
                if (action.payload.status === true) {

                    const newVideoData = {
                        ...action.payload.video,
                        fakeSellerVideo: action.payload.video // Ensure video property is properly added
                    };

                    state.fakeSellerVideo?.unshift(newVideoData);
                    setToast("success", `New Video Created`);
                } else {
                    setToast("error", action?.payload?.message);
                }
            }
        );

        builder.addCase(addVideoOfSeller.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(updateFakeVideo.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(
            updateFakeVideo.fulfilled,
            (state, action: PayloadAction<any, string, { arg: AllVideoPayload }>) => {
                state.isLoading = false;
                if (action?.payload?.status === true) {
                    const videoIndex = state.fakeSellerVideo.findIndex(
                        (video) => video?._id === action?.payload?.video?.video?._id
                    );
                    if (videoIndex !== -1) {
                        state.fakeSellerVideo[videoIndex] = {
                            ...state.fakeSellerVideo[videoIndex],
                            ...action.payload.video.video,
                        };
                    }
                    window.location.reload()
                    setToast("success", ` Video Update Successfully`);
                } else {
                    setToast("error", action?.payload?.message)
                }
            }
        );

        builder.addCase(updateFakeVideo.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default sellerVideoReducer.reducer;
