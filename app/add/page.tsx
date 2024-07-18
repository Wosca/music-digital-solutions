import { searchSongs, submitSong } from "@/drizzle/schema";
import Client from "./client";
type Song = {
  songtitle: string;
  artist: string;
  year: number;
  genre: string;
};

export default function Page() {
  const addSong = async (songInfo: Omit<Song, "id">) => {
    "use server";
    await submitSong(songInfo);
    return "success";
  };
  return <Client addSong={addSong} />;
}
