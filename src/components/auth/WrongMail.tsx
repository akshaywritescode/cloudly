"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import PasswordInput from "../PasswordInput";
import { getAccount } from "@/lib/appwrite";

export function WrongMailDialog() {
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleEmailChange() {
    try {
      const account = getAccount();
      await account.updateEmail(newEmail, oldPassword);
      localStorage.setItem('verify-email', newEmail);
      setMessage("Updated Successfully, Resending mail..")
      await account.createVerification(`${window.location.origin}/verify-account`);
      window.location.reload();
    } catch (err: any) {
      setError(`${err.message}`);
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full cursor-pointer">Entered Wrong mail?</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update your email</DialogTitle>
            <DialogDescription>
              If you previously entered the wrong email, please provide the correct one along with the password you used during registration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">New Email</Label>
              <Input id="email" type="email" placeholder="example@email.com" onChange={(e) => setNewEmail(e.target.value)} value={newEmail} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Old Password</Label>
              <PasswordInput placeholder="Old Password" onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            {message && (<span className="text-xs text-green-600">{message}</span>)}
            {error && (<span className="text-xs text-red-600">{error}</span>)}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={() => handleEmailChange()}>Update Email</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
