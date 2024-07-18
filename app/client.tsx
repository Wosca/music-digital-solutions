"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { AnimatePresence, motion } from "framer-motion";

type Song = {
  id: number;
  songtitle: string;
  artist: string;
  year: number;
  genre: string;
};

export default function Client({
  getPagedSongs,
  getAmountOfPages,
}: {
  getPagedSongs: (page: number) => Promise<any>;
  getAmountOfPages: () => Promise<number>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (page: number) => {
    setLoading(true);
    getPagedSongs(page).then((data) => {
      if (data.songs.length > 0) {
        setSongs(data.songs);
        setCurrentPage(page);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);

    getPagedSongs(currentPage).then((data) => {
      if (data.songs.length > 0) {
        setSongs(data.songs);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    });
  }, []);

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
        key="search"
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songs.map((song, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link href="#" className="font-medium" prefetch={false}>
                        {song.songtitle}
                      </Link>
                    </TableCell>
                    <TableCell>{song.artist}</TableCell>
                    <TableCell>{song.genre}</TableCell>
                    <TableCell>{song.year}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Pagination>
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
                    <PaginationLink
                      loading={loading}
                      className="select-none"
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
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
            </Pagination>
          </CardFooter>
        </Card>
      </motion.main>
    </AnimatePresence>
  );
}
