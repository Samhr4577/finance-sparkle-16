
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { playSoundEffect } from '@/lib/audio';

interface TableColumn {
  name: string;
  type: string;
  isPrimary: boolean;
}

const DatabaseManager = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('create');
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<TableColumn[]>([
    { name: 'id', type: 'uuid', isPrimary: true }
  ]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Check if we're connected to Supabase
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
      
      if (error && error.message.includes('auth/invalid_credentials')) {
        setIsConnected(false);
        toast.error('Invalid Supabase credentials');
      } else {
        setIsConnected(true);
        fetchTables();
      }
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnected(false);
    }
  };

  // Fetch all tables
  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .rpc('get_tables');
      
      if (error) throw error;
      
      if (data) {
        setTables(data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to fetch tables');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new column
  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'text', isPrimary: false }]);
  };

  // Update column details
  const updateColumn = (index: number, field: keyof TableColumn, value: string | boolean) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  // Remove a column
  const removeColumn = (index: number) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== index));
  };

  // Generate SQL for creating table
  const generateSQL = () => {
    if (!tableName) {
      toast.error('Please enter a table name');
      return;
    }

    const columnDefinitions = columns
      .map(col => {
        let definition = `"${col.name}" ${col.type}`;
        if (col.isPrimary) definition += ' PRIMARY KEY';
        return definition;
      })
      .join(', ');

    const sql = `CREATE TABLE "${tableName}" (${columnDefinitions});`;
    setSqlQuery(sql);
    return sql;
  };

  // Execute SQL query
  const executeSQL = async () => {
    try {
      setIsLoading(true);
      let query = sqlQuery;
      
      if (!query) {
        query = generateSQL() || '';
      }

      if (!query) return;

      const { data, error } = await supabase.rpc('run_sql_query', {
        query: query
      });

      if (error) throw error;
      
      playSoundEffect('success');
      toast.success('Query executed successfully');
      fetchTables();
      setCurrentTab('browse');
    } catch (error: any) {
      console.error('Error executing SQL:', error);
      playSoundEffect('error');
      toast.error(`Failed to execute query: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Alert className="mt-4">
        <AlertTitle>Not connected to Supabase</AlertTitle>
        <AlertDescription>
          Please make sure you have set your Supabase URL and anon key in the environment variables.
          Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Manager</CardTitle>
        <CardDescription>
          Create and manage your Supabase database tables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Table</TabsTrigger>
            <TabsTrigger value="browse">Browse Tables</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Table Name</label>
                <Input 
                  value={tableName} 
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Enter table name"
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Columns</label>
                  <Button size="sm" onClick={addColumn}>Add Column</Button>
                </div>
                
                {columns.map((column, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        placeholder="Column name"
                      />
                    </div>
                    <div className="col-span-4">
                      <select 
                        value={column.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="text">text</option>
                        <option value="integer">integer</option>
                        <option value="boolean">boolean</option>
                        <option value="uuid">uuid</option>
                        <option value="timestamp">timestamp</option>
                        <option value="jsonb">jsonb</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={column.isPrimary}
                          onChange={(e) => updateColumn(index, 'isPrimary', e.target.checked)}
                          disabled={index === 0} // id column is always primary
                          className="rounded"
                        />
                        <span className="ml-2 text-sm">PK</span>
                      </label>
                    </div>
                    <div className="col-span-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeColumn(index)}
                        disabled={index === 0} // Don't allow removing the ID column
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="text-sm font-medium">SQL Query</label>
                <Textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="Your SQL query will appear here"
                  className="mt-1 h-32 font-mono text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={generateSQL}>Generate SQL</Button>
                <Button onClick={executeSQL} disabled={isLoading}>
                  {isLoading ? 'Executing...' : 'Execute SQL'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="browse" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Available Tables</h3>
              <Button size="sm" onClick={fetchTables} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            {tables.length === 0 ? (
              <p className="text-muted-foreground">No tables found. Create your first table!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <Card key={table} className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{table}</CardTitle>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSqlQuery(`SELECT * FROM "${table}" LIMIT 100;`);
                          setCurrentTab('create');
                        }}
                      >
                        Query
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseManager;
