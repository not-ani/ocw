const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {

  return (
    <div className="h-full">
      <main className="pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
}

export default Layout;
