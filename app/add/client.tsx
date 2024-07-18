"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Song = {
  id: number;
  songtitle: string;
  artist: string;
  year: number;
  genre: string;
};

export default function Client({
  addSong,
}: {
  addSong: (songInfo: Omit<Song, "id">) => Promise<string>;
}) {
  const [songtitle, setSongtitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!songtitle || !artist || !year || !genre) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);

    const newSong: Omit<Song, "id"> = {
      songtitle,
      artist,
      year: Number(year),
      genre,
    };
    try {
      const response = await addSong(newSong);
      alert(response);
      setSongtitle("");
      setArtist("");
      setYear("");
      setGenre("");
    } catch (error) {
      alert("Failed to add song.");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.main
        initial={{ x: 300, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        exit={{
          x: -300,
          opacity: 0,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        key="home"
        className="flex-1 container px-4 md:px-6 py-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Music Library</CardTitle>
            <CardDescription>Add new music to your library.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="songtitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Song Title
                </label>
                <Input
                  id="songtitle"
                  type="text"
                  value={songtitle}
                  onChange={(e) => setSongtitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="artist"
                  className="block text-sm font-medium text-gray-700"
                >
                  Artist
                </label>
                <Input
                  id="artist"
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(
                      isNaN(Number(e.target.value))
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Genre
                </label>
                <Input
                  id="genre"
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="other"
              onClick={handleSubmit}
              loading={loading}
              className={
                "w-full py-2 px-4 text-white rounded-md " +
                (loading ? "cursor-not-allowed bg-gray-500" : "bg-indigo-600")
              }
            >
              Add Song
            </Button>
          </CardFooter>
        </Card>
      </motion.main>
    </AnimatePresence>
  );
}
