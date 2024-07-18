import { sql } from "@vercel/postgres";
import { pgTable, varchar, serial, integer } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { count, eq, ilike, or } from "drizzle-orm";

export const db = drizzle(sql);

type Song = {
  id: number;
  songtitle: string;
  artist: string;
  year: number;
  genre: string;
};

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  songtitle: varchar("songtitle", { length: 40 }).notNull(),
  artist: varchar("artist", { length: 30 }).notNull(),
  year: integer("year"),
  genre: varchar("genre", { length: 30 }).notNull(),
});

export const getSongs = async (page: number) => {
  const offset = (page - 1) * 5;
  return await db.select().from(songs).offset(offset).limit(5);
};

export const getNumberOfPages = async () => {
  const rowCount = await db.select({ count: count() }).from(songs);
  return Math.ceil(rowCount[0].count / 5);
};

export const searchSongs = async (searchTerm: string) => {
  const returnedSongs = await db
    .select()
    .from(songs)
    .where(
      or(
        ilike(songs.songtitle, `%${searchTerm}%`),
        ilike(songs.artist, `%${searchTerm}%`),
        ilike(songs.genre, `%${searchTerm}%`)
      )
    );
  return returnedSongs;
};

export const submitSong = async (songInfo: Song) => {
  const { songtitle, artist, year, genre } = songInfo;
  const newSong = await db.insert(songs).values({
    songtitle,
    artist,
    year,
    genre,
  });
  return newSong;
};

export const changeSong = async (songInfo: Song) => {
  const { songtitle, artist, year, genre } = songInfo;
  const updatedSong = await db
    .update(songs)
    .set({
      songtitle,
      artist,
      year,
      genre,
    })
    .where(eq(songs.id, songInfo.id));
  return updatedSong;
};

export const deleteSong = async (songInfo: Song) => {
  const { id } = songInfo;
  const deletedSong = await db.delete(songs).where(eq(songs.id, id));
  return "success";
};
