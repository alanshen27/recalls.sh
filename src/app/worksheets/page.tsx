import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

async function getWorksheets() {
  const res = await fetch(`/api/worksheets`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch worksheets');
  }
  
  return res.json();
}

export default async function WorksheetsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  const worksheets = await getWorksheets();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Worksheets</h1>
        <Button asChild>
          <Link href="/worksheets/new">
            Create New Worksheet
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worksheets.map((worksheet: any) => (
          <Link key={worksheet.id} href={`/worksheets/${worksheet.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{worksheet.title}</CardTitle>
                <CardDescription>
                  {worksheet.contents.length} content blocks
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 