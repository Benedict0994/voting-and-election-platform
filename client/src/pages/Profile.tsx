import DashboardLayout from "../components/layout/DashboardLayout";
import useAuth from "../context/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-2xl">{user?.name || "Admin User"}</CardTitle>
            <CardDescription>{user?.email || "admin@example.com"}</CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4 pt-6">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-base font-semibold">{user?.name || "N/A"}</p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-base font-semibold">{user?.email || "N/A"}</p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Award Space
              </p>
              <p className="mt-1 text-base font-semibold">{user?.awardSpace || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
