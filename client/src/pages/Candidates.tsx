import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate } from "../types";
import { getImageUrl } from "../utils/getImageUrl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchCandidates() {
    try {
      const res = await API.get("/candidates");
      setCandidates(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await API.delete(`/candidates/${deleteId}`);
      setCandidates((prev) => prev.filter((c) => c._id !== deleteId));
      toast.success("Candidate deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete candidate");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Candidates</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage nominees, review profiles, and track vote activity.
            </p>
          </div>
          <Button render={<Link to="/candidates/add" />}>
            Add Candidate
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Total Candidates
              </p>
              <p className="mt-1 text-3xl font-semibold">{candidates.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Total Votes
              </p>
              <p className="mt-1 text-3xl font-semibold">{totalVotes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <p className="mt-1 text-3xl font-semibold">Active List</p>
            </CardContent>
          </Card>
        </div>

        {/* Candidate list */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Loading candidates...
            </CardContent>
          </Card>
        ) : candidates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold">No candidates yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start by adding your first candidate to the voting system.
              </p>
              <Button className="mt-5" render={<Link to="/candidates/add" />}>
                Add Candidate
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {candidates.map((candidate) => (
              <Card
                key={candidate._id}
                className="group overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <img
                    src={getImageUrl(candidate.image)}
                    alt={candidate.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute left-3 top-3" variant="secondary">
                    {candidate.category}
                  </Badge>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      {candidate.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {candidate.department}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Votes
                      </p>
                      <p className="text-lg font-semibold">{candidate.votes}</p>
                    </div>
                    <Link
                      to={`/candidate-view/${candidate.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink size={14} />
                      View
                    </Link>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      render={<Link to={`/candidates/edit/${candidate._id}`} />}
                    >
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      size="sm"
                      onClick={() => setDeleteId(candidate._id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this candidate? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
