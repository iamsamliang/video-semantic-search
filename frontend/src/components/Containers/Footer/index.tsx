import GitHub from "@/components/Icons/Social/GitHub";

export default function Footer() {
  return (
    <footer className="flex justify-center items-center gap-4 mt-auto py-4 border-neutral-200 dark:border-neutral-800 border-t">
      <div>
        <span className="font-thin">&copy;</span> Sam Liang
      </div>
      <a
        href="https://github.com/iamsamliang/video-semantic-search"
        target="_blank"
      >
        <GitHub className="flex items-center justify-center size-6" />
      </a>
    </footer>
  );
}
