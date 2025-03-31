
import { AppLayout } from "@/components/layout/AppLayout";
import DatabaseManager from "@/components/supabase/DatabaseManager";

export default function DatabasePage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Management</h1>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              <strong>Important:</strong> To use this feature, you need to set up the following environment variables:
            </p>
            <ul className="list-disc ml-5 mt-2 text-yellow-700">
              <li><code>VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
              <li><code>VITE_SUPABASE_ANON_KEY</code> - Your Supabase project anon key (public API key)</li>
            </ul>
            <p className="mt-2 text-yellow-700">
              You can find these in your Supabase project dashboard under Project Settings > API.
            </p>
          </div>
          
          <DatabaseManager />
        </div>
      </div>
    </AppLayout>
  );
}
