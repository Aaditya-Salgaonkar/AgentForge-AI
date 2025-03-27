import React from 'react'
import Link from "next/link";
import { Card,CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Command,Globe } from 'lucide-react';
export default function SideBar() {
  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-2">
  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
    <CardContent className="p-4">
      <nav className="space-y-2">
        <Link href={"/home"}>
          <NavItem icon={Command} label="Dashboard" active />
        </Link>
        <Link href={"/marketplace"}>
          <NavItem icon={Globe} label="Store" />
        </Link>
      </nav>
    </CardContent>
  </Card>
</div>
  )
}




// Component for nav items
function NavItem({ icon: Icon, label, active }) {
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    )
  }