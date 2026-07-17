import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🔒",
      title: "100% Anonymous",
      description:
        "No account is required. Share your thoughts privately and safely.",
    },
    {
      icon: "❤️",
      title: "Compassionate Support",
      description:
        "Every message is received with empathy, respect, and care.",
    },
    {
      icon: "🤝",
      title: "Judgment-Free",
      description:
        "Express yourself honestly in a safe and supportive environment.",
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">

        {/* Hero */}
        <section className="text-center py-8 md:py-16">
          <PageHeader
            title="Safe Space"
            subtitle="A place where your voice is heard. Share your thoughts anonymously and receive compassionate support when you need it most."
          />

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

            <Button
              className="sm:w-auto"
              onClick={() => navigate("/write")}
            >
              ✍️ Share What's On Your Mind
            </Button>

            <Button
              variant="secondary"
              className="sm:w-auto"
              onClick={() => navigate("/check-reply")}
            >
              💬 Check My Reply
            </Button>

          </div>

        </section>

        {/* Mission */}
        <Card className="mb-10 bg-gradient-to-r from-violet-600 to-purple-700 text-white">

          <div className="text-center">

            <div className="text-5xl mb-4">
              ❤️
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Every Story Matters
            </h2>

            <p className="max-w-2xl mx-auto leading-8 text-violet-100">
              Whether you're feeling overwhelmed, anxious, lonely,
              or simply need someone to listen, Safe Space is here
              to remind you that you don't have to carry everything
              alone.
            </p>

          </div>

        </Card>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3">

          {features.map((feature) => (

            <Card
              key={feature.title}
              className="
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >

              <div className="text-5xl mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {feature.description}
              </p>

            </Card>

          ))}

        </section>

        <Card className="mt-10 border-violet-100 bg-violet-50/80 text-center dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            Private conversation support
          </p>
          <p className="mt-3 text-lg leading-8 text-gray-700 dark:text-slate-300">
            We’d love to hear from you. Whether you have questions, feedback, or would like to support our mission, feel free to reach out. We’ll get back to you as soon as we can.
          </p>
          <a
            href="mailto:Safespacepeer@gmail.com"
            className="mt-4 inline-block text-lg font-semibold text-violet-700 transition hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
          >
            Safespacepeer@gmail.com
          </a>
        </Card>

      </div>
    </Layout>
  );
}

export default Home;