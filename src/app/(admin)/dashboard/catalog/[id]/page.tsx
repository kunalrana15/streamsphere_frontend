"use client";

import { useParams } from "next/navigation";
import UploadMedia from "../../../components/media/UploadMedia";

export default function CatalogDetailPage() {
    const params = useParams();

    const titleId = params.id as string;

    return (
        <div>
            <h1>Catalog Title</h1>
            <p>ID: {titleId}</p>

            <UploadMedia titleId={titleId} />
        </div>
    )
}