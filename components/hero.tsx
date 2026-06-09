import { Suspense } from "react";
import GetStarted from "./get-started";

export function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 sm:px-6  lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <span className="inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium">
            🌍 Breaking language barriers
          </span>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Chat with anyone,
            <span className="block mt-2">
              in your own language 💬
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 ">
            translates every message in real time, so everyone
            can chat naturally no matter what language they speak.
          </p>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Suspense>
              <GetStarted />
            </Suspense>
          </div>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-16 max-w-2xl space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full  text-lg font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold ">
                Create a room 🏠
              </h3>
              <p className="text-sm ">
                Start a private chat room in seconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full  text-lg font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold ">
                Invite anyone ↗️
              </h3>
              <p className="text-sm ">
                Share your room link with friends, clients, or teammates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full  text-lg font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold ">
                Chat instantly 🌐
              </h3>
              <p className="text-sm ">
                Everyone writes in their own language and understands each other automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
