import { ShareAuthenticated } from "./components/ShareAuthenticated";

interface SharePageProps {
    searchParams: Promise<{
        songUrl?: string;
    }>
}

export default async function SharePage({searchParams}: SharePageProps) {
    const {songUrl} = await searchParams;

    return (
        <ShareAuthenticated songUrl={songUrl} />
    )
}