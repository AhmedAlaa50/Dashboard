"use client";
import Table from "@/components/table";
import AgeChart from "@/components/AgeChart";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

import { useSelector } from "react-redux";
import { selectUserEmail } from "@/store/authSlice";

export default function Home() {
  const userEmail = useSelector(selectUserEmail);

  return (
    <main className="lg:p-[100px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          {userEmail ? (
            <p className="text-sm text-gray-600">Signed in as: {userEmail}</p>
          ) : (
            <p className="text-sm text-gray-600">Not signed in</p>
          )}
        </div>
        <div className="flex space-x-4">
          <Link href="/login"><Button variant="default">Login</Button></Link>
          <Link href="/signup"><Button variant="outline">Signup</Button></Link>
        </div>
      </div>
      <Table />
      <AgeChart />
    </main>
  );
}
