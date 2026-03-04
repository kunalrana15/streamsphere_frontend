
export interface Title {
    _id: string,
    name: string,
    description: string,
    genres: string[],
    isLive: boolean,
    releaseYear: number,
    thumbnailUrl: string,
    type: "movie" | "series",
    language: string
    __v: number
    createdAt: Date,
    updatedAt: Date,
}