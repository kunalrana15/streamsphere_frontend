"use client"

import React, { useState } from 'react';
import { mediaService } from "@/src/services/mediaService";

interface Props {
    titleId: string;
}


export default function UploadMedia({ titleId }: Props) {

    const [file,setFile] = useState<File | null>(null);
    const [uploading,setUploading] = useState(false);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if(e.target.files?.length) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async() => {
        if(!file) return ;

        try {

            setUploading(true);

            const { presignedUrl,mediaId } = await mediaService.getPresignedUrl(titleId,file.name);

            // after presigned generation upload the video to presigned Url in binary format
            await fetch(presignedUrl,{
                method: "PUT",
                headers: {
                    "content-Type": file.type
                },
                body: file
            })

            // Notify backend upload complete by completeUpload api call
            await mediaService.completeUpload(mediaId);

            alert("Upload Successfull");

            setFile(null);
        } catch(error) {
            console.error(error);
            alert("Upload Failed");
        } finally {
            setUploading(false)
        }
    };

    return (
        <div className='bg-zinc-900 p-6 rounded-xl max-w-md'>

            <h2 className='text-white font-semibold mb-4'>
                Upload Video
            </h2>

            <input
             type="file"
             accept='video/*'
             onChange={handleFileChange}
             className='mb-4 text-white' />

             <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className='bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50' >
                { uploading ? "Uploading..." : "Upload" }
             </button>

        </div>
    )

}
