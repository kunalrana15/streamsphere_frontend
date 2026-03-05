

export interface PresignedUploadRequest {
    fileName: string;
    contentType: string;
}

export interface PresignUrlResponse {
    mediaId: string;
    presignedUrl: string;
    objectKey: string;
    expiresInSec: number;
}