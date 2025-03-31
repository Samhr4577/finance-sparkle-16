
import { AppLayout } from "@/components/layout/AppLayout";
import DatabaseManager from "@/components/supabase/DatabaseManager";

export default function DatabasePage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Management</h1>
        
        <div className="space-y-6">
          <DatabaseManager />
        </div>
      </div>
    </AppLayout>
  );
}
