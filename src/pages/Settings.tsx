import { AppLayout } from "@/components/layout/AppLayout";
import { CategoryManager } from "@/components/category/CategoryManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryManager />
          </CardContent>
        </Card>
        
        {/* Other settings can go here */}
      </div>
    </AppLayout>
  );
}
