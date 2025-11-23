import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from '@/components/ui/card';
import { Fog } from '@/components/ui/fog';
import { Motes } from '@/components/ui/motes';
import { SpotlightArea } from '@/components/ui/spotlight-area';

export default async function TestPage() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-16">
        <div>
          <h1 className="relative z-20 py-12 pt-60 text-center text-6xl font-bold text-white md:text-7xl lg:text-7xl">
            <Fog />
            GPUCloud
          </h1>
          <div className="relative h-60 w-[40rem]">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
            <div className="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <div className="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm" />
            <div className="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
            <Motes
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="h-full w-full"
              particleColor="#FFFFFF"
            />
            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
        <div className="relative flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="relative -top-[200px] z-10 w-[300px] overflow-clip bg-black p-4 text-white"
            >
              <CardContent>
                <CardTitle>Test</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="w-[300px] overflow-clip bg-black text-white">
          <SpotlightArea
            spotlightMode="fixed"
            spotlightPosition={{ x: '80%', y: '40%' }}
            radius={250}
            revealOnHover={false}
          >
            <CardContent className="p-6">
              <CardTitle className="pb-2 text-2xl font-bold">Test</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </CardDescription>
            </CardContent>
          </SpotlightArea>
        </Card>
      </div>
    </>
  );
}
