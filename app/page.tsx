"use server";
import { getNumberOfPages, getSongs } from "@/drizzle/schema";
import Client from "./client";
export default async function Home() {
  const getPagedSongs = async (page: number) => {
    "use server";
    const songs = await getSongs(page);
    const totalPages = await getNumberOfPages();

    const obj = {
      songs,
      totalPages,
    };
    return obj;
  };
  const getAmountOfPages = async () => {
    "use server";
    return await getNumberOfPages();
  };
  return (
    <Client getPagedSongs={getPagedSongs} getAmountOfPages={getAmountOfPages} />
  );
}
