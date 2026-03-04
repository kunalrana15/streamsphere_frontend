"use client";

import { useForm } from "react-hook-form";
import { catalogService } from "@/src/services/catalogService";
import { useRouter } from "next/navigation";

export default function AddTitlePage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    await catalogService.createTitle({
      ...data,
      genres: data.genres.split(","),
      releaseYear: Number(data.releaseYear),
      isLive: true
    });

    router.replace("/dashboard/catalog");
  };

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">
        Add New Title
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          {...register("name")}
          placeholder="Title Name"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          {...register("language")}
          placeholder="Language"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          {...register("releaseYear")}
          placeholder="Release Year"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          {...register("thumbnailUrl")}
          placeholder="Thumbnail URL"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          {...register("genres")}
          placeholder="Genres (comma separated)"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <select
          {...register("type")}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        >
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 px-4 py-3 rounded-lg w-full"
        >
          Create Title
        </button>

      </form>
    </div>
  );
}