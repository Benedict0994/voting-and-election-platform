import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Save, UserRound, Trophy, Building2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AddCandidate() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    department: "",
    bio: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  const isFormValid = useMemo(
    () => formData.name.trim() && formData.category.trim() && formData.department.trim() && image,
    [formData, image],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("department", formData.department);
      payload.append("bio", formData.bio);
      if (image) payload.append("image", image);

      await API.post("/candidates", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Candidate added successfully");
      navigate("/candidates");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add candidate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Candidate Management
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Add Candidate</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a new candidate profile with image, category, and biography.
            </p>
          </div>
          <Badge variant={isFormValid ? "default" : "secondary"}>
            {isFormValid ? "Ready" : "Incomplete"}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
              <CardDescription>
                Fill in the required information to create a candidate profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <UserRound size={14} /> Candidate Name
                    </Label>
                    <Input
                      name="name"
                      placeholder="Enter candidate name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Trophy size={14} /> Award Category
                    </Label>
                    <Input
                      name="category"
                      placeholder="Enter award category"
                      value={formData.category}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 size={14} /> Department
                  </Label>
                  <Input
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText size={14} /> Candidate Bio
                  </Label>
                  <Textarea
                    name="bio"
                    placeholder="Write a short biography or description"
                    value={formData.bio}
                    onChange={handleChange}
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ImagePlus size={14} /> Candidate Image
                  </Label>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 px-6 py-10 text-center transition hover:border-primary hover:bg-muted/50">
                    <ImagePlus size={28} className="text-muted-foreground" />
                    <span className="mt-3 text-sm font-medium">
                      Click to upload candidate image
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG, or WEBP supported
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <Button type="submit" disabled={loading || !isFormValid}>
                  <Save size={16} className="mr-2" />
                  {loading ? "Saving..." : "Save Candidate"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Live Preview</CardTitle>
                <CardDescription>
                  How the candidate card will appear.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image selected
                      </div>
                    )}
                    <Badge variant="secondary" className="absolute left-3 top-3">
                      {formData.category || "Category"}
                    </Badge>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="font-semibold">{formData.name || "Candidate Name"}</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.department || "Department"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Votes
                      </p>
                      <p className="text-lg font-semibold">0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <p className="text-sm font-semibold">Admin Note</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Candidates will appear on the dashboard and public profile page
                  immediately after creation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
