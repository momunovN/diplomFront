import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-centered">
          <Outlet />
        </div>
      </main>
    </div>
  );
}