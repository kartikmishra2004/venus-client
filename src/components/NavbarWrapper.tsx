import { isAuthenticated } from '@/lib/auth';
import Navbar from './Navbar';

export default async function NavbarWrapper() {
    const isLoggedIn = await isAuthenticated();
    return <Navbar isLoggedIn={isLoggedIn} />;
}