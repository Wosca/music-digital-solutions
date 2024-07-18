"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Song = {
  id: number;
  songtitle: string;
  artist: string;
  year: number;
  genre: string;
};

export default function Client({
  requestSongs,
  updateSong,
  deleteSong,
}: {
  requestSongs: (searchTerm: string) => Promise<any[]>;
  updateSong: (songInfo: Song) => Promise<string>;
  deleteSong: (songInfo: Song) => Promise<string>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (searchTerm !== "") setFetching(true);
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm === "") return;
      const requestedSongs = await requestSongs(searchTerm);

      setSongs(requestedSongs);
      setFetching(false);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <b key={index} className="font-bold">
          {part}
        </b>
      ) : (
        part
      )
    );
  };

  const handleSubmit = async (song: Song) => {
    if (!song.songtitle || !song.artist || !song.year || !song.genre) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);

    const newSong: Song = {
      id: song.id,
      songtitle: song.songtitle,
      artist: song.artist,
      year: Number(song.year),
      genre: song.genre,
    };
    try {
      const response = await updateSong(newSong);
      setSearchTerm("");
    } catch (error) {
      alert("Failed to update song.");
    }
    setLoading(false);
  };

  const handleDelete = async (song: Song) => {
    setFetching(true);
    try {
      await deleteSong(song);
      setSearchTerm("");
    } catch (error) {
      alert("Failed to delete song.");
    }
    setFetching(false);
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
            <CardDescription>
              Browse and manage your music collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <Input
                  type="text"
                  value={searchTerm}
                  placeholder="Search..."
                  className="rounded-md border border-gray-300 py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {fetching === true && (
              <div className="flex items-center justify-center">
                <p className="ml-2 text-sm text-gray-500">Loading...</p>
              </div>
            )}
            {fetching === false && searchTerm !== "" && songs.length === 0 && (
              <div className="flex items-center justify-center">
                <p className="ml-2 text-sm text-gray-500">No results found.</p>
              </div>
            )}
            {searchTerm === "" && fetching === false && (
              <div className="flex items-center justify-center">
                <p className="ml-2 text-sm text-gray-500">
                  Start by entering a search term.
                </p>
              </div>
            )}
            {searchTerm !== "" &&
              fetching === false &&
              songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-2 border-b border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      onClick={() => setSearchTerm(song.songtitle)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {highlightText(song.songtitle, searchTerm)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      onClick={() => setSearchTerm(song.artist)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {highlightText(song.artist, searchTerm)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <a
                      onClick={() => setSearchTerm(song.genre)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {highlightText(song.genre, searchTerm)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="black"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form
                          onSubmit={(e: any) => {
                            e.preventDefault();
                            const newSong: Song = {
                              id: Number(song.id),
                              songtitle: e.target[0].value,
                              artist: e.target[1].value,
                              year: Number(e.target[2].value),
                              genre: e.target[3].value,
                            };
                            handleSubmit(newSong);
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Song Name
                              </Label>
                              <Input
                                id="name"
                                defaultValue={song.songtitle}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="artist" className="text-right">
                                Song Artist
                              </Label>
                              <Input
                                id="artist"
                                defaultValue={song.artist}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="year" className="text-right">
                                Year
                              </Label>
                              <Input
                                id="year"
                                defaultValue={song.year}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="genre" className="text-right">
                                Genre
                              </Label>
                              <Input
                                id="genre"
                                defaultValue={song.genre}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              loading={loading}
                              onClick={() => setLoading(!loading)}
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete {song.songtitle}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this song and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(song)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </CardContent>
          <CardFooter>
            {/* <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="select-none"
                  loading={loading}
                  onClick={() => {
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  isActive={currentPage !== 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <Paginationa
                    loading={loading}
                    className="select-none"
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Paginationa>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  loading={loading}
                  className="select-none"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isActive={currentPage !== totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination> */}
          </CardFooter>
        </Card>
      </motion.main>
    </AnimatePresence>
  );
}
