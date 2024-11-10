export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <div className="basis-[400px]">
        <div className="fixed w-[300px] h-[90vh] top-[0] left-[0] border-r bg-[#7A003C] rounded-lg m-12 p-6">
          <h1 className="text-2xl font-extrabold">Room8</h1>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
