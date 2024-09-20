import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /main
  redirect('/main');

  return null;
}