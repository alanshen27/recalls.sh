"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2 } from "lucide-react"
import { Loading } from "@/components/ui/loading"

interface ShareSetDialogProps {
  setId: string
  title: string
}

export function ShareSetDialog({ setId, title }: ShareSetDialogProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShare = async () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/sets/${setId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to share set")
      }

      setEmail("")
      // You might want to add a success toast here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share set")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share &quot;{title}&quot;</DialogTitle>
          <DialogDescription>
            Share this flashcard set with another user by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <Button onClick={handleShare} disabled={isLoading} className="w-full">
            {isLoading ? <Loading variant="inline" className="h-4 w-4" /> : "Share"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 