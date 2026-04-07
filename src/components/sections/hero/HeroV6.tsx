type Props = {
  title?: string;
};

export default function HeroV6({
  title = "Hero Version 6",
}: Props) {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="mt-4">Dynamic Hero Section 6</p>
    </section>
  );
}
