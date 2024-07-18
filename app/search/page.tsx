import { changeSong, searchSongs, deleteSong } from "@/drizzle/schema";
import Client from "./client";

type Song = {
  id: number;
  songtitle: string;
  artist: string;
  year: number;
  genre: string;
};

export default function Page() {
  const requestSongs = async (searchTerm: string) => {
    "use server";
    const songs = await searchSongs(searchTerm);
    return songs;
  };
  const updateSong = async (songInfo: Song) => {
    "use server";
    const updatedSong = await changeSong(songInfo);
    return "success";
  };
  const deleteTheSong = async (songInfo: Song) => {
    "use server";
    await deleteSong(songInfo);
    return "success";
  };
  return (
    <Client
      requestSongs={requestSongs}
      updateSong={updateSong}
      deleteSong={deleteTheSong}
    />
  );
}
