"use client";

import { Menu } from "lucide-react";
import { type Session } from "next-auth";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { AuthPanel, Navlinks } from "./navbar";

export default function MobileNav({ session }: { session: Session | null }) {
  const [visible, setVisible] = useState(false);
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          icon={<Menu />}
          onClick={() => setVisible(!visible)}
        />
      </DrawerTrigger>
      <DrawerContent variant="right">
        <DrawerHeader variant="right" className="flex flex-col gap-4">
          <DrawerTitle>BOZO Gate</DrawerTitle>
          <DrawerDescription className="flex flex-col gap-8">
            <Navlinks session={session} />
            <AuthPanel session={session} />
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
