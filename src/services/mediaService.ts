import api from '../lib/api';
import { PresignUrlResponse } from '@/src/types/media'

export const mediaService = {
    async getPresignedUrl(titleId:string,fileName:string) : Promise<PresignUrlResponse> {
        const response = await api.post("/media/presign",{titleId,filename:fileName});
        return response.data;
    },

    async completeUpload(mediaId: string) {
        const res = await api.post(`/media/${mediaId}/complete`);
        return res.data;
    }
}

