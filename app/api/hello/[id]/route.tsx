export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return new Response(`Hello, Next.js! ${params.id}`, {
    status: 200,
  });
}
