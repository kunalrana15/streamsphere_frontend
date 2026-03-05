import api from '../lib/api';
import { PresignUrlResponse } from '@/src/types/media'

export const mediaService = {
    async getPresignedUrl(titleId:string,fileName:string) : Promise<PresignUrlResponse> {
        const response = await api.post("/media/presign",{titleId,fileName});
        return response.data;
    }
}